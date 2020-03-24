export declare class CloudApiService {
    static serviceCacheMap: Record<string, CloudApiService>;
    static getInstance(service: string): CloudApiService;
    service: string;
    version: string;
    url: string;
    action: string;
    method: 'POST' | 'GET';
    timeout: number;
    data: Record<string, any>;
    payload: Record<string, any>;
    baseParams: Record<string, any>;
    constructor(service: string, baseParams?: Record<string, any>, version?: string);
    get baseUrl(): any;
    request(action: string, data?: Record<string, any>, method?: 'POST' | 'GET'): Promise<any>;
    requestWithSign(): Promise<any>;
    getRequestSign(timestamp: number): string;
    setCredential(secretId: string, secretKey: string, token: string): void;
}
