declare class Loading {
    private spinner;
    constructor();
    set text(text: string);
    start(text: string): void;
    stop(): void;
    succeed(text: string): void;
    fail(text: string): void;
}
export declare const loadingFactory: () => Loading;
declare type Task<T> = (flush: (text: string) => void, ...args: any[]) => Promise<T>;
export interface ILoadingOptions {
    startTip?: string;
    successTip?: string;
    failTip?: string;
}
export declare const execWithLoading: <T>(task: Task<T>, options?: ILoadingOptions) => Promise<T>;
export {};
