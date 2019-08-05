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

export interface IConfig {
    credential?: Credential
}

export interface IGetCredential {
    secretId?: string
    secretKey?: string
    token: string
}

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