import CloudBase from '@cloudbase/manager-node';
import { StorageService } from '@cloudbase/manager-node/types/storage';
export declare function getMangerService(envId?: string): Promise<CloudBase>;
export declare function getStorageService(envId: string): Promise<StorageService>;
