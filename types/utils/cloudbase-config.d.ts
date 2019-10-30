import { IConfig, CloudBaseConfig } from '../types';
export declare function getCloudBaseConfig(): Promise<IConfig>;
export declare function resolveCloudBaseConfig(configPath?: string): Promise<CloudBaseConfig>;
export declare function getEnvId(envId?: string, configPath?: string): Promise<string>;
