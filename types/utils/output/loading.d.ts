declare class Loading {
    private spinner;
    constructor();
    start(text: string): void;
    stop(): void;
    succeed(text: string): void;
    fail(text: string): void;
}
export declare const loadingFactory: () => Loading;
export {};
