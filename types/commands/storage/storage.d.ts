import { ICommandContext } from '../command';
export declare function upload(ctx: ICommandContext, localPath?: string, cloudPath?: string): Promise<void>;
export declare function download(ctx: ICommandContext, cloudPath: string, localPath: string): Promise<void>;
export declare function deleteFile(ctx: ICommandContext, cloudPath: string): Promise<void>;
export declare function list(ctx: ICommandContext, cloudPath?: string): Promise<void>;
export declare function getUrl(ctx: ICommandContext, cloudPath: string): Promise<void>;
export declare function detail(ctx: ICommandContext, cloudPath: string): Promise<void>;
export declare function getAcl(ctx: ICommandContext): Promise<void>;
export declare function setAcl(ctx: ICommandContext): Promise<void>;
