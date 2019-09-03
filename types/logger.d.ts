export default class Logger {
    private moduleName;
    constructor(moduleName: any);
    genLog(level: string, msg: any): string;
    log(msg: any): void;
    success(msg: any): void;
    error(msg: any): void;
}
export declare function errorLog(msg: string): void;
export declare function successLog(msg: string): void;
export declare function warnLog(msg: string): void;
