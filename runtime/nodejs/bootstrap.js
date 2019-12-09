/* eslint-disable */
var runtime = require('./runtime')
var util = require('util')

var initHandlerFault = 'function initialization failed'
var maxRetMsgLen = 6 * 1024 * 1024 // byte
var maxRetMsgLenExceedError = 'body size is too long'
var httpHandler, eventHandler

var _result, _fault
var _user_exception = false

function wrapLog(invokeId) {
    console.log = console.info = function prettyConsoleLog() {
        var message = `${util.format.apply(this, arguments)}`
        runtime.console_log(message)
    }
    console.error = console.warn = function prettyConsoleLogErr() {
        var message = `${util.format.apply(this, arguments)}`
        runtime.console_log(message, (err = true))
    }
}

function main() {
    if (0 != runtime.init()) {
        console.log('runtime init failed')
        return
    }
    runtime.log('init succ')

    cleanEnv()

    process.on('beforeExit', () => {
        runtime.log('catch exit')
        finish(null, null, false)
    })
    process.on('uncaughtException', err => {
        runtime.log('catch exception')
        finish(err, null, false)
    })

    waitForInvoke()
}

function cleanEnv() {
    var envToDelete = ['SOCKETPATH', 'CONTAINERID']
    for (var k in process.env) {
        if (k.startsWith('KUBERNETES')) {
            envToDelete.push(k)
        }
    }

    envToDelete.forEach(e => {
        delete process.env[e]
    })
}

function waitForInvoke() {
    runtime.log('wait for invoke')
    var invokeInfo = runtime.wait_for_invoke()
    setTimeout(() => {
        runtime.log('timed out, invoke')
        invoke(invokeInfo)
    }, 0)
}

function invoke(invokeInfo) {
    if (invokeInfo.cmd === 'RELOAD') {
        runtime.log(`get reload request: ${invokeInfo.context}`)
        var ff = invokeInfo.context.split('.')
        initHandler(ff[ff.length - 2], ff[ff.length - 1])
        runtime.log('handlers reloaded')
        _result = 'reload'
        finish(null, null, false)
        return
    }

    _result = undefined
    _fault = undefined

    runtime.report_running()

    var ev, ctx
    if (invokeInfo.event || invokeInfo.context) {
        try {
            ev = JSON.parse(invokeInfo.event)
            ctx = JSON.parse(invokeInfo.context)
        } catch (err) {
            _fault = `eval event[${invokeInfo.event}] or context [${invokeInfo.context}] failed\n${err}`
            return
        }
    }

    ctx['environ'].split(';').forEach(e => {
        if (e == '') return
        var kv = e.split('=', 2)
        process.env[kv[0]] = kv[1]
    })

    runtime.log(`request[${ctx['request_id']}] invoked`)

    if (!httpHandler && !eventHandler) {
        _fault = initHandlerFault
        return
    }

    wrapLog(ctx['request_id'])
    if (invokeInfo.cmd === 'HTTP') {
        httpHandler.handle(invokeInfo.sockfd)
    } else if (invokeInfo.cmd === 'EVENT') {
        eventHandler.handle(ev, ctx)
    } else {
        _fault = `recv unknown task type: ${invokeInfo.cmd}`
        runtime.log(`recv unknown task type: ${invokeInfo.cmd}`)
    }

    runtime.log('process finished')
}

function initHandler(file, func) {
    try {
        var path = require('path')
        var current_path = path.dirname(file)
        process.chdir(current_path)
        runtime.log(`working directory: ${process.cwd()}`)

        for (var item in require.cache) {
            delete require.cache[item]
        }
        var usermod = require(file)
        httpHandler = new HttpHandler(usermod[func])
        eventHandler = new EventHandler(usermod[func])
    } catch (err) {
        runtime.log(`get user function[${file}:${func}] failed`)
        runtime.log(err.stack)
        initHandlerFault = err.message
        _user_exception = true
    }
}

function finish(err, data, wait) {
    runtime.log('finish')
    runtime.log(wait ? 'wait' : 'not wait')

    if (_result === undefined) {
        if (err == null) {
            try {
                _result = JSON.stringify(data === undefined ? null : data)
            } catch (err) {
                _result = 'faulted'
                _fault = `stringify response to json failed: ${err.message}`
                return
            }
        } else {
            _result = 'faulted'
            if (err instanceof Error) {
                runtime.console_log(err.stack, true)
                _fault = err.message
            } else {
                var errStr = String(err)
                _fault = `${errStr}(callback err is not instance of Error)`
            }
        }
    }

    if (wait) {
        return
    }

    runtime.log(_result)
    process.nextTick(() => {
        if (_result == 'reload') {
            // reload response, do nothing
        } else if (_fault !== undefined) {
            _user_exception = true
            var errType = _user_exception ? 2 : 1
            runtime.report_fail(_fault, 0, errType)
        } else if (_result.length > maxRetMsgLen) {
            runtime.report_fail(maxRetMsgLenExceedError, 0, 1)
        } else {
            runtime.report_done(_result, 0)
        }
        waitForInvoke()
    })
}

class HttpHandler {
    constructor(func) {
        this.realHandler = func
    }

    handle(fd) {}
}

class EventHandler {
    constructor(func) {
        this.realHandler = func
    }

    handle(ev, ctx) {
        var called = false
        var wait = true
        var callback = (err, data) => {
            if (called) {
                return
            }
            called = true
            finish(err, data, wait)
        }

        var ctxx = Object.assign(
            {
                set callbackWaitsForEmptyEventLoop(value) {
                    wait = value
                },
                get callbackWaitsForEmptyEventLoop() {
                    return wait
                },
                getContext() {
                    return ctx
                },
                done: function(err, data) {
                    wait = false
                    callback(err, data)
                },
                succeed: function(data) {
                    ctxx.done(null, data)
                },
                fail: function(err) {
                    ctxx.done(err, null)
                }
            },
            ctx
        )

        try {
            _user_exception = false
            var ret = this.realHandler(ev, ctxx, callback)
            if (
                ret &&
                ret.then !== undefined &&
                typeof ret.then === 'function'
            ) {
                ret.then(ctxx.succeed, ctxx.fail)
            }
        } catch (err) {
            runtime.console_log(err.stack, true)
            _fault = err.stack
            _user_exception = true
        }
    }
}

main()
