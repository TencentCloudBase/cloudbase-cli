import { Command } from '../common';
import { ICommandContext } from '../../types';
import { Logger } from '../../decorators';
export declare class FramworkDeploy extends Command {
    get options(): {
        cmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
    };
    execute(ctx: ICommandContext, logger: Logger, params: any): Promise<void>;
}
export declare class FramworkCompile extends Command {
    get options(): {
        cmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
    };
    execute(ctx: ICommandContext, logger: Logger, params: any): Promise<void>;
}
