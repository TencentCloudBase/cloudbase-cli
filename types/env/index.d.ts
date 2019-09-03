export * from './domain';
export * from './login';
export declare function initTcb(skey: string): Promise<any>;
export declare function createEnv({ alias }: {
    alias: any;
}): Promise<any>;
export declare function getEnvInfo(envId: string): Promise<any>;
export declare function listEnvs(): Promise<any>;
export declare function updateEnvInfo({ envId, alias }: {
    envId: any;
    alias: any;
}): Promise<void>;
