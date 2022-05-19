import { describeCloudRunServerDetail } from "./create";
import { ITcbrServiceConfigOptions, IDescribeCloudRunServerDetail } from "../../types";
import { CloudBaseError } from "@cloudbase/toolbox";
import { convertNumber, convertEnvParams, extractPolicyDetails } from "./common";
import { callTcbrApi } from "../../utils";

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
        initialDelaySeconds,
        envParams,
    } = options

    if (!envId) {
        throw new CloudBaseError('必须使用 -e 或 --envId 指定环境ID')
    }

    if (!serviceName) {
        throw new CloudBaseError('必须使用 -s 或 --serviceName 指定服务名')
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
        Cpu: cpu ? convertNumber(cpu) : previousServerConfig.Cpu,
        Mem: mem ? convertNumber(mem) : previousServerConfig.Mem,
        MinNum: minNum ? convertNumber(minNum) : previousServerConfig.MinNum,
        MaxNum: maxNum ? convertNumber(maxNum) : previousServerConfig.MaxNum,
        PolicyDetails: policyDetails ? extractPolicyDetails(policyDetails) : previousServerConfig.PolicyDetails,
        CustomLogs: customLogs ? customLogs : previousServerConfig.CustomLogs,
        EnvParams: envParams ? convertEnvParams(envParams) : previousServerConfig.EnvParams,
        InitialDelaySeconds: initialDelaySeconds ? convertNumber(initialDelaySeconds) : previousServerConfig.InitialDelaySeconds,
        CreateTime: (new Date()).toLocaleString().replace(/\//g, '-'),
        Port: previousServerConfig.Port,
        HasDockerfile: true,
        Dockerfile: previousServerConfig.Dockerfile,
        BuildDir: previousServerConfig.BuildDir,
    }

    return newServiceOptions
}

export async function updateCloudRunServerConfig(options) {
    return await callTcbrApi("UpdateCloudRunServerConfig", {
        EnvId: options.envId,
        ServerBaseConfig: options.ServerBaseConfig,
    })
}