export declare class LocalStore {
    path: string;
    constructor(name: string, defaults: any);
    get all(): any;
    set all(value: any);
    get size(): number;
    get(key: any): unknown;
    set(key: any, value: any): void;
    has(key: any): boolean;
    delete(key: any): void;
    clear(): void;
}
