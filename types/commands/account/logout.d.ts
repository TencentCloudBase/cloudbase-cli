import { Command } from '../common';
import { Logger } from '../../decorators';
export declare class LogoutCommand extends Command {
    get options(): {
        cmd: string;
        options: any[];
        desc: string;
        requiredEnvId: boolean;
    };
    execute(log: Logger): Promise<void>;
}
