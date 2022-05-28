import { CloudApiService, parseOptionalParams, parseInputParam } from '../../utils'
import { ITcbrServiceOptions, IDescribeWxCloudBaseRunReleaseOrder, ITcbrServiceRequiredOptions } from '../../types'
import { CloudBaseError } from '@cloudbase/toolbox'
import { packageDeploy } from './index'
import { listImage } from '..'
import { DEFAULT_CPU_MEM_SET } from '../../constant'

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

export const parseEnvParams = (envParams: string) => {
    return envParams.split('&').reduce((acc, cur) => {
        const [key, value] = cur.split('=')
        acc[key] = value
        return acc
    }, {})
}

/**
 * @description 合并当前与已有的环境变量，当前传入的环境变量 key 去重并取位置靠后的，如与原有环境变量 key 相同，则替换
 * @param curEnvParams 当前输入的环境变量
 * @param preEnvParams 已有的环境变量
 * @returns 
 */
export const mergeEnvParams = (curEnvParams: string, preEnvParams: string) => {
    const curEnv = parseEnvParams(curEnvParams)
    const preEnv = preEnvParams ? JSON.parse(preEnvParams) : {}
    const curEnvKeys = Object.keys(curEnv)
    Object.entries(preEnv).forEach(([key, value]) => {
        if (!curEnvKeys.includes(key)) {
            curEnv[key] = value
        }
    })
    return JSON.stringify(curEnv)
}

function checkRequiredParams(options: ITcbrServiceRequiredOptions) {
    if (!options.envId) {
        throw new CloudBaseError('必须使用 -e 或 --envId 指定环境ID')
    }

    if (!options.serviceName) {
        throw new CloudBaseError('必须使用 -s 或 --serviceName 指定服务名')
    }

    if (!options.containerPort) {
        throw new CloudBaseError('必须使用 --containerPort 指定监听端口号')
    }

    if (!options.isCreated && !options.path) {
        throw new CloudBaseError('请使用 --path 指定代码根目录')
    }

    if (options.isCreated && !options.path && !options.library_image && !options.image) {
        throw new CloudBaseError('请使用 --path 指定代码根目录或 --library_image 指定线上镜像 tag ')
    }
}

/**
 * 
 * @param options 原始用户输入
 * @param isCreated 服务是否已被创建（未创建的服务不能使用镜像 tag ）
 * @param defaultOverride 是否默认用上次的服务配置替代缺省值
 * @param previousServerConfig 上次的服务配置
 * @returns 
 */
export async function tcbrServiceOptions(options: ITcbrServiceOptions, isCreated: boolean, defaultOverride?: boolean, previousServerConfig?) {
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
        envParams,
        containerPort,
        remark,
        targetDir,
        dockerfile,
        image,
        library_image,
        json: _json = false
    } = options

    // 检查必选参数是否填写
    checkRequiredParams({
        envId,
        serviceName,
        containerPort,
        isCreated,
        path,
        library_image,
        image
    })
    containerPort = Number(containerPort)

    // 处理用户输入的参数
    const DeployInfo: any = {
        DeployType: library_image || image
            ? 'image'
            : 'package',
        DeployRemark: remark || '',
    }
    // 可选参数进行校验和转换
    let {
        cpuConverted,
        memConverted,
        maxNumConverted,
        minNumConverted
    } = parseOptionalParams({
        cpu,
        mem,
        maxNum,
        minNum
    })

    const newServiceOptions = {
        ServerName: serviceName,
        EnvId: envId,
        ServerConfig: {
            EnvId: envId,
            MaxNum: parseInputParam(maxNumConverted, _override, convertNumber, previousServerConfig?.MaxNum, 50),
            MinNum: parseInputParam(minNumConverted, _override, convertNumber, previousServerConfig?.MinNum, 0),
            BuildDir: parseInputParam(targetDir, _override, null, previousServerConfig?.BuildDir, '.'),
            Cpu: parseInputParam(cpuConverted, _override, null, previousServerConfig?.Cpu, 0.5),
            Mem: parseInputParam(memConverted, _override, null, previousServerConfig?.Mem, 1),
            OpenAccessTypes: ['PUBLIC'],
            ServerName: serviceName,
            InitialDelaySeconds: 2,
            CustomLogs: parseInputParam(customLogs, _override, null, previousServerConfig?.CustomLogs, 'stdout'),
            CreateTime: previousServerConfig?.CreateTime || (new Date()).toLocaleString().replace(/\//g, '-'),
            PolicyDetails: parseInputParam(policyDetails, _override, extractPolicyDetails, previousServerConfig?.PolicyDetails, DEFAULT_CPU_MEM_SET),
            EnvParams: parseInputParam(envParams, _override, mergeEnvParams, previousServerConfig?.EnvParams, '', previousServerConfig?.EnvParams),
            Port: containerPort,
            HasDockerfile: true,
            Dockerfile: dockerfile || 'Dockerfile',
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
