import { Command } from '../../common';
export declare class AttachFileLayer extends Command {
    get options(): {
        cmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
    };
    execute(envId: any, params: any, options: any): Promise<void>;
}
export declare class UnAttachFileLayer extends Command {
    get options(): {
        cmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
    };
    execute(envId: any, params: any, options: any): Promise<void>;
}
