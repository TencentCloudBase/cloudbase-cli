import { IListFunctionOptions, IFunctionLogOptions, IUpdateFunctionConfigOptions, IFunctionBatchOptions, InvokeFunctionOptions } from '../types';
export interface IBaseOptions {
    envId: string;
    functionName: string;
}
export interface ICopyFunctionOptions {
    envId: string;
    functionName: string;
    newFunctionName: string;
    targetEnvId: string;
    force?: boolean;
    copyConfig?: boolean;
    codeSecret?: string;
}
export interface IDetailOptions extends IBaseOptions {
    codeSecret?: string;
}
export declare function getFunctionService(envId: string): Promise<import("@cloudbase/manager-node/types/function").FunctionService>;
export declare function listFunction(options: IListFunctionOptions): Promise<Record<string, string>[]>;
export declare function getFunctionDetail(options: IDetailOptions): Promise<Record<string, any>>;
export declare function batchGetFunctionsDetail({ names, envId, codeSecret }: {
    names: any;
    envId: any;
    codeSecret: any;
}): Promise<Record<string, string>[]>;
export declare function getFunctionLog(options: IFunctionLogOptions): Promise<Record<string, string>[]>;
export declare function updateFunctionConfig(options: IUpdateFunctionConfigOptions): Promise<void>;
export declare function batchUpdateFunctionConfig(options: IFunctionBatchOptions): Promise<void>;
export declare function invokeFunction(options: InvokeFunctionOptions): Promise<any>;
export declare function batchInvokeFunctions(options: IFunctionBatchOptions): Promise<any[]>;
export declare function copyFunction(options: ICopyFunctionOptions): Promise<void>;
