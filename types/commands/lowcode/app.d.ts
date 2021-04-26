import { Command } from '../common';
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
    execute(ctx: any, options: any): Promise<void>;
}
