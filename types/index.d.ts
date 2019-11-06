import './commands';
import { listEnvs, createEnv, getEnvAuthDomains, createEnvDomain, deleteEnvDomain, getLoginConfigList, createLoginConfig, updateLoginConfig } from './env';
import { createFunction, listFunction, deleteFunction, getFunctionDetail, getFunctionLog, updateFunctionConfig, createFunctionTriggers, deleteFunctionTrigger, invokeFunction } from './function';
import * as storage from './storage';
import { ILoginOptions } from './types';
declare const _default: {
    new (secretId: any, secretKey: any): {
        login: (options: ILoginOptions) => Promise<{
            code: string;
            msg: string;
        }>;
        env: {
            list: typeof listEnvs;
            create: typeof createEnv;
            domain: {
                list: typeof getEnvAuthDomains;
                create: typeof createEnvDomain;
                delete: typeof deleteEnvDomain;
            };
            login: {
                list: typeof getLoginConfigList;
                create: typeof createLoginConfig;
                update: typeof updateLoginConfig;
            };
        };
        functions: {
            invoke: typeof invokeFunction;
            deploy: typeof createFunction;
            list: typeof listFunction;
            delete: typeof deleteFunction;
            detail: typeof getFunctionDetail;
            log: typeof getFunctionLog;
            config: {
                update: typeof updateFunctionConfig;
            };
            trigger: {
                create: typeof createFunctionTriggers;
                delete: typeof deleteFunctionTrigger;
            };
        };
        storage: typeof storage;
    };
};
export = _default;
