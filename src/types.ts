import { CloudBaseError } from './error'

/* eslint-disable */
declare global {
    namespace NodeJS {
        interface Process {
            IS_DEBUG: boolean
        }
    }
}
/* eslint-enable */

export type TExportFunctionVoid = () => Promise<void | CloudBaseError>

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

export interface SSH {
    host: string
    port: string
    username: string
    password: string
}

export interface IConfig {
    credential?: Credential
    ssh?: SSH
}

export interface CloudBaseConfig {
    envId?: string
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
    l5?: boolean
    installDependency: boolean
}

export interface ICloudFunctionTrigger {
    name: string
    type: string
    config: string
}

export interface ICloudFunction {
    name: string
    config: ICloudFunctionConfig
    triggers?: ICloudFunctionTrigger[]
    params?: Record<string, string>
    handler?: string
    ignore?: string | string[]
}

export interface ICreateFunctionOptions {
    func?: ICloudFunction
    functions?: ICloudFunction[]
    functionRootPath?: string
    envId: string
    force?: boolean
    base64Code?: string
    log?: boolean
    codeSecret?: string
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
    // 浏览器登录打开的链接
    authUrl?: string
}

export interface FunctionContext {
    // 函数名称
    name: string
    // 环境 id
    envId: string
    // 整体配置
    config: CloudBaseConfig
    // 配置文件中所有的函数
    functions?: ICloudFunction[]
}
