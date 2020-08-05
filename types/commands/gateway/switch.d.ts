import { Command } from '../common';
export declare class ServiceSwitchCommand extends Command {
    get options(): {
        cmd: string;
        childCmd: string;
        deprecateCmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
    };
    execute(envId: any): Promise<void>;
}
export declare class ServiceAuthSwitch extends Command {
    get options(): {
        cmd: string;
        childCmd: {
            cmd: string;
            desc: string;
        };
        childSubCmd: string;
        deprecateCmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
    };
    execute(envId: any): Promise<void>;
}
