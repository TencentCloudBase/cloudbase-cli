export interface ILayerListOptions {
    offset: number;
    limit: number;
}
export interface IVersionListOptions {
    name: string;
}
export declare function listLayers(options: ILayerListOptions): Promise<any>;
export declare function listLayerVersions(options: IVersionListOptions): Promise<any>;
