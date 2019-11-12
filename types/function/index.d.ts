import { IListFunctionOptions, IFunctionLogOptions, IUpdateFunctionConfigOptions, IFunctionBatchOptions, InvokeFunctionOptions } from '../types';
export * from './create';
export * from './trigger';
export * from './code';
interface ICopyFunctionOptions {
    envId: string;
    functionName: string;
    newFunctionName: string;
    targetEnvId: string;
    force?: boolean;
    copyConfig?: boolean;
    codeSecret?: string;
}
export declare function listFunction(options: IListFunctionOptions): Promise<Record<string, string>[]>;
export declare function deleteFunction({ functionName, envId }: {
    functionName: any;
    envId: any;
}): Promise<void>;
export declare function batchDeleteFunctions({ names, envId }: {
    names: any;
    envId: any;
}): Promise<void>;
export declare function getFunctionDetail(options: any): Promise<Record<string, string>>;
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
