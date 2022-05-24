import { callTcbrApi } from '../../utils'
import { getLogs, tcbrServiceOptions } from '.'
import inquirer from 'inquirer'
import { ITcbrServiceOptions } from '../../types'
import { logger } from '@cloudbase/toolbox'

export const describeCloudRunServerDetail = async (options: { envId: string; serviceName: string }) => {
    return await callTcbrApi('DescribeCloudRunServerDetail', {
        EnvId: options.envId,
        ServerName: options.serviceName,
    })
}

export async function createCloudRunServer(serviceConfigOptions) {
    return callTcbrApi('CreateCloudRunServer', serviceConfigOptions)
}

export async function createTcbrService(options: ITcbrServiceOptions) {
    const newServiceOptions = await tcbrServiceOptions(options, false)

    if (!options.noConfirm) {
        const { confirm } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: '确定要创建服务吗？',
            }
        ])
        if (!confirm) {
            return
        }
    }

    const createRes: any = await createCloudRunServer(newServiceOptions)
    const taskId = createRes.data?.TaskId

    if (options.json) {
        console.log(JSON.stringify(createRes, null, 2))
    }

    // `--verbose` 也用于全局指定参数，因此不能从 options 中获取到
    if (process.argv.includes('--verbose')) {
        await getLogs({
            envId: options.envId,
            taskId,
            serviceName: options.serviceName
        })
        console.log(`本次任务的 TaskID： ${taskId}`)
    } else {
        logger.success('创建服务成功, 本次任务的 TaskID: ' + taskId)
    }
}