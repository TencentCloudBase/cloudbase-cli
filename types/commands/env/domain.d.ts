import { Command } from '../common';
import { Logger } from '../../decorators';
export declare class ListAuthDoaminCommand extends Command {
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
export declare class CreateAuthDomainCommand extends Command {
    get options(): {
        cmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
    };
    execute(params: any, envId: any, log: Logger): Promise<void>;
}
export declare class DeleteAuthDomainCommand extends Command {
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
