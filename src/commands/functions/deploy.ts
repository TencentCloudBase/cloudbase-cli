import path from 'path'
import inquirer from 'inquirer'
import { Command, ICommand } from '../common'
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
import { InjectParams, CmdContext, ArgsParams, Log, Logger } from '../../decorators'
import { ICreateFunctionOptions } from '../../types'

@ICommand()
export class FunctionDeploy extends Command {
    get options() {
        return {
            cmd: 'functions:deploy [name]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '--code-secret <codeSecret>',
                    desc: '传入此参数将保护代码，格式为 36 位大小字母和数字'
                },
                {
                    flags: '--force',
                    desc: '如果存在同名函数，上传后覆盖同名函数'
                },
                {
                    flags: '--path <path>',
                    desc: '指定云函数的文件夹路径'
                },
                {
                    flags: '--all',
                    desc: '部署配置文件中的包含的全部云函数'
                }
            ],
            desc: '部署云函数'
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsParams() params, @Log() log: Logger) {
        const { envId, config, options } = ctx
        const { functions } = config
        const { force, codeSecret, path: funcPath, all } = options
        const functionRootPath = path.join(process.cwd(), config.functionRoot)
        const name = params?.[0]

        // 当没有指定函数名称或函数路径时，询问处理否部署全部云函数
        if ((!name && !funcPath) || all) {
            return this.deployAllFunction({
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
            log.info('未找到函数发布配置，使用默认配置 => 运行时：Nodejs10.15/在线安装依赖')
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
            this.printSuccessTips(envId)
        } catch (e) {
            // 询问是否覆盖同名函数
            loading.stop()
            this.handleDeployFail(e, {
                envId,
                codeSecret,
                functionRootPath,
                func: newFunction,
                functionPath: funcPath
            })
        }
    }

    async deployAllFunction(options: any) {
        const { functions = [], envId, force, codeSecret, functionRootPath, all } = options

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
        const promises = functions.map(async (func) => {
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
                loading.succeed(`[${func.name}] 云函数部署成功`)
            } catch (e) {
                loading.stop()
                this.handleDeployFail(e, {
                    func,
                    envId,
                    codeSecret,
                    functionRootPath
                })
            }
        })

        await Promise.all(promises)
    }

    async handleDeployFail(e: CloudBaseError, options: ICreateFunctionOptions) {
        const { envId, codeSecret, functionRootPath, func, functionPath } = options
        const loading = loadingFactory()

        if (e.code === 'ResourceInUse.FunctionName' || e.code === 'ResourceInUse.Function') {
            const { force } = await inquirer.prompt({
                type: 'confirm',
                name: 'force',
                message: `存在同名云函数：[${func.name}]，是否覆盖原函数代码与配置`,
                default: false
            })

            if (force) {
                loading.start('云函数部署中...')
                try {
                    await createFunction({
                        func,
                        envId,
                        force: true,
                        codeSecret,
                        functionRootPath,
                        functionPath
                    })
                    loading.succeed(`[${func.name}] 云函数部署成功！`)
                    // await genApiGateway(envId, name)
                    this.printSuccessTips(envId)
                } catch (e) {
                    loading.stop()
                    throw e
                }
                return
            }
        }

        throw e
    }

    @InjectParams()
    printSuccessTips(envId: string, @Log() log?: Logger) {
        const link = genClickableLink(`https://console.cloud.tencent.com/tcb/scf?envId=${envId}`)
        log.breakLine()
        log.info(`控制台查看函数详情或创建 HTTP Service 链接 🔗：${link}`)
        log.info(`使用 ${highlightCommand('cloudbase functions:list')} 命令查看已部署云函数`)
    }

    // 创建函数 API 网关
    async genApiGateway(envId: string, name: string) {
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
}
