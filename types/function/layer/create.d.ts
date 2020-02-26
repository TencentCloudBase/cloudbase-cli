export interface IFunctionLayerOptions {
    contentPath?: string;
    base64Content?: string;
    layerName: string;
    runtimes: string[];
}
export declare function createLayer(options: IFunctionLayerOptions): Promise<void>;
