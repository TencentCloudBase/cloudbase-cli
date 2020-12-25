import { Command } from '../common';
import { Logger } from '../../decorators';
export declare class LowCodeWatch extends Command {
    get options(): {
        cmd: string;
        childCmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
        requiredEnvId: boolean;
    };
    execute(ctx: any, log?: Logger): Promise<void>;
}
