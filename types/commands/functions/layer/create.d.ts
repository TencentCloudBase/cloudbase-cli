import { Command } from '../../common';
export declare class CreateFileLayer extends Command {
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
    execute(envId: any, options: any, params: any): Promise<void>;
}
