export declare const pagingSelectPromp: <T, O extends {
    limit?: number;
    offset?: number;
}>(type: 'select' | 'multiselect', listFetcher: (options: O) => Promise<any[]>, options: O, message: string, filter?: (item: any) => boolean, mapper?: (item: any) => string) => Promise<string | string[]>;
