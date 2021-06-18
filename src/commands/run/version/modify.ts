import { prompt } from 'enquirer'
import { Command, ICommand } from '../../common'
import { CloudBaseError } from '../../../error'
import { listVersion, modifyVersion } from '../../../run'
import { loadingFactory, pagingSelectPromp } from '../../../utils'
import { InjectParams, EnvId, ArgsOptions } from '../../../decorators'
import { versionCommonOptions } from './common'

// 按百分比配置
const modifyByFlow = async (envId: any, serviceName: string) => {
    const versionFlowItems: {
        VersionName: string
        FlowRatio: number
    }[] = []

    const loading = loadingFactory()

    while (true) {
        let versionName = await pagingSelectPromp(
            'select',
            listVersion,
            { envId, serverName: serviceName },
            '请选择版本',
            (item) => item.Status === 'normal',
            (item) => `${item.VersionName}|${item.Remark}`
        )
        versionName = (versionName as string).split('|')[0]
        if (versionFlowItems.find((item) => item.VersionName === versionName))
            throw new CloudBaseError('已经选择过该version')

        let { flowRatio } = await prompt<any>({
            type: 'input',
            name: 'flowRatio',
            message: '请输入流量配置（%）'
        })

        if (
            Number.isNaN(flowRatio) ||
            Number(flowRatio) < 0 ||
            Math.floor(Number(flowRatio)) - Number(flowRatio) !== 0
        )
            throw new CloudBaseError('请输入大于等于零的整数')

        versionFlowItems.push({
            VersionName: versionName as string,
            FlowRatio: Number(flowRatio)
        })

        if (
            (
                await prompt<any>({
                    type: 'select',
                    name: 'continue',
                    message: '还要继续选择吗',
                    choices: ['继续', '结束']
                })
            ).continue === '结束'
        )
            break
    }

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
const modifyByURL = async (envId: any, serviceName: string) => {
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

    let Priority = 1
    while (true) {
        let versionName = await pagingSelectPromp(
            'select',
            listVersion,
            { envId, serverName: serviceName },
            `请选择优先级${Priority}的版本`,
            (item) => item.Status === 'normal',
            (item) => `${item.VersionName}|${item.Remark}`
        )
        versionName = (versionName as string).split('|')[0]

        const { key } = await prompt<any>({
            type: 'input',
            name: 'key',
            message: `请输入优先级${Priority}条件的URL-key`
        })
        const { value } = await prompt<any>({
            type: 'input',
            name: 'value',
            message: `请输入优先级${Priority}条件的URL-value`
        })

        versionFlowItems.push({
            VersionName: versionName as string,
            FlowRatio: 0,
            IsDefaultPriority: false,
            Priority,
            UrlParam: {
                Key: key,
                Value: value
            }
        })

        Priority++

        if (
            (
                await prompt<any>({
                    type: 'select',
                    name: 'continue',
                    message: '还要继续输入吗',
                    choices: ['继续', '结束']
                })
            ).continue === '结束'
        )
            break
    }

    let versionName = await pagingSelectPromp(
        'select',
        listVersion,
        { envId, serverName: serviceName },
        '请选择默认的版本',
        (item) => item.Status === 'normal',
        (item) => `${item.VersionName}|${item.Remark}`
    )
    versionName = (versionName as string).split('|')[0]

    if (!versionFlowItems.some((item) => item.VersionName === versionName)) {
        versionFlowItems.push({
            VersionName: versionName as string,
            FlowRatio: 0,
            IsDefaultPriority: true
        })
    } else {
        versionFlowItems.forEach((item) => {
            if (item.VersionName === versionName) {
                item.IsDefaultPriority = true
            }
        })
    }
    console.log(versionFlowItems)

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
                    flags: '-t, --trafficType <trafficType>',
                    desc: '配置类型 type，只允许 FLOW 或 URL，默认FLOW'
                }
            ],
            desc: '展示选择的云托管服务的版本列表'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsOptions() options) {
        let { serviceName = '', trafficType = 'FLOW' } = options
        if (serviceName.length === 0) throw new CloudBaseError('请填入有效云托管服务名')

        if (trafficType === 'URL') {
            modifyByURL(envId, serviceName)
        } else {
            modifyByFlow(envId, serviceName)
        }
    }
}
