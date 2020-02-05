import { LocalStore } from './db';
declare class AuthStore extends LocalStore {
    constructor(defaults: any);
    moveOldConfig(): Promise<void>;
}
export declare const authStore: AuthStore;
export declare function getUin(): Promise<any>;
export {};
