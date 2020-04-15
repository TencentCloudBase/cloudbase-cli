export declare class ConfigItems {
    static credentail: string;
    static ssh: string;
}
export declare const DefaultFunctionDeployConfig: {
    timeout: number;
    runtime: string;
    handler: string;
    installDependency: boolean;
    ignore: string[];
};
export declare const DefaultCloudBaseConfig: {
    functionRoot: string;
    functions: any[];
};
export declare const REQUEST_TIMEOUT = 30000;
export declare const ALL_COMMANDS: string[];
