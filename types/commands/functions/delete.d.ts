import { Command } from '../common';
export declare class DeleteFunction extends Command {
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
    execute(ctx: any, params: any): Promise<void>;
}
