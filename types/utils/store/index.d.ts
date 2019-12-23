declare class AuthStore {
    db: any;
    defaults: any;
    constructor(defaults: any);
    get(item: string): Record<string, any>;
    set(item: string, value: any): void;
    delete(item: any): void;
    moveOldConfig(): void;
}
export declare const authStore: AuthStore;
export {};
