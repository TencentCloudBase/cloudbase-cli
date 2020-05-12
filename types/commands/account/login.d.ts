import { Command } from '../common';
import { Logger } from '../../decorators';
export declare class LoginCommand extends Command {
    get options(): {
        cmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
        requiredEnvId: boolean;
    };
    execute(options: any, log: Logger): Promise<void>;
}
