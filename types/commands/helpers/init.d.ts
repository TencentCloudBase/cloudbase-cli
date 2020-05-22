import { Command } from '../common';
import { Logger } from '../../decorators';
export declare class InitCommand extends Command {
    get options(): {
        cmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
        requiredEnvId: boolean;
    };
    execute(options: any, log?: Logger): Promise<void>;
    checkLogin(log?: Logger): Promise<void>;
    checkEnvStatus(envId: string): Promise<void>;
    checkEnvAvaliable(envId: string): Promise<void>;
    checkTcbService(log?: Logger): Promise<boolean>;
    waitForServiceEnable(): Promise<unknown>;
    extractTemplate(projectPath: string, templatePath: string, remoteUrl?: string): Promise<void>;
    copyServerTemplate(projectPath: string): Promise<void>;
    initSuccessOutput(projectName: any, log?: Logger): void;
}
