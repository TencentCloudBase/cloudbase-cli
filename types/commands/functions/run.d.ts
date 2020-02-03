import { ICommandContext } from '../command';
export declare function debugFunctionByPath(functionPath: string, options: Record<string, any>): Promise<void>;
export declare function debugByConfig(ctx: ICommandContext, name: string): Promise<void>;
