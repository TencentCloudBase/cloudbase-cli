import { Credential, AuthSecret } from '../types';
export { printCliTable } from './cli-table';
export declare function refreshTmpToken(metaData: Credential & {
    isLogout?: boolean;
}): Promise<Credential>;
export declare function getCredentialData(): Credential;
export declare function getCredentialWithoutCheck(): Promise<AuthSecret>;
export declare function getAuthTokenFromWeb(): Promise<Credential>;
