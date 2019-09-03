import { INodeDeployConfig, NodeDeployer } from './deployer';
import { ServerConfig } from '../../types';
export declare class NodeController {
    ssh: any;
    config: NodeControllerConfig;
    deployer: NodeDeployer;
    constructor(config: NodeControllerConfig);
    connect(): Promise<void>;
    deploy(): Promise<void>;
    start({ vemo }: {
        vemo: any;
    }): Promise<void>;
    installDependencies(): Promise<void>;
    injectSecret(): string;
    logs({ lines }: {
        lines: any;
    }): Promise<void>;
    reload(): Promise<void>;
    delete(): Promise<void>;
    show(): Promise<void>;
}
export interface NodeControllerConfig extends Omit<INodeDeployConfig, 'username' | 'port' | 'remotePath' | 'distPath' | 'path'> {
    envId?: string;
    name?: ServerConfig['name'];
    path?: ServerConfig['path'];
    username?: INodeDeployConfig['username'];
    port?: INodeDeployConfig['port'];
    remotePath?: INodeDeployConfig['remotePath'];
    disPath?: INodeDeployConfig['distPath'];
}
