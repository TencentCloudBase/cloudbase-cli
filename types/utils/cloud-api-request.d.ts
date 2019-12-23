export declare class CloudApiService {
    service: string;
    version: string;
    url: string;
    action: string;
    method: 'POST' | 'GET';
    timeout: number;
    data: Record<string, any>;
    payload: Record<string, any>;
    baseParams: Record<string, any>;
    credential: Record<string, any>;
    constructor(service: string, baseParams?: Record<string, any>, version?: string);
    get baseUrl(): any;
    request(action: string, data?: Record<string, any>, method?: 'POST' | 'GET'): Promise<any>;
    requestWithSign(): Promise<any>;
    getRequestSign(timestamp: number): string;
    setCredential(secretId: string, secretKey: string, token: string): void;
}
