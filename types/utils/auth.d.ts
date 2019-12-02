import { Credential, AuthSecret, ILoginOptions } from '../types';
export { printHorizontalTable } from './cli-table';
export declare function refreshTmpToken(metaData: Credential & {
    isLogout?: boolean;
}): Promise<Credential>;
export declare function getCredentialData(): Credential;
export declare function getCredentialWithoutCheck(): Promise<AuthSecret>;
export declare function getAuthTokenFromWeb(options: ILoginOptions): Promise<Credential>;
