export * from './domain';
export * from './login';
export declare function initTcb(skey: string): Promise<any>;
export declare function createEnv({ alias, paymentMode }: {
    alias: any;
    paymentMode: any;
}): Promise<{
    envId: string;
}>;
export declare function getEnvInfo(envId: string): Promise<any>;
export declare function listEnvs(options?: {
    source?: string[];
}): Promise<any[]>;
export declare function updateEnvInfo({ envId, alias }: {
    envId: any;
    alias: any;
}): Promise<void>;
export declare function getEnvLimit(source?: string): Promise<any>;
