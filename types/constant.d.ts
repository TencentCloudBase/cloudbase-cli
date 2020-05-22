export declare class ConfigItems {
    static credential: string;
    static ssh: string;
}
export declare const DefaultFunctionDeployConfig: {
    timeout: number;
    handler: string;
    runtime: string;
    installDependency: boolean;
    ignore: string[];
};
export declare const DefaultCloudBaseConfig: {
    functionRoot: string;
    functions: any[];
};
export declare const REQUEST_TIMEOUT = 30000;
export declare const enum ENV_STATUS {
    UNAVAILABLE = "UNAVAILABLE",
    NORMAL = "NORMAL",
    ISOLATE = "ISOLATE",
    ABNORMAL = "ABNORMAL",
    ERROR = "ERROR"
}
export declare const STATUS_TEXT: {
    UNAVAILABLE: string;
    NORMAL: string;
    ISOLATE: string;
    ABNORMAL: string;
    ERROR: string;
};
export declare const ALL_COMMANDS: string[];
