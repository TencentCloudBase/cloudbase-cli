export declare function getLoginConfigList({ envId }: {
    envId: any;
}): Promise<any>;
export declare function createLoginConfig({ envId, platform, appId, appSecret, status }: {
    envId: any;
    platform: any;
    appId: any;
    appSecret: any;
    status: any;
}): Promise<void>;
export declare function updateLoginConfig({ configId, envId, status, appId, appSecret }: {
    configId: any;
    envId: any;
    status?: string;
    appId?: string;
    appSecret?: string;
}): Promise<void>;
