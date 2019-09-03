interface Options {
    exit?: number;
    original?: Error | undefined;
    code?: string | number;
    requestId?: string;
}
export declare class TcbError extends Error {
    readonly exit: number;
    readonly message: string;
    readonly name = "TcbError";
    readonly original: Error | undefined;
    readonly code: string | number;
    readonly requestId: string;
    constructor(message: string, options?: Options);
}
export {};
