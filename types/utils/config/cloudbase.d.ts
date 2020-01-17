import { ICloudBaseConfig } from '../../types';
export declare function resolveCloudBaseConfig(configPath?: string): Promise<ICloudBaseConfig>;
export declare function getEnvId(commandOptions: any): Promise<string>;
