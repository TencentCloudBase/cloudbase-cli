import { LocalStore } from './local-store';
declare class AuthStore extends LocalStore {
    constructor(name: string, defaults: any);
    get(item: string): Record<string, any>;
    moveOldConfig(): void;
}
export declare const authStore: AuthStore;
export {};
