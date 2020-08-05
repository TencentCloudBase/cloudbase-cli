import { Command } from '../common';
import { Logger } from '../../decorators';
export declare class ConfigUpdate extends Command {
    get options(): {
        cmd: string;
        childCmd: {
            cmd: string;
            desc: string;
        };
        childSubCmd: string;
        deprecateCmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
    };
    execute(ctx: any, params: any, log: Logger): Promise<void>;
}
