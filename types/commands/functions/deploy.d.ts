import { Command } from '../common';
import { CloudBaseError } from '../../error';
import { ICreateFunctionOptions } from '../../types';
import { Logger } from '../../decorators';
export declare class FunctionDeploy extends Command {
    get options(): {
        cmd: string;
        childCmd: string;
        deprecateCmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
    };
    execute(ctx: any, params: any, log: Logger): Promise<void>;
    deployAllFunction(options: any): Promise<void>;
    handleDeployFail(e: CloudBaseError, options: ICreateFunctionOptions): Promise<void>;
    printSuccessTips(envId: string, log?: Logger): Promise<void>;
    genApiGateway(envId: string, name: string): Promise<void>;
}
