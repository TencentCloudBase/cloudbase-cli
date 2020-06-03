import { Command } from '../common';
import { CloudBaseError } from '../../error';
import { Logger } from '../../decorators';
import { ICreateFunctionOptions } from '../../types';
export declare class FunctionDeploy extends Command {
    get options(): {
        cmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
    };
    execute(ctx: any, params: any, log: Logger): Promise<void>;
    deployAllFunction(options: any): Promise<void>;
    handleDeployFail(e: CloudBaseError, options: ICreateFunctionOptions): Promise<void>;
    printSuccessTips(envId: string, log?: Logger): void;
    genApiGateway(envId: string, name: string): Promise<void>;
}
