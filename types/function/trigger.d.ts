import { IFunctionTriggerOptions, IFunctionBatchOptions } from '../types';
export declare function createFunctionTriggers(options: IFunctionTriggerOptions): Promise<void>;
export declare function batchCreateTriggers(options: IFunctionBatchOptions): Promise<void>;
export declare function deleteFunctionTrigger(options: IFunctionTriggerOptions): Promise<void>;
export declare function batchDeleteTriggers(options: IFunctionBatchOptions): Promise<void>;
