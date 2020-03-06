import { Credential, AuthSecret } from '../types';
export declare function refreshTmpToken(metaData: Credential & {
    isLogout?: boolean;
}): Promise<Credential>;
export declare function getCredentialData(): Promise<Credential>;
export declare function getCredentialWithoutCheck(): Promise<AuthSecret>;
