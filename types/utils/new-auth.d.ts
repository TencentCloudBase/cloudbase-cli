import arg from 'arg';
import { AuthSupevisor } from '@cloudbase/toolbox';
export interface IArgs extends arg.Spec {
    '--config-path': string;
    '--envId': string;
}
export declare const getArgs: () => arg.Result<IArgs>;
export declare const getCloudBaseConfig: (configPath?: string) => Promise<import("@cloudbase/toolbox/lib/types").ICloudBaseConfig>;
export declare const authSupervisor: AuthSupevisor;
export declare function getLoginState(): Promise<import("@cloudbase/toolbox/lib/types").Credential>;