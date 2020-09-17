import arg from 'arg';
import { AuthSupevisor, ICloudBaseConfig } from '@cloudbase/toolbox';
export interface IArgs extends arg.Spec {
    '--config-path': string;
    '--envId': string;
    '-e': string;
}
export declare const getArgs: () => arg.Result<IArgs>;
export declare const getCloudBaseConfig: (configPath?: string) => Promise<ICloudBaseConfig>;
export declare const authSupevisor: AuthSupevisor;
export declare function getLoginState(): Promise<import("@cloudbase/toolbox").Credential>;
