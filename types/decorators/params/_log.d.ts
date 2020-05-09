export declare class Logger {
    c: {
        _times: Map<any, any>;
        log(a: string, ...args: string[]): void;
    };
    debugEnabled: boolean;
    verboseEnabled: boolean;
    constructor(options?: {
        debug?: boolean;
        verbose?: boolean;
    });
    breakLine(): void;
    log(...args: any[]): void;
    info(msg: string): void;
    success(msg: string): void;
    warn(msg: string): void;
    error(msg: string): void;
    debug(...args: any): void;
    genClickableLink(link: string): string;
    printClickableLink(link: string): void;
    time(label: string, fn: Promise<any> | (() => Promise<any>)): Promise<any>;
}
