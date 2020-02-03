import { ICommandContext } from '../command';
export declare function bindCustomDomain(ctx: ICommandContext, domain: string): Promise<void>;
export declare function getCustomDomain(ctx: ICommandContext): Promise<void>;
export declare function unbindCustomDomain(ctx: ICommandContext, domain: string): Promise<void>;
