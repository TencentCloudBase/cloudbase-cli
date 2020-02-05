/// <reference types="node" />
import { EventEmitter } from 'events';
import { ICloudBaseConfig } from '../types';
interface ICommandOption {
    flags: string;
    desc: string;
}
export interface ICommandOptions {
    cmd: string;
    options: ICommandOption[];
    desc: string;
    handler: Function;
    requiredEnvId?: boolean;
}
export interface ICommandContext {
    cmd: string;
    envId: string;
    config: ICloudBaseConfig;
    options: any;
}
export declare class Command extends EventEmitter {
    options: ICommandOptions;
    constructor(options: ICommandOptions);
    on(event: 'preHandle' | 'afterHandle', listener: (ctx: ICommandContext, args: any[]) => void): this;
    init(): void;
    private preHandle;
    private afterHandle;
}
export {};
