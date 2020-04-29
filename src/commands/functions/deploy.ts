import path from 'path'
import inquirer from 'inquirer'
import { ICommandContext } from '../command'
import { CloudBaseError } from '../../error'
import { createFunction } from '../../function'
import { queryGateway, createGateway } from '../../gateway'
import {
    random,
    loadingFactory,
    genClickableLink,
    highlightCommand,
    checkFullAccess,
    isDirectory
} from '../../utils'
import { DefaultFunctionDeployConfig } from '../../constant'

function printSuccessTips(envId: string) {
    const link = genClickableLink(`https://console.cloud.tencent.com/tcb/scf?envId=${envId}`)
    console.log(`\n控制台查看函数详情或创建 HTTP Service 链接 🔗：${link}`)
    console.log(`\n使用 ${highlightCommand('cloudbase functions:list')} 命令查看已部署云函数`)
}

// 创建函数 API 网关
async function genApiGateway(envId: string, name: string) {
    const loading = loadingFactory()
    // 检查是否绑定了 HTTP 网关
    const res = await queryGateway({
        name,
        envId
    })
    // 未开启，不生成 HTTP 调用了链接
    if (res?.EnableService === false) return
    loading.start('生成云函数 HTTP Service 中...')

    let path
    if (res?.APISet?.length > 0) {
        path = res.APISet[0]?.Path
    } else {
        path = `/${random(12)}`
        await createGateway({
            envId,
            name,
            path
        })
    }
    loading.stop()
    const link = genClickableLink(`https://${envId}.service.tcloudbase.com${path}`)
    console.log(`\n云函数 HTTP Service 链接：${link}`)
}

async function deployAllFunction(options: any) {
    const { functions, envId, force, codeSecret, functionRootPath, all } = options

    // 指定 all 参数，直接部署全部云函数
    if (!all) {
        const { isBatch } = await inquirer.prompt({
            type: 'confirm',
            name: 'isBatch',
            message: '没有指定需要部署的云函数，是否部署配置文件中的全部云函数？',
            default: false
        })
        // 用户不部署全部函数，报错
        if (!isBatch) {
            throw new CloudBaseError(
                '请指定需要部署的云函数的名称或通过 --path 参数指定需要部署的函数的路径！'
            )
        }
    }

    // 批量部署云函数
    const promises = functions.map((func) =>
        (async () => {
            const loading = loadingFactory()
            loading.start('云函数部署中')
            try {
                await createFunction({
                    func,
                    envId,
                    force,
                    codeSecret,
                    functionRootPath
                })
                loading.succeed(`[${func.name}] 函数部署成功`)
            } catch (e) {
                loading.fail(`[${func.name}] 函数部署失败`)
                throw new CloudBaseError(e.message)
            }
        })()
    )
    await Promise.all(promises)
}

// TODO: 支持部署多个云函数
export async function deploy(ctx: ICommandContext, name: string) {
    const { envId, config, options } = ctx
    const { functions } = config
    const { force, codeSecret, path: funcPath, all, verbose } = options
    const functionRootPath = path.join(process.cwd(), config.functionRoot)

    // 当没有指定函数名称或函数路径时，询问处理否部署全部云函数
    if ((!name && !funcPath) || all) {
        return deployAllFunction({
            all,
            envId,
            force,
            functions,
            codeSecret,
            functionRootPath
        })
    }

    // 校验函数路径是否存在
    if (funcPath) {
        checkFullAccess(funcPath, true)
        if (!isDirectory(funcPath)) {
            throw new CloudBaseError('--path 参数必须指定为云函数的文件夹路径')
        }
    }

    let newFunction
    if (functions && functions.length > 0) {
        newFunction = functions.find((item) => item.name === name)
    }

    // 没有配置，使用默认配置
    if (!newFunction || !newFunction.name) {
        console.log('未找到函数发布配置，使用默认配置 => 运行时：Nodejs10.15，在线安装依赖')
        newFunction = {
            name,
            ...DefaultFunctionDeployConfig
        }
    }

    const loading = loadingFactory()

    loading.start('云函数部署中...')

    try {
        await createFunction({
            force,
            envId,
            codeSecret,
            functionRootPath,
            functionPath: funcPath,
            func: newFunction
        })
        loading.succeed(`[${newFunction.name}] 云函数部署成功！`)
        // await genApiGateway(envId, name)
        printSuccessTips(envId)
    } catch (e) {
        // 询问是否覆盖同名函数
        loading.stop()
        if (e.code === 'ResourceInUse.FunctionName') {
            const { force } = await inquirer.prompt({
                type: 'confirm',
                name: 'force',
                message: '存在同名云函数，是否覆盖原函数代码与配置',
                default: false
            })

            if (force) {
                loading.start('云函数部署中...')
                try {
                    await createFunction({
                        envId,
                        force: true,
                        codeSecret,
                        functionRootPath,
                        func: newFunction,
                        functionPath: funcPath
                    })
                    loading.succeed(`[${newFunction.name}] 云函数部署成功！`)
                    // await genApiGateway(envId, name)
                    printSuccessTips(envId)
                } catch (e) {
                    loading.stop()
                    throw e
                }
                return
            }
        }
        throw e
    }
}
