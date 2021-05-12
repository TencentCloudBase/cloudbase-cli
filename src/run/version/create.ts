import { CloudApiService } from '../../utils'
import {
    ICreateVersion,
    ILogCreateVersion
} from '../../types'

const tcbService = CloudApiService.getInstance('tcb')

export const createVersion = async (options: ICreateVersion) => {
    const { Result, RunId } = await tcbService.request('CreateCloudBaseRunServerVersion',
        {
            EnvId: options.envId,
            ServerName: options.serverName,
            ContainerPort: options.containerPort,
            UploadType: options.uploadType,
            FlowRatio: options.flowRatio,
            VersionRemark: options.versionRemark,

            EnableUnion: options.enableUnion,
            Cpu: options.cpu,
            Mem: options.mem,
            MinNum: options.minNum,
            MaxNum: options.maxNum,
            PolicyType: options.policyType,
            PolicyThreshold: options.policyThreshold,

            CustomLogs: options.customLogs,
            DockerfilePath: options.dockerfilePath,
            EnvParams: options.envParams,
            InitialDelaySeconds: options.initialDelaySeconds,

            ...(options.uploadType === 'package' ? {
                PackageName: options.packageName,
                PackageVersion: options.packageVersion,
                DockerfilePath: options.dockerfilePath
            } : options.uploadType === 'image' ? {
                ImageInfo: options.imageInfo
            } : {
                RepositoryType: options.repositoryType,
                Branch: options.branch,
                CodeDetail: options.codeDetail,
                DockerfilePath: options.dockerfilePath
            })
        },
    )

    return { Result, RunId }
}

export const logCreate = async (options: ILogCreateVersion) => {
    let { Logs } = await tcbService.request('DescribeCloudBaseRunProcessLog', {
        EnvId: options.envId,
        RunId: options.runId
    })

    return Logs
}

export const basicOperate = async (options: ILogCreateVersion) => {
    let { Percent, ActionDetail: { Status } } = await tcbService.request('DescribeCloudBaseRunOperateBasic', {
        EnvId: options.envId,
        RunId: options.runId
    })

    return { Percent, Status }
}