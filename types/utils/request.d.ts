export declare class CloudService {
    version: string;
    service: string;
    sdkCredential: Record<string, string>;
    baseParams: Record<string, string>;
    constructor(service: string, version: string, baseParams?: Record<string, string>);
    request(interfaceName: string, params?: any): Promise<any>;
    setCredential(secretId: string, secretKey: string, token: string): void;
}
