/// <reference types="node" />
import { ChildProcess } from 'child_process';
export declare function promisifyProcess(p: ChildProcess, pipe?: boolean): Promise<unknown>;
