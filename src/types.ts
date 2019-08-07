import { TcbError } from './error'

export type TExportFunctionVoid = () => Promise<void | TcbError>

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

export interface Credential extends PermanentCredential, TmpCredential {
    [key: string]: string
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

export interface IGetCredential {
    secretId?: string
    secretKey?: string
    token: string
}

/**
 * 函数
 */
export interface IFunctionPackResult {
    success: boolean
    assets: string[]
    vemo?: boolean
}

export interface ICloudFunctionConfig {
    timeout: number
    envVariables: Record<string, string | number | boolean>
}

export enum TriggerType {
    Timer = 'timer'
}

export interface ICloudFunctionTrigger {
    name: string
    type: TriggerType
    config: string
}

export interface ICloudFunction {
    name: string
    config: ICloudFunctionConfig
    triggers: ICloudFunctionTrigger[]
}

export interface ICreateFunctionOptions {
    func?: ICloudFunction
    functions?: ICloudFunction[]
    root?: string
    envId: string
    force?: boolean
    zipFile?: string
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

export interface IFunctionBatchOptions {
    functions: ICloudFunction[]
    envId: string
}

export interface IFunctionTriggerOptions {
    functionName: string
    triggers?: ICloudFunctionTrigger[]
    triggerName?: string
    envId: string
}
