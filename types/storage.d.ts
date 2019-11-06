export declare function uploadFile(options: any): Promise<void>;
export declare function uploadDirectory(options: any): Promise<void>;
export declare function downloadFile(options: any): Promise<void>;
export declare function downloadDirectory(options: any): Promise<void>;
export declare function deleteFile(options: any): Promise<void>;
export declare function deleteDirectory(options: any): Promise<void>;
export declare function list(options: any): Promise<import("@cloudbase/manager-node/types/interfaces").IListFileInfo[]>;
export declare function getUrl(options: any): Promise<{
    fileId: string;
    url: string;
}[]>;
export declare function detail(options: any): Promise<import("@cloudbase/manager-node/types/interfaces").IFileInfo>;
export declare function getAcl(options: any): Promise<"READONLY" | "PRIVATE" | "ADMINWRITE" | "ADMINONLY">;
export declare function setAcl(options: any): Promise<import("@cloudbase/manager-node/types/interfaces").IResponseInfo>;
