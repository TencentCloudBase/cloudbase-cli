import { callTcbrApi } from "../../utils";
import chalk from "chalk";

export async function getBuildStatus(envId: string, serviceName: string) {
    return new Promise<string>(async (resolve) => {
        const { data: deployRes } = await callTcbrApi('DescribeCloudRunDeployRecord', {
            EnvId: envId,
            ServerName: serviceName,
        })
        if (deployRes?.DeployRecords != null) {
            if (deployRes?.DeployRecords[0].Status === 'running') {
                resolve('completed')
            } else {
                resolve('pending')
            }
        } else {
            resolve('pending')
        }
    })
}


async function getBuildId(envId: string, serviceName: string) {
    return new Promise<string>(async (resolve) => {
        const { data: deployRes } = await callTcbrApi('DescribeCloudRunDeployRecord', {
            EnvId: envId,
            ServerName: serviceName,
        })
        if (deployRes.DeployRecords != null) {
            if (deployRes.DeployRecords[0].Status !== 'deploying') {
                resolve(deployRes.DeployRecords[0].BuildId)
            }
        }
    })
}

async function getRunId(envId: string, serviceName: string) {
    return new Promise<string>((resolve) => {
        const timer = setInterval(async () => {
            const { data: deployRes } = await callTcbrApi('DescribeCloudRunDeployRecord', {
                EnvId: envId,
                ServerName: serviceName,
            })
            if (deployRes.DeployRecords != null) {
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
                if (processLogs?.Logs != null) {
                    console.log(processLogs?.Logs.join('\n'))
                }
            }
        }, 5000)
    })
}

// buildLog 仅在完成后获取一次（未完成 BuildId 为0）
async function showBuildLogs(envId: string, serviceName: string, serverVersion = '', offset = 0) {
    return new Promise<void>(async resolve => {
        const buildId = await getBuildId(envId, serviceName)

        const { data: data } = await callTcbrApi('DescribeCloudRunBuildLog', {
            EnvId: envId,
            BuildId: buildId,
            ServerName: serviceName,
            ServerVersion: serverVersion || '',
            Offset: offset || 0,
        })

        if (data?.Log?.Text) {
            console.log(data?.Log?.Text)
        }
        resolve()
    })
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
