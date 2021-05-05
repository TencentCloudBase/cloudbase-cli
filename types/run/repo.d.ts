import { IListVersionOptions } from '../types';
export declare const describeImageRepo: (options: IListVersionOptions) => Promise<any>;
export declare const deleteImageRepo: (options: {
    imageRepo: string;
}) => Promise<any>;
