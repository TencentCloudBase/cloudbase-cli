import { Command } from '../../common';
export declare class UpdateVersion extends Command {
    get options(): {
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
    execute(envId: any, options: any): Promise<void>;
}
