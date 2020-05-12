import { Command } from '../common';
import { Logger } from '../../decorators';
export declare class InvokeFunction extends Command {
    get options(): {
        cmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
    };
    execute(ctx: any, argsParams: any, log: Logger): Promise<any[]>;
}
