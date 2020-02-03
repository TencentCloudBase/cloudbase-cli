interface IBaseOptions {
    envId: string;
}
interface IHostingFileOptions extends IBaseOptions {
    filePath: string;
    cloudPath: string;
    isDir: boolean;
    onProgress?: (data: any) => void;
    onFileFinish?: (...args: any[]) => void;
}
interface IHostingCloudOptions extends IBaseOptions {
    cloudPath: string;
    isDir: boolean;
}
export declare function getHostingInfo(options: IBaseOptions): Promise<any>;
export declare function enableHosting(options: IBaseOptions): Promise<{
    code: number;
    requestId: any;
}>;
export declare function hostingList(options: IBaseOptions): Promise<import("@cloudbase/manager-node/types/interfaces").IListFileInfo[]>;
export declare function destroyHosting(options: IBaseOptions): Promise<{
    code: number;
    requestId: any;
}>;
export declare function hostingDeploy(options: IHostingFileOptions): Promise<void>;
export declare function hostingDelete(options: IHostingCloudOptions): Promise<void>;
export declare function walkLocalDir(envId: string, dir: string): Promise<string[]>;
export {};
