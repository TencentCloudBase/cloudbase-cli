/// <reference types="node" />
import { CloudBaseError } from './error';
export declare type CustomEvent = 'logout';
export interface ICommandContext {
    cmd: string;
    envId: string;
    config: ICloudBaseConfig;
    options: any;
    params: string[];
}
declare global {
    namespace NodeJS {
        interface Process extends EventEmitter {
            VERBOSE: boolean;
            CLI_VERSION: string;
            on(event: CustomEvent, listener: BeforeExitListener): any;
            emit(event: CustomEvent, message?: any): any;
        }
    }
}
export declare type TExportFunctionVoid = () => Promise<void | CloudBaseError>;
export interface PermanentCredential {
    secretId?: string;
    secretKey?: string;
}
export interface TmpCredential {
    tmpSecretId?: string;
    tmpSecretKey?: string;
    tmpToken?: string;
    tmpExpired?: string;
    expired?: string;
    authTime?: string;
    refreshToken?: string;
    uin?: string;
    hash?: string;
}
export declare type Credential = TmpCredential & PermanentCredential;
export interface AuthSecret {
    secretId: string;
    secretKey: string;
    token?: string;
}
export interface IConfig {
    credential?: Credential;
}
export interface ICloudBaseConfig {
    envId: string;
    functionRoot?: string;
    functions?: ICloudFunction[];
    servers?: ServerConfig[];
}
export interface IGetCredential {
    secretId?: string;
    secretKey?: string;
    token: string;
}
export declare enum ServerLanguageType {
    node = "node"
}
export interface ServerConfig {
    type: ServerLanguageType.node;
    name: string;
    path: string;
}
export interface IFunctionPackResult {
    success: boolean;
    assets: string[];
    vemo?: boolean;
}
export interface IFunctionVPC {
    subnetId: string;
    vpcId: string;
}
export interface ICloudFunctionConfig {
    timeout?: number;
    envVariables?: Record<string, string | number | boolean>;
    runtime?: string;
    vpc?: IFunctionVPC;
    installDependency?: boolean;
    l5?: boolean;
}
export interface ICloudFunctionTrigger {
    name: string;
    type: string;
    config: string;
}
export interface ICloudFunction {
    name: string;
    config?: ICloudFunctionConfig;
    triggers?: ICloudFunctionTrigger[];
    params?: Record<string, string>;
    handler?: string;
    ignore?: string | string[];
    timeout?: number;
    envVariables?: Record<string, string | number | boolean>;
    runtime?: string;
    vpc?: IFunctionVPC;
    l5?: boolean;
    installDependency?: boolean;
    isWaitInstall?: boolean;
}
export interface ICreateFunctionOptions {
    func?: ICloudFunction;
    functions?: ICloudFunction[];
    functionRootPath?: string;
    envId: string;
    force?: boolean;
    base64Code?: string;
    log?: boolean;
    codeSecret?: string;
    functionPath?: string;
}
export interface IListFunctionOptions {
    limit?: number;
    offset?: number;
    envId: string;
}
export interface IFunctionLogOptions {
    functionName: string;
    envId: string;
    offset?: number;
    limit?: number;
    order?: string;
    orderBy?: string;
    startTime?: string;
    endTime?: string;
    functionRequestI?: string;
}
export interface IUpdateFunctionConfigOptions {
    functionName: string;
    config: ICloudFunctionConfig;
    envId: string;
}
export interface InvokeFunctionOptions {
    functionName: string;
    params?: Record<string, any>;
    envId: string;
}
export interface IFunctionBatchOptions {
    functions: ICloudFunction[];
    envId: string;
    log?: boolean;
}
export interface IFunctionTriggerOptions {
    functionName: string;
    triggers?: ICloudFunctionTrigger[];
    triggerName?: string;
    envId: string;
}
export interface ILoginOptions {
    key?: boolean;
    secretId?: string;
    secretKey?: string;
    getAuthUrl?: (url: string) => string;
}
export interface GatewayContext {
    envId: string;
    config: ICloudBaseConfig;
}
export interface ICreateFunctionGatewayOptions {
    envId: string;
    path: string;
    name: string;
}
export interface IQueryGatewayOptions {
    envId: string;
    domain?: string;
    path?: string;
    gatewayId?: string;
    name?: string;
}
export interface IDeleteGatewayOptions {
    envId: string;
    path?: string;
    gatewayId?: string;
    name?: string;
}
export interface IBindGatewayDomainOptions {
    envId: string;
    domain: string;
}
export interface IQueryGatewayDomainOptions {
    envId: string;
    domain?: string;
}
export interface IUnbindGatewayDomainOptions {
    envId: string;
    domain: string;
}
