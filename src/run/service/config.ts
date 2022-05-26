import { describeCloudRunServerDetail } from './create'
import { ITcbrServiceConfigOptions, IDescribeCloudRunServerDetail } from '../../types'
import { CloudBaseError } from '@cloudbase/toolbox'
import { convertNumber, mergeEnvParams, extractPolicyDetails } from './common'
import { callTcbrApi } from '../../utils'
import { validateCpuMem } from '../../utils/validator'

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
        InitialDelaySeconds,
        envParams,
    } = options

    if (!envId) {
        throw new CloudBaseError('必须使用 -e 或 --envId 指定环境ID')
    }

    if (!serviceName) {
        throw new CloudBaseError('必须使用 -s 或 --serviceName 指定服务名')
    }

    let cpuConverted
    let memConverted
    if(cpu || mem) {
        let data = validateCpuMem(cpu, mem)
        ;[ cpuConverted, memConverted ] = [data.cpuOutput, data.memOutput]
    }

    let maxNumConverted
    if(maxNum) {
        maxNumConverted = convertNumber(maxNum)
        if(maxNumConverted < 0 || maxNumConverted > 50) {
            throw new CloudBaseError('最大副本数必须大于等于0且小于等于50')
        }
    }

    let minNumConverted
    if(minNum) {
        minNumConverted = convertNumber(minNum)
        if(minNumConverted < 0 || minNumConverted > 50) {
            throw new CloudBaseError('最小副本数必须大于等于0且小于等于50')
        }
    }

    if(minNumConverted > maxNumConverted) {
        throw new CloudBaseError('最小副本数不能大于最大副本数')
    }

    const serviceInfo = await describeCloudRunServerDetail({
        envId,
        serviceName
    })

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
        CustomLogs: customLogs ? customLogs : previousServerConfig.CustomLogs,
        EnvParams: envParams ? mergeEnvParams(envParams, previousServerConfig?.EnvParams) : previousServerConfig.EnvParams,
        InitialDelaySeconds: InitialDelaySeconds ? convertNumber(InitialDelaySeconds) : previousServerConfig.InitialDelaySeconds,
        CreateTime: (new Date()).toLocaleString().replace(/\//g, '-'),
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