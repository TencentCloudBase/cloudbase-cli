interface Options {
    exit?: number;
    original?: Error | undefined;
    code?: string | number;
    requestId?: string;
    action?: string;
    meta?: Record<string, any>;
}
export declare class CloudBaseError extends Error {
    readonly exit: number;
    readonly message: string;
    readonly name = "CloudBaseError";
    readonly original: Error | undefined;
    readonly code: string | number;
    readonly requestId: string;
    readonly action: string;
    readonly meta: any;
    constructor(message: string, options?: Options);
}
export {};
