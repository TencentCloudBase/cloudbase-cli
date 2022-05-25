/* eslint-disable complexity */
import { CloudApiService } from '../../utils'
import { ITcbrServiceOptions, IDescribeWxCloudBaseRunReleaseOrder } from '../../types'
import { CloudBaseError, loadingFactory } from '@cloudbase/toolbox'
import { packageDeploy } from './index'
import { listImage } from '..'
import { validateCpuMem } from '../../utils/validator'

const tcbService = CloudApiService.getInstance('tcb')

export async function describeWxCloudBaseRunReleaseOrder(options: IDescribeWxCloudBaseRunReleaseOrder) {
    const res = await tcbService.request('DescribeWxCloudBaseRunReleaseOrder', {
        EnvId: options.envId,
        ServerName: options.serviceName
    })
    return res
}

export const convertNumber = (item) => {
    if (isNaN(Number(item))) {
        throw new CloudBaseError(`${item} 必须为数字`)
    }
    return Number(item)
}

export const extractPolicyDetails = (policyDetails: string) => {
    return policyDetails.split('&').map(condition => {
        let [type, threshold] = [condition.split('=')[0], Number(condition.split('=')[1])]
        if (isNaN(threshold) || !['cpu', 'mem'].includes(type)) {
            throw new CloudBaseError('请输入合法的缩扩容配置')
        }
        return {
            PolicyType: type,
            PolicyThreshold: threshold
        }
    })
}

export const convertEnvParams = (envParams: string) => {
    return JSON.stringify(
        envParams.split('&').reduce((acc, cur) => {
            const [key, value] = cur.split('=')
            acc[key] = value
            return acc
        }, {})
    )
}

/**
 * 
 * @param options 原始用户输入
 * @param defaultOverride 是否默认用上次的服务配置替代缺省值
 * @param previousServerConfig 上次的服务配置
 * @returns 
 */
export async function tcbrServiceOptions(options: ITcbrServiceOptions, defaultOverride?: boolean, previousServerConfig?) {
    let {
        noConfirm: _noConfirm = false,
        override: _override = (defaultOverride || false),
        envId,
        serviceName,
        path,
        cpu,
        mem,
        minNum,
        maxNum,
        policyDetails,
        customLogs,
        initialDelaySeconds,
        envParams,
        containerPort,
        remark,
        targetDir,
        dockerfile,
        image,
        library_image,
        json: _json = false
    } = options

    if (!envId) {
        throw new CloudBaseError('必须使用 -e 或 --envId 指定环境ID')
    }

    if (!serviceName) {
        throw new CloudBaseError('必须使用 -s 或 --serviceName 指定服务名')
    }

    if (!containerPort) {
        throw new CloudBaseError('必须使用 --containerPort 指定监听端口号')
    }
    containerPort = Number(containerPort)

    if (!path && !library_image && !image) {
        throw new CloudBaseError('请使用 --path 指定代码根目录或 --library_image 指定线上镜像 tag ')
    }

    const loading = loadingFactory()

    // 处理用户输入的参数
    const DeployInfo: any = {
        DeployType: library_image || image
            ? 'image'
            : 'package',
        DeployRemark: remark || '',
    }

    let cpuConverted
    let memConverted
    if(cpu || mem) {
        let data = validateCpuMem(cpu, mem)
        ;[ cpuConverted, memConverted ] = [data.cpuOutput, data.memOutput]
    }

    const newServiceOptions = {
        ServerName: serviceName,
        EnvId: envId,
        ServerConfig: {
            EnvId: envId,
            MaxNum: maxNum
                ? convertNumber(maxNum)
                : _override
                    ? (previousServerConfig?.MaxNum)
                    : 50,
            MinNum: minNum
                ? convertNumber(minNum)
                : _override
                    ? (previousServerConfig?.MinNum)
                    : 0,
            BuildDir: targetDir
                ? targetDir
                : _override
                    ? (previousServerConfig?.BuildDir)
                    : '.',
            Cpu: cpuConverted || ( _override ? (previousServerConfig?.Cpu) : 0.5 ),
            Mem: memConverted || ( _override ? (previousServerConfig?.Mem) : 1 ),
            OpenAccessTypes: ['PUBLIC'],
            ServerName: serviceName,
            InitialDelaySeconds: initialDelaySeconds
                ? convertNumber(initialDelaySeconds)
                : _override
                    ? (previousServerConfig?.InitialDelaySeconds)
                    : 3,
            CustomLogs: customLogs
                ? customLogs
                : _override
                    ? (previousServerConfig?.CustomLogs)
                    : 'stdout',
            CreateTime: (new Date()).toLocaleString().replace(/\//g, '-'),
            PolicyDetails: policyDetails
                ? extractPolicyDetails(policyDetails)
                : _override
                    ? (previousServerConfig?.PolicyDetails)
                    : [
                        {
                            PolicyType: 'mem',
                            PolicyThreshold: 60
                        },
                        {
                            PolicyType: 'cpu',
                            PolicyThreshold: 60
                        },
                    ],
            EnvParams: envParams
                ? convertEnvParams(envParams)
                : _override
                    ? (previousServerConfig?.EnvParams)
                    : '',
            Port: containerPort,
            HasDockerfile: true,
            Dockerfile: dockerfile
                ? dockerfile
                : 'Dockerfile',
        },
        DeployInfo: {
            ...DeployInfo
        }
    }

    if (DeployInfo.DeployType === 'package') {
        // 本地上传
        const { PackageName, PackageVersion } = await packageDeploy({
            envId,
            serviceName,
            filePath: path,
        })
        DeployInfo.PackageName = PackageName
        DeployInfo.PackageVersion = PackageVersion
    } else if (DeployInfo.DeployType === 'image') {
        // 拉取镜像
        const imageList = await listImage({
            envId,
            serviceName
        })
        if (library_image) {
            const imageInfo = imageList.find(({ Tag }) => Tag === library_image)
            if (!imageInfo) {
                throw new CloudBaseError(`镜像 ${library_image} 不存在`)
            }
            DeployInfo.ImageUrl = imageInfo.ImageUrl
        } else {
            // 暂时不支持 image 镜像
            throw new CloudBaseError('暂不支持 --image 参数，请使用 --library_image 指定线上镜像 tag')
        }
    }

    newServiceOptions.DeployInfo = {
        ...DeployInfo
    }

    return newServiceOptions
}
