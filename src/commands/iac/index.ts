import { IDatabaseDataSourceDbType } from '@cloudbase/cals'
import { IAC } from '@cloudbase/iac-core'
import { IFunctionRuntime, ResourceAction, ResourceType } from '@cloudbase/iac-core/lib/src/type'
import inquirer from 'inquirer'
import { assignWith, compact, isUndefined } from 'lodash'
import path from 'path'
import { ArgsOptions, CmdContext, InjectParams, Log, Logger } from '../../decorators'
import { authSupevisor, getPrivateSettings } from '../../utils'
import { Command, ICommand, ICommandOptions } from '../common'

@ICommand({
    supportPrivate: true
})
export class IaCInitRepo extends Command {
    get options() {
        return {
            cmd: 'repo',
            childCmd: 'init',
            options: compact([
                {
                    flags: '--name <name>',
                    desc: '项目名称'
                },
                {
                    flags: '--cwd <cwd>',
                    desc: '项目路径'
                },
                {
                    flags: '--envId <envId>',
                    desc: '环境 Id。如有提供，会自动同步环境配置（如 Git 模式的配置数据）'
                }
            ]),
            desc: '初始化云开发资源仓库项目 - 大仓 Monorepo 模式',
            requiredEnvId: false,
            autoRunLogin: true
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsOptions() options, @Log() log: Logger) {
        let { envId, name, cwd = '.' } = options

        const targetDir = path.resolve(cwd)
        const params = { name, cwd, envId }

        await IAC.init({
            getCredential: () => {
                return getCredential(ctx)
            }
        })

        log.info(`【cwd】: ${targetDir}`)

        if (!name) {
            const nameRes = await inquirer.prompt({
                type: 'input',
                name: 'name',
                message: `仓库名称（如有提供，将在【cwd】路径创建文件夹；如没提供，则将【cwd】路径初始化为资源仓库）`
            })
            if (nameRes) {
                params.name = nameRes.name
            }
        }
        if (!envId) {
            const envIdRes = await inquirer.prompt({
                type: 'input',
                name: 'envId',
                message: '环境 Id（如有提供，将自动同步环境配置）'
            })
            if (envIdRes) {
                params.envId = envIdRes.envId
            }
        }

        await IAC.tools.initRepo(params, (message) => trackCallback(message, log))
    }
}

@ICommand({
    supportPrivate: true
})
export class IaCPullRepoConfig extends Command {
    get options() {
        return {
            cmd: 'repo',
            childCmd: 'pull-config',
            options: compact([
                {
                    flags: '--cwd <cwd>',
                    desc: '项目路径'
                },
                {
                    flags: '--envId <envId>',
                    desc: '环境 Id。如有提供，会自动同步环境配置（如 Git 模式的配置数据）'
                }
            ]),
            desc: '拉取大仓在指定环境下的配置（当前只支持拉取 Git 模式的配置）',
            requiredEnvId: false,
            autoRunLogin: true
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsOptions() options, @Log() log: Logger) {
        let { envId, name, cwd = '.' } = options

        const targetDir = path.resolve(cwd)
        const params = { name, cwd, envId }

        await IAC.init({
            getCredential: () => {
                return getCredential(ctx)
            }
        })

        log.info(`当前路径: ${targetDir}`)

        if (!envId) {
            const envIdRes = await inquirer.prompt({
                type: 'input',
                name: 'envId',
                message: '环境 Id',
                validate: function (input) {
                    if (input.trim() === '') {
                        return '请提供环境 Id'
                    }
                    return true
                }
            })
            params.envId = envIdRes.envId
        }

        await IAC.tools.pullRepoConfig(params, (message) => trackCallback(message, log))
    }
}

@ICommand({
    supportPrivate: true
})
export class IaCInit extends Command {
    get options() {
        return getOptions({
            childCmd: 'init',
            options: [],
            desc: '初始化资源代码项目',
            needEnvIdOption: false,
            resourceSupportList: IAC.actionSupportedResourceTypes.init
        })
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsOptions() options, @Log() log: Logger) {
        let { resource, name, cwd = '.' } = options

        await IAC.resource.init(
            getAPIParams({
                cwd,
                name,
                resource,
                action: ResourceAction.Init,
                log,
                needEnvId: false,
                specResourceLogic: async function (resource, config) {
                    switch (resource) {
                        case ResourceType.SCF:
                            {
                                const runtimeRes = await inquirer.prompt({
                                    type: 'list',
                                    name: 'runtime',
                                    message: '请选择运行环境',
                                    default: IFunctionRuntime.Nodejs18_15,
                                    choices: Object.values(IFunctionRuntime)
                                })
                                Object.assign(config, runtimeRes)
                                const memorySizeRes = await inquirer.prompt({
                                    type: 'number',
                                    name: 'memorySize',
                                    message: '函数内存(MB)',
                                    default: 256
                                })
                                Object.assign(config, memorySizeRes)
                                const descriptionSizeRes = await inquirer.prompt({
                                    type: 'input',
                                    name: 'description',
                                    message: '描述'
                                })
                                Object.assign(config, descriptionSizeRes)
                            }
                            break
                        case ResourceType.App:
                            {
                                const titleRes = await inquirer.prompt({
                                    type: 'input',
                                    name: 'title',
                                    message: '应用名称',
                                    default: config.name
                                })
                                Object.assign(config, titleRes)
                            }
                            break
                        case ResourceType.Model:
                            {
                                const titleRes = await inquirer.prompt({
                                    type: 'input',
                                    name: 'title',
                                    message: '数据模型名称',
                                    default: config.name
                                })
                                Object.assign(config, titleRes)
                                const dbInstanceTypeRes = await inquirer.prompt({
                                    type: 'list',
                                    name: 'dbInstanceType',
                                    message: '数据库类型',
                                    default: IDatabaseDataSourceDbType.FLEXDB,
                                    choices: Object.values(IDatabaseDataSourceDbType)
                                })
                                Object.assign(config, dbInstanceTypeRes)
                                const descriptionSizeRes = await inquirer.prompt({
                                    type: 'input',
                                    name: 'description',
                                    message: '描述'
                                })
                                Object.assign(config, descriptionSizeRes)
                            }
                            break
                    }
                }
            })
        )
    }
}

@ICommand({
    supportPrivate: true
})
export class IaCPull extends Command {
    get options() {
        return getOptions({
            childCmd: 'pull',
            options: [
            ],
            desc: '拉取资源项目代码',
            needEnvIdOption: true,
            resourceSupportList: IAC.actionSupportedResourceTypes.pull
        })
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsOptions() options, @Log() log: Logger) {
        let { resource, name, envId, cwd = '.' } = options

        await IAC.init({
            getCredential: () => {
                return getCredential(ctx)
            }
        })

        await IAC.resource.pull(
            getAPIParams({
                cwd,
                name,
                resource,
                action: ResourceAction.Pull,
                envId,
                log,
                needEnvId: true
            })
        )
    }
}

@ICommand({
    supportPrivate: true
})
export class IaCBuild extends Command {
    get options() {
        return getOptions({
            childCmd: 'build',
            options: [],
            desc: '构建资源项目代码',
            needEnvIdOption: false,
            resourceSupportList: IAC.actionSupportedResourceTypes.build
        })
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsOptions() options, @Log() log: Logger) {
        let { resource, name, cwd = '.' } = options

        await IAC.resource.build(
            getAPIParams({
                cwd,
                name,
                action: ResourceAction.Build,
                resource,
                log,
                needEnvId: false
            })
        )
    }
}

@ICommand({
    supportPrivate: true
})
export class IaCDev extends Command {
    get options() {
        return getOptions({
            childCmd: 'dev',
            options: [
                {
                    flags: '--data <data>',
                    desc: '要传递给调用函数的序列化 Event 数据（仅当 resource=SCF 时有效）'
                },
                {
                    flags: '--dataPath <dataPath>',
                    desc: '要传递给调用函数 Event 的 json 文件所在路径（仅当 resource=SCF 时有效）'
                },
                {
                    flags: '--context <context>',
                    desc: '要传递给调用函数的序列化 Context 数据（仅当 resource=SCF 时有效）'
                },
                {
                    flags: '--contextPath <contextPath>',
                    desc: '要传递给调用函数 Context 的 json 文件所在路径（仅当 resource=SCF 时有效）'
                },
                {
                    flags: '--platform <platform>',
                    desc: '运行平台，可选为 web | mp。默认为 web（仅当 resource=App 时有效）'
                }
            ],
            desc: '本地开发资源项目代码',
            needEnvIdOption: false,
            resourceSupportList: IAC.actionSupportedResourceTypes.dev
        })
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsOptions() options, @Log() log: Logger) {
        let { resource, name, cwd = '.' } = options
        const { data, dataPath, context, contextPath, platform } = options

        await IAC.init({
            getCredential: () => {
                return getCredential(ctx)
            }
        })

        await IAC.resource.dev(
            getAPIParams({
                cwd,
                name,
                resource,
                action: ResourceAction.Dev,
                log,
                needEnvId: false,
                extraData: { data, dataPath, context, contextPath, platform }
            })
        )
    }
}

@ICommand({
    supportPrivate: true
})
export class IaCApply extends Command {
    get options() {
        return getOptions({
            childCmd: 'apply',
            options: [
                {
                    flags: '--comment <comment>',
                    desc: '提交信息（仅当 resource=App 时有效）'
                }
            ],
            desc: '本地开发资源项目代码',
            needEnvIdOption: true,
            resourceSupportList: IAC.actionSupportedResourceTypes.apply
        })
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsOptions() options, @Log() log: Logger) {
        let { resource, name, envId, cwd = '.' } = options
        const { comment } = options

        await IAC.init({
            getCredential: () => {
                return getCredential(ctx)
            }
        })

        await IAC.resource.apply(
            getAPIParams({
                cwd,
                name,
                resource,
                action: ResourceAction.Apply,
                envId,
                log,
                needEnvId: true,
                extraData: { comment }
            })
        )
    }
}

@ICommand({
    supportPrivate: true
})
export class IaCDestory extends Command {
    get options() {
        return getOptions({
            childCmd: 'destory',
            options: [
            ],
            desc: '删除资源',
            needEnvIdOption: true,
            resourceSupportList: IAC.actionSupportedResourceTypes.destory
        })
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsOptions() options, @Log() log: Logger) {
        let { resource, name, envId, cwd = '.' } = options

        await IAC.init({
            getCredential: () => {
                return getCredential(ctx)
            }
        })

        await IAC.resource.destory(
            getAPIParams({
                cwd,
                name,
                resource,
                action: ResourceAction.Destory,
                envId,
                log,
                needEnvId: true
            })
        )
    }
}

@ICommand({
    supportPrivate: true
})
export class IaCState extends Command {
    get options() {
        return getOptions({
            childCmd: 'state',
            options: [
            ],
            desc: '查询资源信息',
            needEnvIdOption: true,
            resourceSupportList: IAC.actionSupportedResourceTypes.state
        })
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsOptions() options, @Log() log: Logger) {
        const { resource, name, cwd = '.', envId } = options

        await IAC.init({
            getCredential: () => {
                return getCredential(ctx)
            }
        })

        const data = await IAC.resource.state(
            getAPIParams({
                cwd,
                name,
                resource,
                action: ResourceAction.State,
                envId,
                log,
                needEnvId: true
            })
        )

        log.info(JSON.stringify(data, null, 2))
    }
}

// ========================== 共用方法 ========================== //

function getOptions({
    childCmd,
    options,
    desc,
    resourceSupportList,
    needEnvIdOption = true
}: Pick<ICommandOptions, 'childCmd' | 'options' | 'desc'> & {
    /**
     * 资源选项的描述
     */
    resourceSupportList?: string[]

    /**
     * 昌否需要 envId option
     */
    needEnvIdOption?: boolean
}): ICommandOptions {
    return {
        cmd: 'res',
        childCmd,
        options: compact([
            {
                flags: '--resource <resource>',
                desc: '资源类型。当前支持 ' + resourceSupportList.join(' / ')
            },
            {
                flags: '--name <name>',
                desc: '资源名称'
            },
            {
                flags: '--cwd <cwd>',
                desc: '项目路径'
            },
            needEnvIdOption
                ? {
                      flags: '--envId <envId>',
                      desc: '环境 Id'
                  }
                : null,
            ...options
        ]),
        desc,
        requiredEnvId: false,
        autoRunLogin: true
    }
}

async function getResource(resource: ResourceType, action: ResourceAction) {
    if (!resource) {
        const res = await inquirer.prompt({
            type: 'list',
            name: 'resource',
            message: '请选择资源类型',
            choices: IAC.tools.getResourceList(action).map((item) => ({
                name: `${item.value} - ${item.name}`,
                value: item.value
            }))
        })
        resource = res.resource
    }
    return resource
}

function trackCallback(message, log: Logger) {
    // if (message.status === 'progress') {
    //     loading.start(message.details)
    // } else if (message.status === 'done') {
    //     loading.succeed(message.details)
    // } else {
    //     if (message.type === 'error') {
    //         loading.fail(message.details)
    //     } else {
    //         log.info(message.details)
    //     }
    // }
    if (message.type === 'error') {
        log.error(message.details)
    } else {
        log.info(message.details)
    }
}

async function getCredential(ctx: any) {
    let credential
    if (ctx.hasPrivateSettings) {
        process.env.IS_PRIVATE = 'true'
        const privateSettings = getPrivateSettings(ctx.config, this.options.cmd)
        credential = privateSettings.credential
    } else {
        credential = await authSupevisor.getLoginState()
    }
    return credential
}

function getAPIParams(config: {
    cwd: string
    name: string
    resource: ResourceType
    action: ResourceAction
    needEnvId: boolean
    log: Logger
    envId?: string
    extraData?: { [key: string]: any }
    specResourceLogic?: (resource: ResourceType, config: { [key: string]: any }) => Promise<void>
}) {
    const {
        cwd,
        resource,
        action,
        name,
        envId,
        log,
        needEnvId = true,
        extraData = {},
        specResourceLogic
    } = config
    return {
        cwd,
        getResource: () => {
            return getResource(resource, action)
        },
        getConfig: async function (resource, envObj) {
            const config: any = assignWith(
                envObj,
                { name, envId },
                extraData,
                function customizer(objValue, srcValue) {
                    return isUndefined(objValue) ? srcValue : objValue
                }
            )

            if (!config.name) {
                const nameRes = await showNameUI()
                Object.assign(config, { name: nameRes })
            }

            if (needEnvId) {
                if (!config.envId) {
                    const envIdRes = await showEnvIdUI()
                    Object.assign(config, { envId: envIdRes })
                }
            }

            await specResourceLogic?.(resource, config)

            return config
        },
        trackCallback: (message) => {
            trackCallback(message, log)
        }
    }
}

async function showNameUI() {
    const res = await inquirer.prompt({
        type: 'input',
        name: 'name',
        message: '请输入资源标识',
        validate: function (input) {
            if (input.trim() === '') {
                return '资源名称不能为空'
            }
            return true
        }
    })
    return res.name
}

async function showEnvIdUI() {
    const res = await inquirer.prompt({
        type: 'input',
        name: 'envId',
        message: '环境 ID',
        validate: function (input) {
            if (input.trim() === '') {
                return '环境 ID不能为空'
            }
            return true
        }
    })
    return res.envId
}