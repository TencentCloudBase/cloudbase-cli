import { Command } from '../common';
export declare class DeleteThirdAttach extends Command {
    get options(): {
        cmd: string;
        childCmd: string;
        deprecateCmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
        requiredEnvId: boolean;
    };
    execute(options: any): Promise<void>;
}
