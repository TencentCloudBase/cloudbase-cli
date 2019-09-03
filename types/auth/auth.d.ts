import { Credential } from '../types';
export declare function getAuthTokenFromWeb(): Promise<Credential>;
export declare function refreshTmpToken(metaData: Credential): Promise<Credential>;
