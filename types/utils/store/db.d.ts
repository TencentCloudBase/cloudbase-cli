import low from 'lowdb';
export declare const cloudbaseConfigDir: string;
export declare function getAsyncDB(file: string): Promise<low.LowdbAsync<any>>;
export declare function getSyncDB(file: string): low.LowdbSync<any>;
export declare class LocalStore {
    db: any;
    dbKey: string;
    defaults: any;
    constructor(defaults: any, dbKey?: string);
    getDB(): Promise<any>;
    get(key: string): Promise<any>;
    set(key: string, value: any): Promise<void>;
    push(key: string, value: any): Promise<void>;
    delete(key: any): Promise<void>;
}
