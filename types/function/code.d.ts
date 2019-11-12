interface IFunctionCodeOptions {
    envId: string;
    destPath: string;
    functionName: string;
    codeSecret?: string;
    unzip?: boolean;
}
export declare function downloadFunctionCode(options: IFunctionCodeOptions): Promise<unknown>;
export {};
