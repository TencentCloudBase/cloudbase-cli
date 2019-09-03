import { ServerConfig } from '../../types';
export interface IBuildResult {
    success: boolean;
    assets: string[];
    vemo?: boolean;
}
export default class NodeZipBuilder {
    _options: INodeZipBuilderConfig;
    constructor(options: INodeZipBuilderConfig);
    build(zipFileName?: string): Promise<IBuildResult>;
    clean(): Promise<void>;
}
export interface INodeZipBuilderConfig {
    path: ServerConfig['path'];
    distPath: string;
}
