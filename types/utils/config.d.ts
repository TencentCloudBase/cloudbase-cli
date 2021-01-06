import { Arguments } from 'yargs';
import { ICloudBaseConfig } from '@cloudbase/toolbox';
export interface IArgs {
    envId: string;
    region: string;
    verbose: boolean;
    configPath: string;
    [x: string]: unknown;
}
export declare const getArgs: () => Arguments<IArgs>;
export declare const getCloudBaseConfig: (configPath?: string) => Promise<ICloudBaseConfig>;
