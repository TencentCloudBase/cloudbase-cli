import { ILoginOptions } from '../types';
export declare function loginWithToken(options: ILoginOptions): Promise<{
    code: string;
    msg: string;
}>;
export declare function loginWithKey(secretId?: string, secretKey?: string): Promise<{
    code: string;
    msg: string;
}>;
export declare function login(options?: ILoginOptions): Promise<{
    code: string;
    msg: string;
}>;
