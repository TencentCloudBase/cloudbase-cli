import { Command } from '../common';
export declare class CreateCommand extends Command {
    get options(): {
        cmd: string;
        childCmd: string;
        deprecateCmd: string;
        options: any[];
        desc: string;
        requiredEnvId: boolean;
    };
    execute(params: any): Promise<void>;
}
