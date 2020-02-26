export interface IAttachOptions {
    envId: string;
    layerName: string;
    layerVersion: number;
    functionName: string;
    codeSecret?: string;
}
export declare function attachLayer(options: IAttachOptions): Promise<void>;
export declare function unAttachLayer(options: IAttachOptions): Promise<void>;
