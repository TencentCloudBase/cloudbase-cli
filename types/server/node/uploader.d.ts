import { INodeZipBuilderConfig } from './builder';
import { SSH } from '../../types';
export default class NodeUploader {
    ssh: any;
    _options: NodeUploaderConfig;
    constructor(options: NodeUploaderConfig);
    upload(zipFileName?: string): Promise<void>;
}
export interface NodeUploaderConfig extends SSH {
    distPath: INodeZipBuilderConfig['distPath'];
    remotePath: string;
}
