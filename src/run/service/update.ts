import { CloudBaseError, logger } from '@cloudbase/toolbox'
import inquirer from 'inquirer'
import { describeCloudRunServerDetail } from '..'
import { ITcbrServiceOptions } from '../../types'
import { callTcbrApi, genClickableLink } from '../../utils'
import { tcbrServiceOptions } from './common'
import { getBuildStatus, getLogs } from './showLogs'

export async function updateCloudRunServer(serviceConfigOptions) {
    try {
        const res = await callTcbrApi('UpdateCloudRunServer', serviceConfigOptions)
        return res
    } catch (error) {
        console.log(error)
    }
}

export async function updateTcbrService(options: ITcbrServiceOptions) {
    const { data: serviceDetail } = await describeCloudRunServerDetail({
        envId: options.envId,
        serviceName: options.serviceName
    })
    if (serviceDetail === undefined) {
        // 服务不存在
        throw new CloudBaseError(`当前服务不存在，请前往控制台 ${genClickableLink('https://console.cloud.tencent.com/tcbr')} 创建服务`)
    }

    const status = await getBuildStatus(options.envId, options.serviceName)
    if (status === 'pending') {
        throw new CloudBaseError('服务正在更新部署，请稍后再试，或查看实时部署日志')
    }

    // 获取上次的服务配置信息
    const previousServerConfig = serviceDetail?.ServerConfig

    const newServiceOptions = await tcbrServiceOptions(options, true, true, previousServerConfig)

    // 二次确认
    if (!options.noConfirm) {
        const { confirm } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: '确定要更新服务吗？',
            }
        ])
        if (!confirm) {
            return
        }
    }

    const updateRes: any = await updateCloudRunServer(newServiceOptions)

    if (updateRes instanceof Error) {
        // 当前有发布任务在运行中
        throw new CloudBaseError('当前已有部署发布任务运行中，请稍后再试，或查看实时部署日志')
    }

    const taskId = updateRes.data?.TaskId

    if (options.json) {
        console.log(JSON.stringify(updateRes, null, 2))
    }

    if (process.argv.includes('--verbose')) {
        await getLogs({
            envId: options.envId,
            taskId,
            serviceName: options.serviceName
        })
        console.log(`本次任务的 TaskID： ${taskId}`)
    } else {
        logger.success('更新服务成功, 本次任务的 TaskID: ' + taskId)
    }
}