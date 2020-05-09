import { Command } from '../common';
import { Logger } from '../../decorators';
export declare class ListServiceCommand extends Command {
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
