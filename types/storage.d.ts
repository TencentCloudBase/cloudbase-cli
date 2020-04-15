interface IStorageOptions {
    envId: string;
    localPath: string;
    cloudPath: string;
}
interface IStorageCloudOptions {
    envId: string;
    cloudPath: string;
    cloudPaths?: string[];
}
export declare function uploadFile(options: IStorageOptions): Promise<void>;
export declare function uploadDirectory(options: IStorageOptions): Promise<void>;
export declare function downloadFile(options: IStorageOptions): Promise<void>;
export declare function downloadDirectory(options: IStorageOptions): Promise<void>;
export declare function deleteFile(options: IStorageCloudOptions): Promise<void>;
export declare function deleteDirectory(options: IStorageCloudOptions): Promise<{
    Deleted: {
        Key: string;
    }[];
    Error: Object[];
}>;
export declare function list(options: IStorageCloudOptions): Promise<import("@cloudbase/manager-node/types/interfaces").IListFileInfo[]>;
export declare function getUrl(options: IStorageCloudOptions): Promise<{
    fileId: string;
    url: string;
}[]>;
export declare function detail(options: IStorageCloudOptions): Promise<import("@cloudbase/manager-node/types/interfaces").IFileInfo>;
export declare function getAcl(options: any): Promise<"READONLY" | "PRIVATE" | "ADMINWRITE" | "ADMINONLY">;
export declare function setAcl(options: any): Promise<import("@cloudbase/manager-node/types/interfaces").IResponseInfo>;
export {};
