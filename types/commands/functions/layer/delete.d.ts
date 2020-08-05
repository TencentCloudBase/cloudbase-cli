import { Command } from '../../common';
export declare class DeleteFileLayer extends Command {
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
    execute(envId: any): Promise<void>;
}
