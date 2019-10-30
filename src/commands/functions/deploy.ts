import path from 'path'
import inquirer from 'inquirer'
import { loadingFactory } from '../../utils'
import { CloudBaseError } from '../../error'
import { batchCreateFunctions, createFunction } from '../../function'
import { FunctionContext } from '../../types'
import { getEnvInfo } from '../../env'

export async function deploy(ctx: FunctionContext, commandOptions) {
    const { name, envId, config, functions } = ctx

    const envInfo = await getEnvInfo(envId)

    if (envInfo.Source === 'miniapp') {
        throw new CloudBaseError('无法部署小程序云函数！')
    }

    const { force, codeSecret } = commandOptions

    let isBatchCreating = false

    if (!name) {
        const { isBatch } = await inquirer.prompt({
            type: 'confirm',
            name: 'isBatch',
            message: '没有指定部署函数，是否部署配置文件中的全部函数？',
            default: false
        })
        isBatchCreating = isBatch
        // 用户不部署全部函数，报错
        if (!isBatchCreating) {
            throw new CloudBaseError('请指定部署函数名称！')
        }
    }

    if (isBatchCreating) {
        return await batchCreateFunctions({
            envId,
            force,
            functions,
            log: true,
            codeSecret,
            functionRootPath: path.join(process.cwd(), config.functionRoot)
        })
    }

    let newFunction
    if (functions && functions.length > 0) {
        newFunction = functions.find(item => item.name === name)
    }
    if (!newFunction || !newFunction.name) {
        const { useDefaultFunctionDeployOptions } = await inquirer.prompt({
            type: 'confirm',
            name: 'useDefaultFunctionDeployOptions',
            message: '未找到函数发布配置，使用默认配置？',
            default: false
        })

        if (useDefaultFunctionDeployOptions) {
            newFunction = {
                name,
                config: {
                    runtime: 'Nodejs8.9',
                    installDependency: true
                },
                handler: 'index.main'
            }
        } else {
            throw new CloudBaseError(`函数 ${name} 配置不存在`)
        }
    }

    const loading = loadingFactory()

    loading.start('函数部署中...')

    try {
        await createFunction({
            force,
            envId,
            func: newFunction,
            codeSecret,
            functionRootPath: path.join(process.cwd(), config.functionRoot)
        })
        loading.succeed(`[${newFunction.name}] 函数部署成功！`)
    } catch (e) {
        // 询问是否覆盖同名函数
        loading.stop()
        if (e.code === 'ResourceInUse.FunctionName') {
            const { force } = await inquirer.prompt({
                type: 'confirm',
                name: 'force',
                message: '存在同名云函数，是否覆盖？',
                default: false
            })

            if (force) {
                loading.start('函数部署中...')
                try {
                    await createFunction({
                        envId,
                        force: true,
                        func: newFunction,
                        codeSecret,
                        functionRootPath: path.join(
                            process.cwd(),
                            config.functionRoot
                        )
                    })
                    loading.succeed(`[${newFunction.name}] 函数部署成功！`)
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
