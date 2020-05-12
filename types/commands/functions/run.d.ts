import { Command } from '../common';
import { ICommandContext } from '../../types';
export declare function debugFunctionByPath(functionPath: string, options: Record<string, any>): Promise<void>;
export declare function debugByConfig(ctx: ICommandContext, name: string): Promise<void>;
export declare class FunctionDebug extends Command {
    get options(): {
        cmd: string;
        options: {
            flags: string;
            desc: string;
        }[];
        desc: string;
    };
    execute(ctx: any): Promise<void>;
}
