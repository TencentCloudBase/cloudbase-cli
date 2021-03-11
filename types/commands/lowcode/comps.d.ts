import { Command } from '../common';
import { Logger } from '../../decorators';
export declare class LowCodeCreateComps extends Command {
    get options(): {
        cmd: string;
        childCmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
        requiredEnvId: boolean;
    };
    execute(params: any, log?: Logger): Promise<void>;
}
export declare class LowCodeBuildComps extends Command {
    get options(): {
        cmd: string;
        childCmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
        requiredEnvId: boolean;
    };
    execute(ctx: any, log: any): Promise<void>;
}
export declare class LowCodeDebugComps extends Command {
    get options(): {
        cmd: string;
        childCmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
        requiredEnvId: boolean;
    };
    execute(ctx: any, options: any, log: any): Promise<void>;
}
export declare class LowCodePublishComps extends Command {
    get options(): {
        cmd: string;
        childCmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
        requiredEnvId: boolean;
    };
    execute(ctx: any, log?: Logger): Promise<void>;
}
