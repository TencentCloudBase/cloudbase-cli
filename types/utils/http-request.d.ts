import { RequestInit } from 'node-fetch';
export declare function fetch(url: string, config?: RequestInit): Promise<any>;
export declare function postFetch(url: string, data?: Record<string, any>): Promise<any>;
export declare function fetchStream(url: any, config?: Record<string, any>): Promise<import("node-fetch").Response>;
