import _ from 'lodash'
import path from 'path'
import { spawn, SpawnOptionsWithoutStdio } from 'child_process'
import { Command, ICommand } from '../common'
import { CloudBaseError } from '../../error'
import { ICommandContext } from '../../types'
import { InjectParams, CmdContext } from '../../decorators'
import { checkFullAccess, isDirectory, checkAndGetCredential } from '../../utils'

// 启动文件
const bootstrapFilePath = path.join(__dirname, '../../../runtime/nodejs/bootstrap.js')

function checkJSON(data) {
    try {
        JSON.parse(data)
    } catch (e) {
        throw new CloudBaseError('非法的 JSON 字符串')
    }
}

function errorLog(msg: string, debug?: boolean) {
    throw new CloudBaseError(msg, {
        meta: { debug }
    })
}

function getDebugArgs(port = 9229) {
    return [
        `--inspect-brk=0.0.0.0:${port}`,
        '--nolazy',
        '--expose-gc',
        '--max-semi-space-size=150',
        '--max-old-space-size=2707'
    ]
}

// 启动 Node 子进程执行
function spawnNodeProcess(args: string[], options: SpawnOptionsWithoutStdio) {
    const commonOptions = {
        cwd: path.dirname(bootstrapFilePath),
        windowsHide: true
    }

    const exec = spawn('node', args, {
        ...commonOptions,
        ...options
    })

    exec.on('error', (e) => {
        console.log(`进程执行异常：${e.message}`)
        setTimeout(() => {}, 100)
    })

    exec.stdout.on('data', (data) => {
        console.log(`${data}`)
    })

    exec.stderr.on('data', (data) => {
        console.log(`${data}`)
    })

    exec.on('close', (code) => {
        if (code !== 0) {
            console.log(`\n云函数执行异常退出，错误码：${code}`)
        }
    })
}

async function getSecret() {
    const credential = await checkAndGetCredential()
    if (_.isEmpty(credential)) {
        console.log('未登录，无法直接调用 Node SDK')
        return {}
    }

    const { secretId, secretKey, token } = credential

    return {
        TENCENTCLOUD_SECRETID: secretId,
        TENCENTCLOUD_SECRETKEY: secretKey,
        TENCENTCLOUD_SESSIONTOKEN: token
    }
}

export async function debugFunctionByPath(functionPath: string, options: Record<string, any>) {
    const { params, debug, port } = options
    params && checkJSON(params)

    // 检查路径是否存在
    const filePath = path.resolve(functionPath)
    checkFullAccess(filePath)

    let debugDirname
    const isDir = isDirectory(filePath)

    if (isDir) {
        const exists = checkFullAccess(path.join(filePath, 'index.js'))
        if (!exists) {
            errorLog('index.js 文件不存在！', debug)
        }
        debugDirname = filePath
    } else {
        const { base, dir } = path.parse(filePath)
        if (base !== 'index.js') {
            errorLog('index.js 文件不存在！', debug)
        }
        debugDirname = dir
    }

    try {
        // eslint-disable-next-line
        const fileExports = require(path.join(debugDirname, 'index.js'))
        if (!fileExports.main) {
            errorLog('main 方法不存在！', debug)
        }
    } catch (e) {
        errorLog(`导入云函数异常：${e.message}`, debug)
    }

    // 读取本地 secret 变量
    const secret = await getSecret()
    const debugArgs = getDebugArgs(port)
    const args = debug ? [...debugArgs, bootstrapFilePath] : [bootstrapFilePath]
    console.log('> 以默认配置启动 Node 云函数调试')

    spawnNodeProcess(args, {
        env: {
            ...process.env,
            SCF_FUNCTION_HANDLER: 'index.main',
            SCF_FUNCTION_NAME: 'main',
            GLOBAL_USER_FILE_PATH: path.join(debugDirname, path.sep),
            SCF_EVENT_BODY: params || '{}',
            ...secret
        }
    })
}

export async function debugByConfig(ctx: ICommandContext, name: string) {
    const { config, options, envId } = ctx
    const { params, debug, port } = options
    params && checkJSON(params)

    // 检查路径是否存在
    let functionPath = path.resolve(config.functionRoot, name)
    const filePath = path.resolve(functionPath)
    checkFullAccess(filePath, !debug)

    let debugDirname
    const funcConfig = config.functions.find((item) => item.name === name)

    const handlers = (funcConfig?.handler || 'index.main').split('.')
    const indexFileName = handlers[0]
    const indexFile = `${indexFileName}.js`
    const mainFunction = handlers[1]

    const isDir = isDirectory(filePath)

    if (isDir) {
        const exists = checkFullAccess(path.join(filePath, indexFile))
        if (!exists) {
            errorLog(`${indexFile} 文件不存在！`, debug)
        }
        debugDirname = filePath
    } else {
        const { base, dir } = path.parse(filePath)
        if (base !== indexFile) {
            errorLog(`${indexFile} 文件不存在！`, debug)
        }
        debugDirname = dir
    }

    try {
        // eslint-disable-next-line
        const fileExports = require(path.join(debugDirname, indexFile))
        if (!fileExports[mainFunction]) {
            errorLog(`handler 中的 ${mainFunction} 方法不存在，请检查你的配置！`, debug)
        }
    } catch (e) {
        errorLog(`导入云函数异常:${e.message}`, debug)
    }

    // 读取本地 secret
    const secret = await getSecret()
    const debugArgs = getDebugArgs(port)
    const args = debug ? [...debugArgs, bootstrapFilePath] : [bootstrapFilePath]

    spawnNodeProcess(args, {
        env: {
            ...process.env,
            SCF_NAMESPACE: envId,
            SCF_FUNCTION_HANDLER: funcConfig?.handler || 'index.main',
            SCF_FUNCTION_NAME: funcConfig?.name || 'main',
            GLOBAL_USER_FILE_PATH: path.join(debugDirname, path.sep),
            SCF_EVENT_BODY: params || JSON.stringify(funcConfig?.params || {}),
            ...funcConfig?.envVariables,
            ...secret
        }
    })
}

@ICommand()
export class FunctionDebug extends Command {
    get options() {
        return {
            cmd: 'functions:run',
            options: [
                {
                    flags: '--path <path>',
                    desc: '云函数路径，使用默认配置直接调用云函数，无需配置文件'
                },
                {
                    flags: '--name <name>',
                    desc: '指定云函数的名称进行调用，需要配置文件'
                },
                {
                    flags: '--params <params>',
                    desc: '调用函数传入的参数，JSON 字符串格式'
                },
                {
                    flags: '--port <port>',
                    desc: '启动调试时监听的端口号，默认为 9229'
                },
                {
                    flags: '--debug',
                    desc: '启动调试模式'
                }
            ],
            desc: '本地运行云函数（当前仅支持 Node）'
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx) {
        const { options } = ctx
        const { path, name } = options
        // 指定函数路径，以默认配置运行函数
        if (path) {
            await debugFunctionByPath(path, options)
        } else if (typeof name === 'string') {
            await debugByConfig(ctx, name)
        } else {
            throw new CloudBaseError(
                '请指定运行函数的名称或函数的路径\n\n例如 cloudbase functions:run --name app'
            )
        }
    }
}
