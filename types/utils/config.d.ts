import arg from 'arg';
import { ICloudBaseConfig } from '@cloudbase/toolbox';
export interface IArgs extends arg.Spec {
    '--config-path': string;
    '--envId': string;
    '-e': string;
    '--region': string;
    '-r': string;
}
export declare const getArgs: () => arg.Result<IArgs>;
export declare const getCloudBaseConfig: (configPath?: string) => Promise<ICloudBaseConfig>;
