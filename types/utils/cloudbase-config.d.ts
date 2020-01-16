import { CloudBaseConfig } from '../types';
export declare function resolveCloudBaseConfig(configPath?: string): Promise<CloudBaseConfig>;
export declare function getEnvId(commandOptions: any): Promise<string>;
