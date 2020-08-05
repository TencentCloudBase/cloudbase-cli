import { Command } from '../../common';
import { Logger } from '../../../decorators';
export declare class ListFileLayer extends Command {
    get options(): {
        deprecateCmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
        cmd: string;
        childCmd: {
            cmd: string;
            desc: string;
        };
        childSubCmd: string;
    };
    execute(envId: any, options: any, log: Logger): Promise<void>;
}
