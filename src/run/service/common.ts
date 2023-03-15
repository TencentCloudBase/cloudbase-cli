import { CloudApiService, parseOptionalParams, parseInputParam, callTcbrApi, genClickableLink } from '../../utils'
import { ITcbrServiceOptions, IDescribeWxCloudBaseRunReleaseOrder, ITcbrServiceRequiredOptions, DEPLOY_TYPE, IAuthorizedTcrInstance, TCBR_LOG_TYPE } from '../../types'
import { CloudBaseError } from '@cloudbase/toolbox'
import { packageDeploy } from './index'
import { listImage } from '..'
import { DEFAULT_CPU_MEM_SET } from '../../constant'

const tcbService = CloudApiService.getInstance('tcb')
const tcrCloudApiService = new CloudApiService('tcr', {}, '2019-09-24')

export const describeCloudRunServerDetail = async (options: { envId: string; serviceName: string }) => {
    return await callTcbrApi('DescribeCloudRunServerDetail', {
        EnvId: options.envId,
        ServerName: options.serviceName,
    })
}

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
        throw new CloudBaseError('请使用 -e 或 --envId 指定环境ID')
    }

    if (!options.serviceName) {
        throw new CloudBaseError('请使用 -s 或 --serviceName 指定服务名')
    }

    if (!options.containerPort) {
        throw new CloudBaseError('请使用 --containerPort 指定监听端口号')
    }

    if (!options.isCreated && !options.path && !options.custom_image) {
        throw new CloudBaseError('请使用 --path 指定代码根目录或 --custom_image 指定 TCR 镜像 URL')
    }

    if (options.isCreated && !options.path && !options.custom_image && !options.library_image && !options.image) {
        throw new CloudBaseError('请使用 --path 指定代码根目录或 --custom_image 指定 TCR 镜像 URL 或 --library_image 指定线上镜像 tag ')
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
        custom_image,
        library_image,
        log_type,
        json: _json = false
    } = options

    // 检查必选参数是否填写
    checkRequiredParams({
        envId,
        serviceName,
        containerPort,
        isCreated,
        path,
        custom_image,
        library_image,
        image
    })
    containerPort = Number(containerPort)

    // 处理用户传入参数
    const deployByImage = Boolean(custom_image || library_image || image)
    const DeployInfo: any = {
        DeployType: deployByImage ? DEPLOY_TYPE.IMAGE : DEPLOY_TYPE.PACKAGE,
        DeployRemark: remark || '',
        ReleaseType: 'FULL'
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

    if (log_type && log_type !== TCBR_LOG_TYPE.NONE) {
        throw new CloudBaseError('日志类型 log_type 只能为 none，如需自定义日志，请前往控制台配置')
    }

    const defaultLogType = TCBR_LOG_TYPE.NONE
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
            LogType: parseInputParam(log_type, _override, null, previousServerConfig?.LogType, defaultLogType),
            // CLS配置, 当日志类型为 custom 时生效, 未开放，默认传原来的
            LogSetId: previousServerConfig?.LogSetId,
            LogTopicId: previousServerConfig?.LogTopicId,
            LogParseType: previousServerConfig?.LogParseType,
        },
        DeployInfo: {
            ...DeployInfo
        }
    }

    if (DeployInfo.DeployType === DEPLOY_TYPE.PACKAGE) {
        // 本地上传
        const { PackageName, PackageVersion } = await packageDeploy({
            envId,
            serviceName,
            filePath: path,
        })
        DeployInfo.PackageName = PackageName
        DeployInfo.PackageVersion = PackageVersion
    } else if (DeployInfo.DeployType === DEPLOY_TYPE.IMAGE) {
        // 传入 tcr 镜像实例
        if (custom_image) {
            const authorizedTcrInstances = await getAuthorizedTcrInstance(envId)
            if (!authorizedTcrInstances) {
                const link = `https://console.cloud.tencent.com/tcbr/env?/tcbr/env=&envId=${envId}`
                throw new CloudBaseError(`您还未授权 tcr 实例，请先到控制台授权：${genClickableLink(link)}`)
            }
            // 检查传入的 URL 是否合法，不合法 throw error 阻止执行
            await validateTcrImageURL(authorizedTcrInstances, custom_image)

            DeployInfo.ImageUrl = custom_image
        } else {
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
                throw new CloudBaseError('暂不支持 --image 参数，请使用 --custom_image 指定 tcr 镜像 URL 或 --library_image 指定线上镜像 tag')
            }
        }
    }

    newServiceOptions.DeployInfo = {
        ...DeployInfo
    }
    return newServiceOptions
}

// 获取授权 tcr 实例
export async function getAuthorizedTcrInstance(envId: string): Promise<IAuthorizedTcrInstance[] | null> {
    let { data: { TcrInstances: authorizedTcrInstances } } = await callTcbrApi('DescribeTcrInstances', {
        EnvId: envId
    })
    return authorizedTcrInstances
}

/**
 * 
 * @description 校验输入的 tcr 镜像 URL 是否合法（域名/仓库名:镜像tag）
 * @param authorizedTcrInstances 已授权的 tcr 实例列表
 * @param imageUrl 输入的镜像 URL 地址
 */
export async function validateTcrImageURL(authorizedTcrInstances: IAuthorizedTcrInstance[] | null, imageUrl: string) {
    const errMsg = '镜像URL解析失败，请检查输入的镜像URL是否正确'
    try {
        const host = imageUrl.split('/')[0]
        const namespace = imageUrl.split('/')[1]
        const name = `${namespace}/${imageUrl.split('/')[2].split(':')[0]}`
        const tag = imageUrl.split('/')[2].split(':')[1]
        // 获取授权实例，校验域名
        const filteredInstances = authorizedTcrInstances?.filter(({ Domain }) => host === Domain)

        if (!filteredInstances?.length) {
            throw new CloudBaseError(errMsg)
        }
        // 获取实例中仓库，校验仓库名
        const reposUnderSpecifiedRegistry = []
        for (const registry of filteredInstances) {
            const repos = []
            let { Id: registryId, Domain: domain } = registry
            const limit = 100
            let curIndex = 1
            let totalCount = 0
            do {
                const rsp = await tcrCloudApiService.request('DescribeRepositories', {
                    RegistryId: registryId,
                    Offset: curIndex,
                    Limit: limit
                })
                repos.push(...rsp.RepositoryList)
                curIndex += 1
                totalCount = rsp.TotalCount
            } while (repos.length < totalCount)
            reposUnderSpecifiedRegistry.push({ registryId, domain, repos })
        }

        const filteredRepos = []
        for (const repo of reposUnderSpecifiedRegistry) {
            const { registryId, repos } = repo
            filteredRepos.push(...repos.filter(({ Name }) => Name === name))
            if (!filteredRepos?.length) {
                throw new CloudBaseError(errMsg)
            }
            filteredRepos.forEach(item => { item.registryId = registryId })   // 手动插入实例id，获取镜像接口用
        }
        // 获取仓库内镜像，校验tag
        for (const repoItem of filteredRepos) {
            const { Name, Namespace, registryId } = repoItem
            const images = []
            const limit = 100
            let curIndex = 1
            let totalCount = 0
            do {
                const rsp = await tcrCloudApiService.request('DescribeImages', {
                    RegistryId: registryId,
                    NamespaceName: Namespace,
                    RepositoryName: Name.split(`${Namespace}/`)[1],
                    Offset: curIndex,
                    Limit: limit
                })
                images.push(...rsp.ImageInfoList)
                curIndex += 1
                totalCount = rsp.TotalCount
            } while (images.length < totalCount)

            if (!images.some(({ ImageVersion }) => ImageVersion === tag)) {
                throw new CloudBaseError(errMsg)
            }
        }
    } catch (e) {
        throw new CloudBaseError(errMsg)
    }
}