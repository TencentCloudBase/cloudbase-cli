import { Command } from '../common';
import { Logger } from '../../decorators';
export declare class NewCommand extends Command {
    get options(): {
        cmd: string;
        options: any[];
        desc: string;
        requiredEnvId: boolean;
        withoutAuth: boolean;
    };
    execute(ctx: any, log?: Logger): Promise<void>;
    checkLogin(log?: Logger): Promise<void>;
    checkEnvStatus(envId: string): Promise<void>;
    checkEnvAvaliable(envId: string): Promise<void>;
    checkTcbService(log?: Logger): Promise<boolean>;
    waitForServiceEnable(): Promise<unknown>;
    extractTemplate(projectPath: string, templatePath: string, remoteUrl?: string): Promise<void>;
    initSuccessOutput(appName: string, log?: Logger): void;
}
export declare function isGitUrl(url: string): boolean;
