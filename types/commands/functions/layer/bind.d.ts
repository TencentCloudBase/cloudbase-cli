import { Command } from '../../common';
export declare class AttachFileLayer extends Command {
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
    execute(envId: any, params: any, options: any): Promise<void>;
}
export declare class UnAttachFileLayer extends Command {
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
    execute(envId: any, params: any, options: any): Promise<void>;
}
