import { Command } from '../common';
import { Logger } from '../../decorators';
export declare class BindCustomDomainCommand extends Command {
    get options(): {
        cmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
    };
    execute(envId: any, params: any): Promise<void>;
}
export declare class GetCustomDomainsCommand extends Command {
    get options(): {
        cmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
    };
    execute(envId: any, options: any, log: Logger): Promise<void>;
}
export declare class UnbindCustomDomainCommand extends Command {
    get options(): {
        cmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
    };
    execute(envId: any, params: any): Promise<void>;
}
