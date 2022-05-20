import { Command, ICommand } from '../../common'
import { InjectParams, ArgsOptions, Log, Logger } from '../../../decorators'
import { tcbrServiceConfigOptions, updateCloudRunServerConfig } from '../../../run'
import { EnumEnvCheck } from '../../../constant'
import { checkTcbrEnv, logEnvCheck } from '../../../utils'

@ICommand()
export class ConfigServiceTcbr extends Command {
    get options() {
        return {
            cmd: 'run',
            childCmd: 'service:config',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id，必填'
                },
                {
                    flags: '-s, --serviceName <serviceName>',
                    desc: '服务名，必填'
                },
                // 服务有关
                {
                    flags: '--cpu <cpu>',
                    desc: '单一实例cpu规格，默认0.5'
                },
                {
                    flags: '--mem <mem>',
                    desc: '单一实例内存规格，默认1'
                },
                {
                    flags: '--minNum <minNum>',
                    desc: '最小副本数，默认0'
                },
                {
                    flags: '--maxNum <maxNum>',
                    desc: '最大副本数，默认50'
                },
                {
                    flags: '--policyDetails <policyDetails>',
                    desc: '扩缩容配置，格式为条件类型=条件比例（%），多个条件之间用&隔开，内存为条件mem，cpu条件为cpu，默认内存>60% 或 CPU>60%，即cpu=60&mem=60'
                },
                {
                    flags: '--customLogs <customLogs>',
                    desc: '日志采集路径，默认stdout'
                },
                {
                    flags: '--InitialDelaySeconds <InitialDelaySeconds>',
                    desc: '延迟检测时间，默认3秒'
                },
                {
                    flags: '--envParams <envParams>',
                    desc: '环境变量，格式为xx=a&yy=b，默认为空'
                },
                {
                    flags: '--json',
                    desc: '以 JSON 形式展示结果'
                }
            ],
            desc: '指定环境和服务，更新服务的基础配置'
        }
    }

    @InjectParams()
    async execute(@ArgsOptions() options, @Log() log: Logger) {
        let envCheckType = await checkTcbrEnv(options.envId, true)
        if (envCheckType !== EnumEnvCheck.EnvFit) {
            logEnvCheck(options.envId, envCheckType)
            return
        }
        const newServiceConfig = await tcbrServiceConfigOptions(options)

        const configRes = await updateCloudRunServerConfig({
            envId: options.envId,
            serviceName: options.serviceName,
            ServerBaseConfig: newServiceConfig
        })

        if (options.json) {
            console.log(JSON.stringify(configRes, null, 2))
        } else {
            log.success('更新配置信息成功')
        }
    }
}