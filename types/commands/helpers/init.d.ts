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
    execute(options: any, logger?: Logger): Promise<void>;
    extractTemplate(projectPath: string, templatePath: string, remoteUrl?: string): Promise<void>;
    copyServerTemplate(projectPath: string): Promise<void>;
    initSuccessOutput(projectName: any, log?: Logger): void;
}
