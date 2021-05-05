import { ICreateVersion, ILogCreateVersion } from '../../types';
export declare const createVersion: (options: ICreateVersion) => Promise<{
    Result: any;
    RunId: any;
}>;
export declare const logCreate: (options: ILogCreateVersion) => Promise<any>;
export declare const basicOperate: (options: ILogCreateVersion) => Promise<{
    Percent: any;
    Status: any;
}>;
