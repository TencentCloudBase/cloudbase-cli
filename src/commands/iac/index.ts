/* eslint-disable @typescript-eslint/no-parameter-properties */
import { IDatabaseDataSourceDbType } from '@cloudbase/cals'
import { IAC } from '@cloudbase/iac-core'
import { IFunctionRuntime, ResourceAction, ResourceType } from '@cloudbase/iac-core/lib/src/type'
import inquirer from 'inquirer'
import { assignWith, compact, isUndefined } from 'lodash'
import inquirerAutocomplete from 'inquirer-autocomplete-prompt'
import path from 'path'
import { ArgsOptions, CmdContext, InjectParams, Log, Logger } from '../../decorators'
import { authSupevisor, getPrivateSettings } from '../../utils'
import { Command, ICommand, ICommandOptions } from '../common'
import { pathExists, readdir, statSync } from 'fs-extra'

inquirer.registerPrompt('autocomplete', inquirerAutocomplete)

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
                    desc: '仓库名称'
                },
                {
                    flags: '--cwd <cwd>',
                    desc: '仓库路径'
                },
                {
                    flags: '--envId <envId>',
                    desc: '环境 ID。如有提供，会自动同步环境配置（如 Git 模式的配置数据）'
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
            cwd,
            getCredential: () => {
                return getCredential(ctx, options)
            }
        })

        log.info(`【cwd】: ${targetDir}`)

        if (!name) {
            const nameRes = await inquirer.prompt({
                type: 'input',
                name: 'name',
                message:
                    '仓库名称（如有提供，将在【cwd】路径创建文件夹；如没提供，则将【cwd】路径初始化为资源仓库）'
            })
            if (nameRes) {
                params.name = nameRes.name
            }
        }
        if (!envId) {
            params.envId = await showEnvIdUI({
                required: false,
                message: '环境 ID（如有提供，将自动同步环境配置，不选择则跳过）'
            })
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
                    desc: '仓库路径'
                },
                {
                    flags: '--envId <envId>',
                    desc: '环境 ID。如有提供，会自动同步环境配置（如 Git 模式的配置数据）'
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
            cwd,
            getCredential: () => {
                return getCredential(ctx, options)
            }
        })

        log.info(`[当前路径] ${targetDir}`)

        if (!envId && !process.env.ENV_ID) {
            params.envId = await showEnvIdUI()
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
                specResourceLogic: async function (resource, config) {
                    switch (resource) {
                        case ResourceType.SCF:
                            {
                                const runtimeRes = await inquirer.prompt({
                                    type: 'autocomplete',
                                    name: 'runtime',
                                    message: '请选择运行环境',
                                    default: IFunctionRuntime.Nodejs18_15,
                                    source: async function (answersSoFar: any, input = '') {
                                        const choices = Object.values(IFunctionRuntime)
                                        const filtered = choices.filter((choice) =>
                                            choice
                                                .toLowerCase()
                                                .includes(input?.toLowerCase() || '')
                                        )
                                        return filtered
                                    }
                                } as any)
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
                        case ResourceType.WebApp: {
                            const templateRes = await inquirer.prompt({
                                type: 'list',
                                name: 'template',
                                message: '请选择模版',
                                default: 'static',
                                // @ts-ignore
                                choices: IAC.WebApp.getAvailableTemplates()
                            })
                            Object.assign(config, templateRes)
                        }
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
            options: [],
            desc: '拉取资源项目代码',
            needEnvIdOption: true,
            resourceSupportList: IAC.actionSupportedResourceTypes.pull
        })
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsOptions() options, @Log() log: Logger) {
        let { resource, name, envId, cwd = '.' } = options

        await IAC.init({
            cwd,
            getCredential: () => {
                return getCredential(ctx, options)
            }
        })

        await IAC.resource.pull(
            getAPIParams({
                cwd,
                name,
                resource,
                action: ResourceAction.Pull,
                envId,
                log
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
                log
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
            needEnvIdOption: true,
            resourceSupportList: IAC.actionSupportedResourceTypes.dev
        })
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsOptions() options, @Log() log: Logger) {
        let { resource, name, cwd = '.' } = options
        const { data, dataPath, context, contextPath, platform } = options

        await IAC.init({
            cwd,
            getCredential: () => {
                return getCredential(ctx, options)
            }
        })

        await IAC.resource.dev(
            getAPIParams({
                cwd,
                name,
                resource,
                action: ResourceAction.Dev,
                log,
                extraData: { data, dataPath, context, contextPath, platform },
                async specResourceLogic(resource, config) {
                    if (resource === ResourceType.WebApp) {
                        if (!config.distPath) {
                            const distPathRes = await inquirer.prompt({
                                type: 'input',
                                name: 'distPath',
                                message: '请输入 distPath',
                                default: 'dist'
                            })
                            Object.assign(config, distPathRes)
                        }
                    }
                }
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
            cwd,
            getCredential: () => {
                return getCredential(ctx, options)
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
                extraData: { comment },
                specResourceLogic: async function (resource, config) {
                    if (resource === ResourceType.WebApp) {
                        if (!config.distPath) {
                            const distPathRes = await inquirer.prompt({
                                type: 'input',
                                name: 'distPath',
                                message: '请输入 distPath',
                                default: 'dist'
                            })
                            Object.assign(config, distPathRes)
                        }
                    }
                }
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
            options: [],
            desc: '删除资源',
            needEnvIdOption: true,
            resourceSupportList: IAC.actionSupportedResourceTypes.destory
        })
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsOptions() options, @Log() log: Logger) {
        let { resource, name, envId, cwd = '.' } = options

        await IAC.init({
            cwd,
            getCredential: () => {
                return getCredential(ctx, options)
            }
        })

        await IAC.resource.destory(
            getAPIParams({
                cwd,
                name,
                resource,
                action: ResourceAction.Destory,
                envId,
                log
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
            options: [],
            desc: '查询资源信息',
            needEnvIdOption: true,
            resourceSupportList: IAC.actionSupportedResourceTypes.state
        })
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsOptions() options, @Log() log: Logger) {
        const { resource, name, cwd = '.', envId } = options

        await IAC.init({
            cwd,
            getCredential: () => {
                return getCredential(ctx, options)
            }
        })

        const data = await IAC.resource.state(
            getAPIParams({
                cwd,
                name,
                resource,
                action: ResourceAction.State,
                envId,
                log
            })
        )

        if (data) {
            log.info(JSON.stringify(data, null, 2))
        }
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
                desc: '资源标识'
            },
            {
                flags: '--cwd <cwd>',
                desc: '仓库路径'
            },
            needEnvIdOption
                ? {
                      flags: '--envId <envId>',
                      desc: '环境 ID'
                  }
                : null,
            ...options
        ]),
        desc,
        requiredEnvId: false,
        autoRunLogin: true
    }
}

async function getResource(action: ResourceAction) {
    const res = await inquirer.prompt({
        type: 'list',
        name: 'resource',
        message: '请选择资源类型',
        choices: IAC.tools.getResourceList(action).map((item) => ({
            name: `${item.value} - ${item.name}`,
            value: item.value
        }))
    })
    return res.resource
}

function trackCallback(message, log: Logger) {
    if (message.type === 'error') {
        log.error(message.details)
    } else {
        log.info(message.details)
    }
}

async function getCredential(ctx: any, options: any) {
    let credential
    if (ctx.hasPrivateSettings) {
        process.env.IS_PRIVATE = 'true'
        const privateSettings = getPrivateSettings(ctx.config, options.cmd)
        credential = privateSettings?.credential
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
    log: Logger
    envId?: string
    extraData?: { [key: string]: any }
    specResourceLogic?: (resource: ResourceType, config: { [key: string]: any }) => Promise<void>
}) {
    const { cwd, resource, action, name, envId, log, extraData = {}, specResourceLogic } = config
    return {
        cwd,
        envId,
        getEnvId: () => {
            return showEnvIdUI()
        },
        name,
        getName: (nameOptions: string[]) => {
            return showNameUI(nameOptions)
        },
        resourceType: resource,
        getResourceType: () => {
            return getResource(action)
        },
        getConfig: async function (resource, envObj) {
            const config: any = assignWith(
                envObj,
                extraData,
                function customizer(objValue, srcValue) {
                    return isUndefined(objValue) ? srcValue : objValue
                }
            )

            await specResourceLogic?.(resource, config)

            return config
        },
        trackCallback: (message) => {
            trackCallback(message, log)
        }
    }
}

async function showNameUI(nameOptions: string[]) {
    let res: any
    if (nameOptions.length === 0) {
        res = await inquirer.prompt({
            type: 'input',
            name: 'name',
            message: '请输入资源标识',
            validate: function (input) {
                if (input.trim() === '') {
                    return '资源标识不能为空'
                }
                return true
            }
        })
    } else {
        res = await inquirer.prompt({
            type: 'autocomplete',
            name: 'name',
            message: '请选择资源标识或直接输入资源目录名',
            source: async function (answersSoFar: any, input = '') {
                const filtered = nameOptions.filter((choice) =>
                    choice.toLowerCase().includes(input.toLowerCase())
                )
                // 如果有输入值，将其添加到选项列表的最前面
                return input ? [input, ...filtered] : filtered
            },
            validate: function (input) {
                if (input.value.trim() === '') {
                    return '资源标识不能为空'
                }
                return true
            }
        } as any)
    }

    return res.name
}

async function showEnvIdUI(options?: { required?: boolean; message?: string }) {
    const { required = true, message = '环境 ID' } = options || {}
    const envList = await IAC.tools.getEnvList()
    const res = await inquirer.prompt({
        type: 'autocomplete',
        name: 'envId',
        message,
        source: async function (answersSoFar: any, input = '') {
            const filtered = envList.filter((env) =>
                env.name.toLowerCase().includes(input?.toLowerCase() || '')
            )
            const choices = filtered.map(env => ({
                name: env.name,
                value: env.value
            }))
            return required ? choices : compact([input ? undefined : { name: '不提供', value: null }, ...choices])
        },
        validate: required
            ? function (input) {
                  if (input.value.trim() === '') {
                      return '环境 ID 不能为空'
                  }
                  return true
              }
            : undefined
    } as any)
    return res.envId === '不提供' ? null : res.envId
}
