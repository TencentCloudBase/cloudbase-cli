import { CloudApiService } from '../../utils'
import {
    IDescribeRunVersion,
    IUpdateVersion
} from '../../types'

const tcbService = CloudApiService.getInstance('tcb')

export const updateVersion = async (options: IUpdateVersion) => {
    const { Result, RunId } = await tcbService.request('RollUpdateCloudBaseRunServerVersion',
        {
            EnvId: options.envId,
            ServerName: options.serverName,
            VersionName: options.versionName,
            ContainerPort: options.containerPort,
            UploadType: options.uploadType,
            FlowRatio: options.flowRatio,
            VersionRemark: options.versionRemark,

            EnableUnion: options.enableUnion,
            Cpu: String(options.cpu),
            Mem: String(options.mem),
            MinNum: String(options.minNum),
            MaxNum: String(options.maxNum),
            PolicyType: options.policyType,
            PolicyThreshold: String(options.policyThreshold),

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

export const describeRunVersion = async (options: IDescribeRunVersion) => {
    const res = await tcbService.request('DescribeCloudBaseRunServerVersion', {
        EnvId: options.envId,
        ServerName: options.serverName,
        VersionName: options.versionName
    })

    return res
}