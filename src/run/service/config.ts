import { ITcbrServiceConfigOptions, IDescribeCloudRunServerDetail } from '../../types'
import { CloudBaseError } from '@cloudbase/toolbox'
import { mergeEnvParams, extractPolicyDetails, describeCloudRunServerDetail } from './common'
import { callTcbrApi, genClickableLink, parseOptionalParams } from '../../utils'

export async function tcbrServiceConfigOptions(options: ITcbrServiceConfigOptions) {
    let {
        serviceName,
        envId,
        cpu,
        mem,
        minNum,
        maxNum,
        policyDetails,
        customLogs,
        envParams,
    } = options

    if (!envId) {
        throw new CloudBaseError('必须使用 -e 或 --envId 指定环境ID')
    }

    if (!serviceName) {
        throw new CloudBaseError('必须使用 -s 或 --serviceName 指定服务名')
    }

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

    const serviceInfo = await describeCloudRunServerDetail({
        envId,
        serviceName
    })

    if (serviceInfo instanceof Error && serviceInfo['code'] === 'InvalidParameter') {
        throw new CloudBaseError(`服务不存在，请检查服务名是否正确或到控制台 ${genClickableLink('https://console.cloud.tencent.com/tcbr')} 创建服务`)
    }

    const { ServerConfig: previousServerConfig } = serviceInfo.data as IDescribeCloudRunServerDetail

    const newServiceOptions = {
        EnvId: envId,
        ServerName: serviceName,
        OpenAccessTypes: previousServerConfig.OpenAccessTypes,
        Cpu: cpuConverted || previousServerConfig.Cpu,
        Mem: memConverted || previousServerConfig.Mem,
        MinNum: minNumConverted || previousServerConfig.MinNum,
        MaxNum: maxNumConverted || previousServerConfig.MaxNum,
        PolicyDetails: policyDetails ? extractPolicyDetails(policyDetails) : previousServerConfig.PolicyDetails,
        CustomLogs: customLogs || previousServerConfig.CustomLogs,
        EnvParams: envParams ? mergeEnvParams(envParams, previousServerConfig?.EnvParams) : previousServerConfig.EnvParams,
        InitialDelaySeconds: 2,
        CreateTime: previousServerConfig.CreateTime,
        Port: previousServerConfig.Port,
        HasDockerfile: true,
        Dockerfile: previousServerConfig.Dockerfile,
        BuildDir: previousServerConfig.BuildDir,
    }
    return newServiceOptions
}

export async function updateCloudRunServerConfig(options) {
    return await callTcbrApi('UpdateCloudRunServerConfig', {
        EnvId: options.envId,
        ServerBaseConfig: options.ServerBaseConfig,
    })
}