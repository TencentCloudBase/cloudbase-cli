import { CloudApiService as _CloudApiService } from '@cloudbase/cloud-api';
export declare class CloudApiService {
    static serviceCacheMap: Record<string, CloudApiService>;
    static getInstance(service: string): CloudApiService;
    region: string;
    apiService: _CloudApiService;
    constructor(service: string, baseParams?: Record<string, any>, version?: string);
    request(action: string, data?: Record<string, any>, method?: 'POST' | 'GET'): Promise<any>;
}
