import { Command } from '../../common';
export declare class DeleteFileLayer extends Command {
    get options(): {
        cmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
    };
    execute(envId: any): Promise<void>;
}
