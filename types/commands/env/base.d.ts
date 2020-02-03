import { ICommandContext } from '../command';
export declare function list(): Promise<void>;
export declare function rename(ctx: ICommandContext, name: string): Promise<void>;
