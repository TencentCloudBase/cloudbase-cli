import path from 'path'
import inquirer from 'inquirer'
import { ICommandContext } from '../command'
import { CloudBaseError } from '../../error'
import { createFunction } from '../../function'
import { queryGateway, createGateway } from '../../gateway'
import { loadingFactory, genClickableLink, highlightCommand, random } from '../../utils'
import { DefaultFunctionDeployConfig } from '../../constant'

function printSuccessTips(envId: string) {
    const link = genClickableLink(`https://console.cloud.tencent.com/tcb/scf?envId=${envId}`)
    console.log(`\n控制台查看函数详情：${link}`)
    console.log(`\n使用 ${highlightCommand('cloudbase functions:list')} 命令查看已部署云函数\n`)
}

// 创建函数 API 网关
async function genApiGateway(envId: string, name: string) {
    const loading = loadingFactory()
    loading.start('生成云函数 HTTP Service 中...')
    // 检查是否绑定了 HTTP 网关
    const res = await queryGateway({
        name,
        envId
    })
    if (res?.EnableService === false) return
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

// TODO: 支持部署多个云函数
export async function deploy(ctx: ICommandContext, name: string) {
    const { envId, config, options } = ctx
    const { functions } = config
    const { force, codeSecret, verbose } = options
    const functionRootPath = path.join(process.cwd(), config.functionRoot)

    let isBatchCreating = false

    if (!name) {
        const { isBatch } = await inquirer.prompt({
            type: 'confirm',
            name: 'isBatch',
            message: '没有指定需要部署的云函数，是否部署配置文件中的全部云函数？',
            default: false
        })
        isBatchCreating = isBatch
        // 用户不部署全部函数，报错
        if (!isBatchCreating) {
            throw new CloudBaseError('请指定需要部署的云函数的名称！')
        }
    }

    // 批量部署云函数
    if (isBatchCreating) {
        const promises = functions.map(func =>
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
        return
    }

    let newFunction
    if (functions && functions.length > 0) {
        newFunction = functions.find(item => item.name === name)
    }

    if (!newFunction || !newFunction.name) {
        const { useDefaultConfig } = await inquirer.prompt({
            type: 'confirm',
            name: 'useDefaultConfig',
            message: '未找到函数发布配置，是否使用默认配置（仅适用于 Node.js 云函数）',
            default: false
        })

        if (useDefaultConfig) {
            newFunction = {
                name,
                ...DefaultFunctionDeployConfig
            }
        } else {
            throw new CloudBaseError(`函数 ${name} 配置不存在`)
        }
    }

    const loading = loadingFactory()

    loading.start('云函数部署中...')

    try {
        await createFunction({
            force,
            envId,
            func: newFunction,
            codeSecret,
            functionRootPath
        })
        loading.succeed(`[${newFunction.name}] 云函数部署成功！`)
        await genApiGateway(envId, name)
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
                        func: newFunction,
                        codeSecret,
                        functionRootPath
                    })
                    loading.succeed(`[${newFunction.name}] 云函数部署成功！`)
                    await genApiGateway(envId, name)
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
