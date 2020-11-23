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
    getSelectedEnv(inputEnvId: string, log?: Logger): Promise<any>;
    checkLogin(log?: Logger): Promise<void>;
    checkEnvStatus(envId: string): Promise<void>;
    checkEnvAvaliable(envId: string): Promise<void>;
    checkTcbService(log?: Logger): Promise<boolean>;
    waitForServiceEnable(): Promise<void>;
    extractTemplate(projectPath: string, templatePath: string, remoteUrl?: string): Promise<void>;
    initSuccessOutput(appName: string, log?: Logger): void;
}
export declare function isGitUrl(url: string): boolean;
