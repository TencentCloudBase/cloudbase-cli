/// <reference types="node" />
import { EventEmitter } from 'events';
import { ICommandContext } from '../types';
interface ICommandOption {
    flags: string;
    desc: string;
}
export interface ICommandOptions {
    cmd: string;
    options: ICommandOption[];
    desc: string;
    requiredEnvId?: boolean;
}
export declare function ICommand(): ClassDecorator;
export declare function registerCommands(): void;
export declare abstract class Command extends EventEmitter {
    on(event: 'preHandle' | 'afterHandle', listener: (ctx: ICommandContext, args: any[]) => void): this;
    init(): void;
    private preHandle;
    private afterHandle;
    abstract execute(...args: any[]): void;
    abstract get options(): ICommandOptions;
}
export {};
