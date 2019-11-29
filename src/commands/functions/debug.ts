import path from 'path'
import { spawn, SpawnOptionsWithoutStdio } from 'child_process'
import { FunctionContext } from '../../types'
import { CloudBaseError } from '../../error'
import { checkPathExist, isDirectory, findAndFlattenFunConfig } from '../../utils'

// 启动文件
const bootstrapFilePath = path.join(__dirname, '../../../runtime/nodejs/bootstrap.js')

function checkJSON(data) {
    try {
        JSON.parse(data)
    } catch (e) {
        throw new CloudBaseError('非法的 JSON 字符串')
    }
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

    exec.on('error', e => {
        console.log(`进程执行异常：${e.message}`)
        setTimeout(() => {}, 100)
    })

    exec.stdout.on('data', data => {
        console.log(`${data}`)
    })

    exec.stderr.on('data', data => {
        console.log(`${data}`)
    })

    exec.on('close', code => {
        if (code !== 0) {
            console.log(`\n云函数执行异常退出，错误码：${code}`)
        }
    })
}

export async function debugFunctionByPath(functionPath: string, options: Record<string, any>) {
    const { params, debug, port } = options
    params && checkJSON(params)

    // 检查路径是否存在
    const filePath = path.resolve(functionPath)
    checkPathExist(filePath, true)

    let debugDirname

    if (isDirectory(filePath)) {
        const exists = checkPathExist(path.join(filePath, 'index.js'))
        if (!exists) {
            throw new CloudBaseError('index.js 文件不存在！')
        }
        debugDirname = filePath
    } else {
        const { base, dir } = path.parse(filePath)
        if (base !== 'index.js') {
            throw new CloudBaseError('index.js 文件不存在！')
        }
        debugDirname = dir
    }

    try {
        // eslint-disable-next-line
        const fileExports = require(path.join(debugDirname, 'index.js'))
        if (!fileExports.main) {
            throw new CloudBaseError('main 方法不存在！')
        }
    } catch (e) {
        throw new CloudBaseError(`导入云函数异常：${e.message}`)
    }

    const debugArgs = getDebugArgs(port)
    const args = debug ? [...debugArgs, bootstrapFilePath] : [bootstrapFilePath]
    console.log('> 以默认配置启动 Node 云函数调试')

    spawnNodeProcess(args, {
        env: {
            ...process.env,
            SCF_FUNCTION_HANDLER: 'index.main',
            SCF_FUNCTION_NAME: 'main',
            GLOBAL_USER_FILE_PATH: path.join(debugDirname, path.sep),
            SCF_EVENT_BODY: params || '{}'
        }
    })
}

export async function debugByConfig(ctx: FunctionContext, options: Record<string, any>) {
    const { name, config } = ctx
    const { params, debug, port } = options
    params && checkJSON(params)

    // 检查路径是否存在
    let functionPath = path.resolve(config.functionRoot, name)
    const filePath = path.resolve(functionPath)
    checkPathExist(filePath, true)

    let debugDirname
    const funcConfig = findAndFlattenFunConfig(config, name)

    const handlers = (funcConfig.handler || 'index.js').split('.')
    const indexFileName = handlers[0]
    const indexFile = `${indexFileName}.js`
    const mainFunction = handlers[1]

    if (isDirectory(filePath)) {
        const exists = checkPathExist(path.join(filePath, indexFile))
        if (!exists) {
            throw new CloudBaseError(`${indexFile} 文件不存在！`)
        }
        debugDirname = filePath
    } else {
        const { base, dir } = path.parse(filePath)
        if (base !== indexFile) {
            throw new CloudBaseError(`${indexFile} 文件不存在！`)
        }
        debugDirname = dir
    }

    try {
        // eslint-disable-next-line
        const fileExports = require(path.join(debugDirname, indexFile))
        if (!fileExports[mainFunction]) {
            throw new CloudBaseError(`handler 中的 ${mainFunction} 方法不存在，请检查你的配置！`)
        }
    } catch (e) {
        throw new CloudBaseError(`导入云函数异常:${e.message}`)
    }

    const debugArgs = getDebugArgs(port)

    const args = debug ? [...debugArgs, bootstrapFilePath] : [bootstrapFilePath]

    spawnNodeProcess(args, {
        env: {
            ...process.env,
            SCF_FUNCTION_HANDLER: funcConfig.handler || 'index.main',
            SCF_FUNCTION_NAME: funcConfig.name || 'main',
            GLOBAL_USER_FILE_PATH: path.join(debugDirname, path.sep),
            SCF_EVENT_BODY: params || JSON.stringify(funcConfig.params || {}),
            ...funcConfig.envVariables
        }
    })
}
