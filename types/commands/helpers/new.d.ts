import { Command } from '../common';
import { Logger } from '../../decorators';
export declare class NewCommand extends Command {
    get options(): {
        cmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
        requiredEnvId: boolean;
        withoutAuth: boolean;
    };
    execute(ctx: any, log?: Logger): Promise<void>;
    initSuccessOutput(appName: string, log?: Logger): void;
}
export declare function isGitUrl(url: string): boolean;
