import { Command } from '../common';
import { Logger } from '../../decorators';
export declare class EnvListCommand extends Command {
    get options(): {
        cmd: string;
        options: any[];
        desc: string;
        requiredEnvId: boolean;
    };
    execute(log: Logger): Promise<void>;
}
export declare class EnvRenameCommand extends Command {
    get options(): {
        cmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
        requiredEnvId: boolean;
    };
    execute(envId: any, params: any, log: Logger): Promise<void>;
}
