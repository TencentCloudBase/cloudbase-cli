import { Command } from '../common';
import { Logger } from '../../decorators';
export declare class ListLoginCommand extends Command {
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
export declare class CreateLoginCommand extends Command {
    get options(): {
        cmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
    };
    execute(envId: any, log: Logger): Promise<void>;
}
export declare class UpdateLogin extends Command {
    get options(): {
        cmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
    };
    execute(envId: any, log: Logger): Promise<void>;
}
