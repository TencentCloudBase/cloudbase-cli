export interface ILayerDeleteOptions {
    name: string;
    version: number;
}
export declare function deleteLayer(options: ILayerDeleteOptions): Promise<void>;
