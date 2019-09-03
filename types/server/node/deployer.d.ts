import { default as NodeZipBuilder, INodeZipBuilderConfig } from './builder';
import { NodeUploaderConfig } from './uploader';
import { SSH, AuthSecret, ServerConfig } from '../../types';
export declare class NodeDeployer {
    config: INodeDeployConfig;
    builder: NodeZipBuilder;
    uploader: {
        upload(): Promise<any>;
    };
    constructor(config: INodeDeployConfig);
    deploy(): Promise<import("./builder").IBuildResult>;
}
export interface INodeDeployConfig extends SSH, AuthSecret {
    path: ServerConfig['path'];
    distPath: INodeZipBuilderConfig['distPath'];
    remotePath: NodeUploaderConfig['remotePath'];
}
