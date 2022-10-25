import _ from 'lodash'
import { Command, ICommand } from '../common'
import { InjectParams, Log, Logger, ArgsParams, ArgsOptions, CmdContext, IsPrivateEnv, Config } from '../../decorators'
import { prompt } from 'enquirer'
import * as semver from 'semver'
import { CloudApiService } from '../../utils'
import { CloudApiService as PrivateCloudApiService } from '@cloudbase/cloud-api'
import { CloudBaseError } from '../../error'
import { getLowcodeCli } from './utils'

// use dynamic import for lowcode-cli to reduce setup time
type LowcodeCli = typeof import('@cloudbase/lowcode-cli')

let lowcodeCli: LowcodeCli | undefined

if (process.argv.includes('lowcode')) {
    // cannot use top-level await here
    getLowcodeCli().then(_ => lowcodeCli = _)
}

@ICommand({
    supportPrivate: true
})
export class LowCodeCreateComps extends Command {
    get options() {
        return {
            cmd: 'lowcode',
            childCmd: 'create [name]',
            options: [
                {
                    flags: '--verbose',
                    desc: '是否打印详细日志'
                },
                {
                    flags: '--skip-validate',
                    desc: '是否跳过组件存在性检查'
                }
            ],
            desc: '创建组件库',
            requiredEnvId: false
        }
    }

    @InjectParams()
    async execute( @ArgsOptions() opts, @ArgsParams() params, @IsPrivateEnv() isPrivateEnv: boolean, @Config() config, @Log() log?: Logger) {
        if(opts.skipValidate) {
            if (!params?.[0]) {
                throw new CloudBaseError('skip validate 需要指定组件库名 eg: `tcb lowcode create mydemo`')
            }
            await lowcodeCli.bootstrap(params?.[0], log)
            return
        }

        if (process.env.CLOUDBASE_LOWCODE_CLOUDAPI_URL === undefined) {
            // 没设置的时候才才设置，方便覆盖
            process.env.CLOUDBASE_LOWCODE_CLOUDAPI_URL = 'https://lcap.cloud.tencent.com/api/v1/cliapi'
        }
        let cloudService: CloudApiService | PrivateCloudApiService
        if (isPrivateEnv) {
            cloudService =  PrivateCloudApiService.getInstance( {
                service: 'lowcode',
                credential: {
                    secretId: config.privateSettings.secretID,
                    secretKey: config.privateSettings.secretKey
                }
            })
            
        } else {
            cloudService = CloudApiService.getInstance('lowcode')
        }
        const res = await cloudService.request('ListUserCompositeGroups', isPrivateEnv ? {
            privateUin: config.privateSettings.privateUin
        }: undefined)
        const comps = res?.data
        if (!comps?.count) {
            throw new CloudBaseError('没有可关联的云端组件库，请到低码控制台新建组件库！')
        }

        let compsName = params?.[0]
        if (!compsName) {
            const { selectCompsName } = await prompt<any>({
                type: 'select',
                name: 'selectCompsName',
                message: '关联云端组件库:',
                choices: comps.rows.map((row) => row.groupName)
            })
            compsName = selectCompsName
        } else {
            // 自己输入的组件库名称，校验是否在云端也有
            const comp = comps.rows.find((row) => row.groupName === compsName)
            if (!comp) {
                throw new CloudBaseError(`云端不存在组件库 ${compsName}，请到低码控制台新建该组件库！`)
            }
        }

        await lowcodeCli.bootstrap(compsName, log)

    }
}

export class LowCodeBuildComps extends Command {
    get options() {
        return {
            cmd: 'lowcode',
            childCmd: 'build',
            options: [
                {
                    flags: '--verbose',
                    desc: '是否打印详细日志'
                }
            ],
            desc: '构建组件库',
            requiredEnvId: false
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @Log() log) {
        // 有RC配置, 使用新接口
        const config = ctx.config.lowcodeCustomComponents
        if (config) {
            await lowcodeCli.graceBuildComps({
                ...config,
                context: config.context || process.cwd(),
                logger: log,
                privateSettings: _.get(ctx, 'config.privateSettings')
            })
            return
        }
        // 没有RC配置
        throw new CloudBaseError('请参考文档填写 cloudbaserc 配置: https://docs.cloudbase.net/lowcode/custom-components/config/config-comps')
        
    }
}

@ICommand()
export class LowCodeDebugComps extends Command {
    get options() {
        return {
            cmd: 'lowcode',
            childCmd: 'debug',
            options: [
                {
                    flags: '--verbose',
                    desc: '是否打印详细日志'
                },
                {
                    flags: '--debug-port <debugPort>',
                    desc: '调试端口，默认是8388'
                },
                {
                    flags: '--wx-devtool-path <wxDevtoolPath>',
                    desc: '微信开发者工具的安装路径'
                }
            ],
            desc: '调试组件库',
            requiredEnvId: false
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsOptions() options, @Log() log) {
        // 有RC配置, 使用新接口
        const config = ctx.config.lowcodeCustomComponents
        if (config) {
            await lowcodeCli.graceDebugComps({
                ...config,
                context: config.context || process.cwd(),
                debugPort: options?.debugPort || 8388,
                logger: log,
                wxDevtoolPath: options?.wxDevtoolPath,
                debugBaseUrl: _.get(ctx, 'config.privateSettings.editorEntrypoint')
            })
            return
        }
        // 没有RC配置
        throw new CloudBaseError('请参考文档填写 cloudbaserc 配置: https://docs.cloudbase.net/lowcode/custom-components/config/config-comps')
    }
}

@ICommand(
    {supportPrivate: true}
)
export class LowCodePublishComps extends Command {
    get options() {
        return {
            cmd: 'lowcode',
            childCmd: 'publish',
            options: [
                {
                    flags: '--verbose',
                    desc: '是否打印详细日志'
                },
                {
                    flags: '--admin',
                    desc: '是否使用admin接口',
                    hideHelp: true
                }
            ],
            desc: '发布组件库',
            requiredEnvId: false
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @Log() log: Logger, @ArgsOptions() options: any) {
        // 有RC配置, 使用新接口

        const config = ctx.config.lowcodeCustomComponents
        if (config) {
            await lowcodeCli.gracePublishComps({
                ...config,
                context: config.context || process.cwd(),
                logger: log,
                privateSettings: _.get(ctx, 'config.privateSettings'),
                isAdmin: Boolean(options.admin)
            })
            log.success('组件库 - 已同步到云端，请到低码控制台发布该组件库！')
            return
        }
        // 没有RC配置
        throw new CloudBaseError('请参考文档填写 cloudbaserc 配置: https://docs.cloudbase.net/lowcode/custom-components/config/config-comps')
    }
}

@ICommand({
    supportPrivate: true
})
export class LowCodePublishVersionComps extends Command {
    get options() {
        return {
            cmd: 'lowcode',
            childCmd: 'publishVersion',
            options: [
                {
                    flags: '--verbose',
                    desc: '是否打印详细日志'
                },
                {
                    flags: '--comment <comment>',
                    desc: '版本备注',
                },
                {
                    flags: '--tag <version>',
                    desc: '版本号'
                },
                {
                    flags: '--admin',
                    desc: '是否使用admin接口',
                    hideHelp: true
                }
            ],
            desc: '发布组件库版本',
            requiredEnvId: false
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsOptions() options, @Log() log?: Logger) {
        // 有RC配置, 使用新接口
        const { tag, comment, admin } = options
        if (!comment) {
            throw new CloudBaseError('请使用 --comment 填写版本注释')
        }
        if (!tag) {
            throw new CloudBaseError('请使用 --tag 填写符合semver的版本号')
        }
        if (!semver.valid(tag)) {
            log.error('组件库版本不符合semver标准')
            return
        }
        const config = ctx.config.lowcodeCustomComponents

        if (!config) {
            throw new CloudBaseError('组件库 - 请添加组件库配置到cloudbaserc.json 以使用该命令')
        }

        const res = await lowcodeCli.publishVersion({
            ...config,
            context: config.context || process.cwd(),
            logger: log,
            isAdmin: options.admin,
            privateSettings: _.get(ctx, 'config.privateSettings')
        }, comment, tag)
        if (res.data.code === 200) {
            log.success('组件库 - 已发布新版本！')
            return
        }
        if (res.data.code === 100) {
            log.error('组件库 - 无待发布版本')
            return
        }
        if (res.data.code === 201) {
            log.error('组件库 - comment 重复， 请使用有意义的comment')
            return
        } else {
            if (res.data.msg) {
                log.error(`组件库 - ${res.data.msg} RequestId: ${res.requestId}`)
            } else {
                log.error('组件库 - 未知错误')
            }
            return
        }
    }
}
