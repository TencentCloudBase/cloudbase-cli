export interface ILayer {
    LayerName: string;
    LayerVersion: number;
}
export interface ISortOptions {
    envId: string;
    functionName: string;
    layers: ILayer[];
}
export declare function sortLayer(options: ISortOptions): Promise<void>;
