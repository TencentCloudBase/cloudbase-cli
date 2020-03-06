import { Credential, ILoginOptions } from '../types';
export declare function checkAuth(credential: Credential): Promise<any>;
export declare function getAuthTokenFromWeb(options: ILoginOptions): Promise<Credential>;
