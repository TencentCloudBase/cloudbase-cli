import { Command } from '../common';
import { Logger } from '../../decorators';
export declare class FunctionCopy extends Command {
    get options(): {
        cmd: string;
        childCmd: string;
        deprecateCmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
    };
    execute(envId: any, options: any, params: any, log: Logger): Promise<void>;
}
