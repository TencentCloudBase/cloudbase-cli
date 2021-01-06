import { Credential } from '@cloudbase/toolbox';
import { ILoginOptions } from '../types';
export declare function loginByWebAuth(): Promise<{
    code: string;
    msg: string;
} | {
    code: string;
    msg: string;
    credential: Credential;
}>;
export declare function loginWithKey(secretId?: string, secretKey?: string, token?: string): Promise<{
    code: string;
    msg: string;
}>;
export declare function login(options?: ILoginOptions): Promise<{
    code: string;
    msg: string;
    credential?: Credential;
}>;
export declare function checkLogin(): Promise<void>;
