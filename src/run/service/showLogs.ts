import { callTcbrApi } from '../../utils'
import { EnumDeployStatus } from '../../constant'
import chalk from 'chalk'

export async function getBuildStatus(envId: string, serviceName: string) {
    const { data: deployRes } = await callTcbrApi('DescribeCloudRunDeployRecord', {
        EnvId: envId,
        ServerName: serviceName,
    })
    if (deployRes?.DeployRecords) {
        if (deployRes?.DeployRecords[0].Status === EnumDeployStatus.Deploying) {
            return Promise.resolve('pending')
        } else {
            return Promise.resolve('completed')
        }
    } else {
        return Promise.resolve('pending')
    }
}


async function getBuildId(envId: string, serviceName: string): Promise<number> {
    const { data: deployRes } = await callTcbrApi('DescribeCloudRunDeployRecord', {
        EnvId: envId,
        ServerName: serviceName,
    })
    if (deployRes?.DeployRecords) {
        if (deployRes.DeployRecords[0].Status !== 'deploying') {
            return Promise.resolve(deployRes.DeployRecords[0].BuildId)
        }
    }
}

async function getRunId(envId: string, serviceName: string) {
    return new Promise<string>((resolve) => {
        const timer = setInterval(async () => {
            const { data: deployRes } = await callTcbrApi('DescribeCloudRunDeployRecord', {
                EnvId: envId,
                ServerName: serviceName,
            })
            if (deployRes?.DeployRecords) {
                clearInterval(timer)
                resolve(deployRes.DeployRecords[0].RunId)
            }
        }, 3000)
    })
}


// 多次获取 processLog
async function showProcessLogs(envId: string, runId: string, serviceName: string) {
    return new Promise<void>(resolve => {
        const timer = setInterval(async () => {
            if (await getBuildStatus(envId, serviceName) === 'completed') {
                clearInterval(timer)
                resolve()
            } else {
                const { data: processLogs } = await callTcbrApi('DescribeCloudRunProcessLog', {
                    EnvId: envId,
                    RunId: runId,
                })
                if (processLogs?.Logs) {
                    console.log(processLogs?.Logs.join('\n'))
                }
            }
        }, 5000)
    })
}

// buildLog 仅在完成后获取一次（未完成 BuildId 为0）
async function showBuildLogs(envId: string, serviceName: string, serverVersion = '', offset = 0) {
    const buildId = await getBuildId(envId, serviceName)

    const { data } = await callTcbrApi('DescribeCloudRunBuildLog', {
        EnvId: envId,
        BuildId: buildId,
        ServerName: serviceName,
        ServerVersion: serverVersion || '',
        Offset: offset || 0,
    })

    if (data?.Log?.Text) {
        console.log(data?.Log?.Text)
    }
    return Promise.resolve()
}

export async function getLogs(options) {

    const runId = await getRunId(options.envId, options.serviceName)

    console.log(chalk.blue('============ 日志开始 ==============='))
    await showProcessLogs(options.envId, runId, options.serviceName)
    if (await getBuildStatus(options.envId, options.serviceName) === 'completed') {
        await showBuildLogs(options.envId, options.serviceName)
    }
    console.log(chalk.blue('============ 日志结束 ==============='))
}
