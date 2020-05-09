import { Command } from '../common';
import { Logger } from '../../decorators';
export declare class FunctionDetail extends Command {
    get options(): {
        cmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
    };
    execute(ctx: any, params: any): Promise<void>;
    logDetail(info: any, name: any, log?: Logger): void;
}
