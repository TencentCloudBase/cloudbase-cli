import _ConfigStore from 'configstore';
declare class ConfigStore extends _ConfigStore {
    constructor(packageName: string, defaults?: any, options?: any);
    get(item: string): Record<string, any>;
    deleteOldConfig(): void;
}
export declare const configStore: ConfigStore;
export {};
