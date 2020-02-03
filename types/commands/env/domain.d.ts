import { ICommandContext } from '../command';
export declare function listAuthDoamin(ctx: ICommandContext): Promise<void>;
export declare function createAuthDomain(ctx: ICommandContext, domain: string): Promise<void>;
export declare function deleteAuthDomain(ctx: ICommandContext): Promise<void>;
