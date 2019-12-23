import { CloudBaseConfig } from '../types';
export declare function resolveCloudBaseConfig(configPath?: string): Promise<CloudBaseConfig>;
export declare function getEnvId(envId?: string, configPath?: string): Promise<string>;
