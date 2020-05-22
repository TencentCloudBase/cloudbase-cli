import { ILoginOptions } from '../types';
import { Credential } from '@cloudbase/toolbox';
export declare function loginByWebAuth(): Promise<{
    code: string;
    msg: string;
} | {
    code: string;
    msg: string;
    credential: any;
}>;
export declare function loginWithKey(secretId?: string, secretKey?: string): Promise<{
    code: string;
    msg: string;
}>;
export declare function login(options?: ILoginOptions): Promise<{
    code: string;
    msg: string;
    credential?: Credential;
}>;
