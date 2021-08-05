import { Command } from '../../common';
export declare class TurnStandalonegateway extends Command {
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
    execute(envId: any, params: any, options: any): Promise<void>;
}
