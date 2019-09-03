export declare enum CodeType {
    File = 0,
    JavaFile = 1
}
export declare class FunctionPacker {
    root: string;
    name: string;
    type: CodeType;
    funcPath: string;
    funcDistPath: string;
    tmpPath: string;
    constructor(root: string, name: string);
    validPath(path: string): void;
    getFileCode(): Promise<string>;
    getJavaFileCode(): string;
    build(type: CodeType): Promise<string>;
    clean(): Promise<void>;
}
