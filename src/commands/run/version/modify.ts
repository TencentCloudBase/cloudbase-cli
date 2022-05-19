import { prompt } from 'enquirer'
import { Command, ICommand } from '../../common'
import { CloudBaseError } from '../../../error'
import { listVersion, modifyVersion } from '../../../run'
import { checkTcbrEnv, loadingFactory, logEnvCheck, pagingSelectPromp } from '../../../utils'
import { InjectParams, EnvId, ArgsOptions } from '../../../decorators'
import { versionCommonOptions } from './common'
import { EnumEnvCheck } from '../../../types'

// 按百分比配置
const modifyByFlow = async (envId: any, serviceName: string, mode: string) => {
    const versionFlowItems: {
        VersionName: string
        FlowRatio: number
    }[] = []

    const loading = loadingFactory()

    mode.split('|')[1]
        .split('&')
        .forEach((item) => {
            versionFlowItems.push({
                VersionName: item.split('=')[0],
                FlowRatio: Number(item.split('=')[1])
            })
        })

    let sum = versionFlowItems.reduce((sum, item) => sum + item.FlowRatio, 0)
    if (sum !== 100 && sum !== 0) throw new CloudBaseError('流量配置的总和需要为 0 或 100')

    loading.start('数据加载中...')

    const res = await modifyVersion({
        envId,
        serverName: serviceName,
        trafficType: 'FLOW',
        versionFlowItems
    })
    if (res !== 'succ') throw new CloudBaseError('分配失败')

    loading.succeed('分配成功')
}

// 按URL配置
const modifyByURL = async (envId: any, serviceName: string, mode: string) => {
    const versionFlowItems: {
        VersionName: string
        FlowRatio: 0
        Priority?: number
        IsDefaultPriority: boolean
        UrlParam?: {
            Key: string
            Value: string
        }
    }[] = []

    const loading = loadingFactory()

    mode.split('|')[1]
        .split('&')
        .forEach((item, index) => {
            versionFlowItems.push({
                VersionName: item.split(',')[2],
                FlowRatio: 0,
                Priority: index + 1,
                IsDefaultPriority: false,
                UrlParam: {
                    Key: item.split(',')[0],
                    Value: item.split(',')[1]
                }
            })
        })

    if (!versionFlowItems.some((item) => item.VersionName === mode.split('|')[2])) {
        versionFlowItems.push({
            VersionName: mode.split('|')[2],
            FlowRatio: 0,
            IsDefaultPriority: true
        })
    } else {
        versionFlowItems.find((item) => item.VersionName === mode.split('|')[2]).IsDefaultPriority = true
    }

    loading.start('数据加载中...')

    const res = await modifyVersion({
        envId,
        serverName: serviceName,
        trafficType: 'URL_PARAMS',
        versionFlowItems
    })
    if (res !== 'succ') throw new CloudBaseError('分配失败')

    loading.succeed('分配成功')
}

@ICommand()
export class ModifyVersion extends Command {
    get options() {
        return {
            ...versionCommonOptions('modify'),
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-s, --serviceName <serviceName>',
                    desc: '托管服务 name'
                },
                {
                    flags: '-t, --traffic <traffic>',
                    desc: '配置 type，按百分比分配即为FLOW|versionName1=a&...&versionName1=b，按URL分配则是URL|key1,value1,version1&...&key1,value1,version1|defaultVersion'
                }
            ],
            desc: '展示选择的云托管服务的版本列表'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsOptions() options) {
        let envCheckType = await checkTcbrEnv(options.envId, false)
        if(envCheckType !== EnumEnvCheck.EnvFit) {
            logEnvCheck(envId, envCheckType)
            return
        }
        
        let { serviceName = '', traffic: _traffic = 'FLOW' } = options
        if (serviceName.length === 0) throw new CloudBaseError('请填入有效云托管服务名')

        if (_traffic.split('|')[0] === 'URL') {
            modifyByURL(envId, serviceName, _traffic)
        } else {
            modifyByFlow(envId, serviceName, _traffic)
        }
    }
}
