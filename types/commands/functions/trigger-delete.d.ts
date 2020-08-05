import { Command } from '../common';
export declare class DeleteTrigger extends Command {
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
    execute(ctx: any, params: any): Promise<void>;
}
