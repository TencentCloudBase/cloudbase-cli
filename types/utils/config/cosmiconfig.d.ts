export declare function loadConfig(options?: {
    moduleName?: string;
    configPath?: string;
}): Promise<any>;
export declare function searchConfig(dest: string): Promise<{
    config: any;
    filepath: string;
    isEmpty?: boolean;
}>;
