import { CloudBaseError } from './error'

export type CustomEvent = 'logout'

export interface ICommandContext {
    cmd: string
    envId: string
    config: ICloudBaseConfig
    options: any
    params: string[]
    hasPrivateSettings: boolean
}

/* eslint-disable */
declare global {
    namespace NodeJS {
        interface Process extends EventEmitter {
            VERBOSE: boolean
            CLI_VERSION: string
            on(event: CustomEvent, listener: BeforeExitListener)
            emit(event: CustomEvent, message?: any)
        }
    }
}

export interface PermanentCredential {
    secretId?: string
    secretKey?: string
}

export interface TmpCredential {
    tmpSecretId?: string
    tmpSecretKey?: string
    tmpToken?: string
    tmpExpired?: string
    expired?: string
    authTime?: string
    refreshToken?: string
    uin?: string
    hash?: string
}

export type Credential = TmpCredential & PermanentCredential

export interface AuthSecret {
    secretId: string
    secretKey: string
    token?: string
}

export interface IConfig {
    credential?: Credential
}

export interface ICloudBaseConfig {
    envId: string
    functionRoot?: string
    functions?: ICloudFunction[]
    servers?: ServerConfig[]
}

export interface IGetCredential {
    secretId?: string
    secretKey?: string
    token: string
}

export enum ServerLanguageType {
    node = 'node'
}

export interface ServerConfig {
    type: ServerLanguageType.node
    name: string
    path: string
}

/**
 * 函数
 */
export interface IFunctionPackResult {
    success: boolean
    assets: string[]
    vemo?: boolean
}

export interface IFunctionVPC {
    subnetId: string
    vpcId: string
}

export interface ICloudFunctionConfig {
    timeout?: number
    envVariables?: Record<string, string | number | boolean>
    runtime?: string
    vpc?: IFunctionVPC
    installDependency?: boolean
    l5?: boolean
}

export interface ICloudFunctionTrigger {
    name: string
    type: string
    config: string
}

export interface ICloudFunction {
    name: string
    config?: ICloudFunctionConfig
    triggers?: ICloudFunctionTrigger[]
    params?: Record<string, string>
    handler?: string
    ignore?: string | string[]
    timeout?: number
    envVariables?: Record<string, string | number | boolean>
    runtime?: string
    vpc?: IFunctionVPC
    l5?: boolean
    installDependency?: boolean
    isWaitInstall?: boolean
}

export interface ICreateFunctionOptions {
    // 函数配置信息
    func?: ICloudFunction
    functions?: ICloudFunction[]
    functionRootPath?: string
    envId: string
    force?: boolean
    base64Code?: string
    log?: boolean
    codeSecret?: string
    functionPath?: string
    accessPath?: string
}

export interface IListFunctionOptions {
    limit?: number
    offset?: number
    envId: string
}

export interface IFunctionLogOptions {
    functionName: string
    envId: string
    offset?: number
    limit?: number
    order?: string
    orderBy?: string
    startTime?: string
    endTime?: string
    functionRequestI?: string
}

export interface IUpdateFunctionConfigOptions {
    functionName: string
    config: ICloudFunctionConfig
    envId: string
}

export interface InvokeFunctionOptions {
    functionName: string
    params?: Record<string, any>
    envId: string
}

export interface IFunctionBatchOptions {
    functions: ICloudFunction[]
    envId: string
    log?: boolean
}

export interface IFunctionTriggerOptions {
    functionName: string
    triggers?: ICloudFunctionTrigger[]
    triggerName?: string
    envId: string
}

export interface ILoginOptions {
    key?: boolean
    secretId?: string
    secretKey?: string
    token?: string
    // 修改浏览器登录打开的链接
    getAuthUrl?: (url: string) => string
}

export interface GatewayContext {
    // 环境 id
    envId: string
    // 整体配置
    config: ICloudBaseConfig
}

export interface ICreateFunctionGatewayOptions {
    envId: string
    path: string
    name: string
}

export interface IQueryGatewayOptions {
    envId: string
    domain?: string
    path?: string
    gatewayId?: string
    name?: string
}

export interface IDeleteGatewayOptions {
    envId: string
    path?: string
    gatewayId?: string
    name?: string
}

export interface IBindGatewayDomainOptions {
    envId: string
    domain: string
}

export interface IQueryGatewayDomainOptions {
    envId: string
    domain?: string
}

export interface IUnbindGatewayDomainOptions {
    envId: string
    domain: string
}

export interface IListRunOptions {
    limit?: number
    offset?: number
    envId: string
}

export interface ICreateRunOptions {
    envId: string,
    name: string,
    remark: string,
    vpcInfo: {
        VpcId: string,
        SubnetIds: string[],
        CreateType: number
    },
    imageRepo?: string,
    logType: string,
    esInfo?: {
        Ip: string,
        Port: number,
        Index: string,
        Account: string,
        Password: string
    },
    isPublic: boolean,
    publicAccess: number
}

export interface IListVersionOptions {
    envId: string,
    limit?: number,
    offset?: number,
    serverName: string
}

export interface IDeleteVersion {
    envId: string,
    serverName: string,
    versionName: string
}

export interface IModifyVersion {
    envId: string,
    serverName: string,
    trafficType: string,
    versionFlowItems: {
        VersionName: string,
        FlowRatio: number,
        IsDefaultPriority?: boolean,
        Priority?: number,
        UrlParam?: {
            Key: string,
            Value: string
        }
    }[]
}

export interface IBuildImage {
    envId: string,
    serviceName: string
}

export interface ICreateVersion {
    envId: string,
    serverName: string,
    containerPort: number,
    uploadType: string,
    packageName?: string,
    packageVersion?: string,
    repositoryType?: string,
    branch?: string,
    codeDetail?: { Name: { Name: string, FullName: string } },
    imageInfo?: {
        ImageUrl: string,
        // IsPublic: boolean,
        // RepositoryName: string,
        // ServerAddr: string,
        // TagName: string
    },
    flowRatio: number,
    versionRemark: string,

    enableUnion: true,
    cpu: number,
    mem: number,
    minNum: number,
    maxNum: number,
    policyType: string,
    policyThreshold: number,

    customLogs: string
    dockerfilePath?: string,
    envParams: string,
    initialDelaySeconds: number,
}

export interface IUpdateVersion {
    envId: string,
    serverName: string,
    versionName: string,
    containerPort: number,
    uploadType: string,
    packageName?: string,
    packageVersion?: string,
    repositoryType?: string,
    branch?: string,
    codeDetail?: { Name: { Name: string, FullName: string } },
    imageInfo?: {
        ImageUrl: string,
        // IsPublic: boolean,
        // RepositoryName: string,
        // ServerAddr: string,
        // TagName: string
    },
    flowRatio: number,
    versionRemark: string,

    enableUnion: true,
    cpu: number,
    mem: number,
    minNum: number,
    maxNum: number,
    policyType: string,
    policyThreshold: number,

    customLogs: string
    dockerfilePath?: string,
    envParams: string,
    initialDelaySeconds: number,
}

export interface IListCodeRepo {
    channel: string,
    pageNumber: number,
    pageSize: number
}

export interface IListBranch {
    channel: string,
    pageNumber: number,
    pageSize: number
    repoName: { Name: string, FullName: string }
}

export interface IListImage {
    envId: string,
    serviceName: string,
    limit?: number,
    offset?: number
}

export interface IDeleteImage {
    envId: string,
    imageUrl: string
}

export interface ILogCreateVersion {
    envId: string,
    runId: string
}

export interface IDescribeRunVersion {
    envId: string,
    serverName: string,
    versionName: string
}

export interface IDeleteRun {
    envId: string,
    serverName: string
}

export interface IListPackageStandaloneGateway {
    envId: string,
    packageVersion: string
}

export interface ICreateStandaloneGateway {
    envId: string,
    gatewayAlias: string,
    gatewayDesc: string,
    vpcId: string,
    subnetIds: string[],
    packageVersion: string
}

export interface IListStandaloneGateway {
    envId: string,
    gatewayName: string,
    gatewayAlias: string
}

export interface ITurnOnStandaloneGateway {
    envId: string,
    gatewayName: string,
    serviceList: string[]
}

export interface ITurnOffStandaloneGateway {
    envId: string,
    gatewayName: string,
    serviceList: string[]
}

export interface IDestroyStandaloneGateway {
    envId: string,
    gatewayName: string
}

export interface IPublishVersionParams {
    envId: string
    functionName: string
    description?: string
}
export interface IListFunctionVersionParams {
    envId: string
    functionName: string
    offset?: number
    limit?: number
    order?: string
    orderBy?: string
}

export interface IFunctionVersion {
    Version: string
    Description: string
    AddTime: string
    ModTime: string
    Status: string //
}

export interface IFunctionVersionsRes {
    FunctionVersion: string[]
    Versions: IFunctionVersion[]
    TotalCount: number
}

export interface ISetProvisionedConcurrencyConfig {
    envId: string
    functionName: string
    qualifier: string
    versionProvisionedConcurrencyNum: number
}

export interface IGetProvisionedConcurrencyConfig {
    functionName: string
    qualifier?: string
    envId: string
}

export interface IGetProvisionedConcurrencyRes {
    UnallocatedConcurrencyNum: number
    Allocated: IVersionProvisionedConcurrencyInfo[]
}

export interface IVersionProvisionedConcurrencyInfo {
    AllocatedProvisionedConcurrencyNum: number // 设置的预置并发数。
    AvailableProvisionedConcurrencyNum: number // 当前已完成预置的并发数。
    Status: string // 预置任务状态，Done表示已完成，InProgress表示进行中，Failed表示部分或全部失败。
    StatusReason: string // 对预置任务状态Status的说明。
    Qualifier: string // 版本号
}

export interface IUpdateFunctionAliasConfig {
    envId: string
    functionName: string // 函数名
    name: string // 函数别名 如$DEFAULT
    functionVersion: string // 函数版本
    description?: string // 别名描述
    routingConfig?: IRoutingConfig
}

export interface IRoutingConfig {
    AdditionalVersionWeights?: IVersionWeight[]
    AddtionVersionMatchs?: IVersionMatch[]
}

export interface IVersionMatch {
    Version: string // 函数版本名称
    Key: string // 匹配规则的key，调用时通过传key来匹配规则路由到指定版本 header方式：key填写"invoke.headers.User"，并在 invoke 调用函数时传参 RoutingKey：{"User":"value"}规则匹配调用
    Method: string // 匹配方式。取值范围：range：范围匹配 exact：字符串精确匹配
    Expression: string //
}

export interface IVersionWeight {
    Version: string
    Weight: number
}

export interface IGetFunctionAlias {
    envId: string
    functionName: string // 函数名称
    name: string // 别名
}

export interface IGetFunctionAliasRes {
    FunctionVersion: string
    Name: string
    RoutingConfig: IRoutingConfig
    Description: string
    AddTime: string
    ModTime: string
}

export interface ITcbrServerBaseConfig {
    EnvId: string,
    ServerName: string,
    OpenAccessTypes: string[],
    Cpu: number,
    Mem: number,
    MinNum: number,
    MaxNum: number,
    PolicyDetails: {
        PolicyType: string,
        PolicyThreshold: number
    }[],
    CustomLogs: string,
    EnvParams: string,
    InitialDelaySeconds: number,
    CreateTime: string,
    Port: number,
    HasDockerfile: boolean,
    Dockerfile: string,
    BuildDir: string,
}

export interface IDescribeCloudRunServerDetail {
    BaseInfo: {
        ServerName: string,
        DefaultDomainName: string,
        CustomDomainName: string,
        Status: 'running' | 'deploying' | 'deploy_failed',
        UpdateTime: string,
    },
    ServerConfig: ITcbrServerBaseConfig,
    RequestId: string
}

export const enum TCBR_LOG_TYPE {
    NONE = 'none'
}

export interface ITcbrServiceOptions {
    noConfirm: boolean,
    override: boolean,
    defaultOverride: boolean,
    envId: string,
    serviceName: string,
    path: string,
    cpu: number,
    mem: number,
    minNum: number,
    maxNum: number,
    policyDetails: string,
    customLogs: string,
    envParams: string,
    containerPort: number,
    remark: string,
    targetDir: string,
    dockerfile: string,
    image: string,
    custom_image: string,
    library_image: string,
    log_type: TCBR_LOG_TYPE,
    json: boolean
}

export interface ICloudRunProcessLog {
    EnvId: string,
    RunId: string
}

export interface ICloudRunBuildLog {
    EnvId: string,
    ServerName: string,
    ServerVersion: string,
    BuildId: number,
    Offset: number
}

export interface IDescribeWxCloudBaseRunReleaseOrder {
    envId: string,
    serviceName: string
}

export interface IGetLogs {
    envId: string,
    taskId: number,
    serviceName: string,
}

export interface ITcbrServiceConfigOptions {
    serviceName: string,
    envId: string,
    cpu: number,
    mem: number,
    minNum: number,
    maxNum: number,
    policyDetails: string,
    customLogs: string,
    envParams: string,
}

export interface IServerInfo {
    ServerName: string,
    DefaultDomainName: string,
    CustomDomainName: string,
    Status: string,
    UpdateTime: string,
    CreatedTime: string,
}

export interface ITcbrServiceRequiredOptions {
    envId: string,
    serviceName: string,
    containerPort: number,
    isCreated: boolean,
    path: string,
    custom_image: string,
    library_image: string,
    image: string
}

export interface ITcbrServiceOptionalOptions {
    cpu: number | string,
    mem: number | string,
    maxNum: number | string,
    minNum: number | string
}

export interface ITcbrServiceConvertedOptionalOptions {
    cpuConverted: number,
    memConverted: number,
    maxNumConverted: number,
    minNumConverted: number
}

export interface IAuthorizedTcrInstance {
    Id: string,
    Name: string,
    Domain: string
}

export enum DEPLOY_TYPE {
    PACKAGE = 'package',
    IMAGE = 'image'
}