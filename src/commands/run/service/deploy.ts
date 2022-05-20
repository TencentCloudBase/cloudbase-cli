import { Command, ICommand } from '../../common'
import { InjectParams, ArgsOptions } from '../../../decorators'
import {
    describeCloudRunServerDetail, 
    createTcbrService,
    updateTcbrService
} from '../../../run'
import { EnumEnvCheck } from '../../../constant'
import { checkTcbrEnv, logEnvCheck } from '../../../utils'
@ICommand()
export class DeployServiceTcbr extends Command {
    get options() {
        return {
            cmd: 'run',
            childCmd: 'deploy',
            options: [
                {
                    flags: '--noConfirm',
                    desc: '发布前是否跳过二次确认'
                },
                {
                    flags: '--override',
                    desc: '缺省的参数是否沿用旧版本配置'
                },
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id，必填'
                },
                {
                    flags: '-s, --serviceName <serviceName>',
                    desc: '服务名，必填'
                },
                {
                    flags: '--path <path>',
                    desc: '本地代码根目录'
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
                    desc: '扩缩容配置，格式为条件类型=条件比例（%），多个条件之间用&隔开，内存条件为mem，cpu条件为cpu，默认内存>60% 或 CPU>60%，即cpu=60&mem=60'
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
                // 版本有关
                {
                    flags: '--containerPort <containerPort>',
                    desc: '监听端口，必填'
                },
                {
                    flags: '--remark <remark>',
                    desc: '版本备注，默认为空'
                },
                {
                    flags: '--targetDir <targetDir>',
                    desc: '目标目录'
                },
                {
                    flags: '--dockerfile <dockerfile>',
                    desc: 'Dockerfile文件名，默认为 Dockerfile'
                },
                {
                    flags: '--library_image <library_image>',
                    desc: '线上镜像仓库的 tag'
                },
                {
                    flags: '--image <image>',
                    desc: '镜像标签或ID'
                },
                {
                    flags: '--json',
                    desc: '以 JSON 形式展示结果'
                }
            ],
            desc: '在指定的环境部署服务'
        }
    }

    @InjectParams()
    async execute(@ArgsOptions() options) {

        let envCheckType = await checkTcbrEnv(options.envId, true)
        if (envCheckType !== EnumEnvCheck.EnvFit) {
            logEnvCheck(options.envId, envCheckType)
            return
        }

        const { data: serviceDetail } = await describeCloudRunServerDetail({
            envId: options.envId,
            serviceName: options.serviceName
        })
        if (serviceDetail == null) {
            // 服务不存在，创建新服务
            await createTcbrService(options)
        } else {
            await updateTcbrService(options)
        }
    }
}