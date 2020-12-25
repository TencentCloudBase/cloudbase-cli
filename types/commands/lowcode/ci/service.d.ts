import { FSWatcher } from 'chokidar';
import { Context } from 'koa';
interface IBuildParams {
    appId: string;
    buildTypeList: string[];
    generateMpType?: 'app' | 'subpackage';
    deployOptions: {
        mode: 'preview' | 'upload';
        version: string;
        description: string;
        appHistoryId?: number;
    };
    plugins: any[];
    mainAppSerializeData: string;
    subAppSerializeDataStrList: any[];
    dependencies: any[];
    envId: string;
    datasources: any;
}
declare type DistType = 'web' | 'qrcode' | 'dist';
interface ICheckStatusParams {
    buildId: string;
    distType: DistType[];
    appId: string;
}
interface IDeployHistoryParams {
    appId: string;
    pageSize?: number;
    pageIndex?: number;
}
interface IDeployDetailParams {
    appId: string;
    idx: string;
}
export declare const DEFAULT_RC_CONTENT: {
    version: string;
    envId: string;
    $schema: string;
    framework: {
        name: string;
        plugins: {
            lowcode: {
                use: string;
                inputs: {
                    debug: boolean;
                };
            };
        };
    };
};
export declare class Builder {
    protected _workspace: string;
    constructor(workspace: any);
    build(ctx: Context, params: IBuildParams): Promise<{
        buildId: string;
    }>;
    _writeFiles(appId: any, buildId: any, contents: any): Promise<void>;
    checkStatusInLocal(ctx: Context, params: ICheckStatusParams): Promise<{
        status: any;
    }>;
    _getAllDist(params: ICheckStatusParams, inputs: IBuildParams): Promise<{}>;
    deployHistory(ctx: Context, params: IDeployHistoryParams): Promise<{
        count: number;
        rows: {
            appId: string;
            idx: string;
            ciId: string;
            createdAt: string;
            status: any;
            preview: Partial<{
                status: any;
            }> | Partial<{
                status: string;
            }>;
        }[];
    }>;
    deployDetail(ctx: Context, params: IDeployDetailParams): Promise<{
        appId: string;
        idx: string;
        ciId: string;
        createdAt: string;
        status: any;
        preview: Partial<{
            status: any;
        }>;
    }>;
}
export declare class Watcher {
    protected _workspace: string;
    protected _watcher?: FSWatcher;
    constructor(workspace: any);
    start(): void;
    _callFramework(projectPath: any, command?: string): Promise<unknown>;
    _setStatus(path: any, status: any): void;
    _clean(path: any): void;
    end(): void;
}
export {};
