import { IDescribeRunVersion, IUpdateVersion } from '../../types';
export declare const updateVersion: (options: IUpdateVersion) => Promise<{
    Result: any;
    RunId: any;
}>;
export declare const describeRunVersion: (options: IDescribeRunVersion) => Promise<any>;
