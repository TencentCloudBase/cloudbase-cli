import './commands'
import { login } from './auth'
import {
    listEnvs,
    createEnv,
    getEnvAuthDomains,
    createEnvDomain,
    deleteEnvDomain,
    getLoginConfigList,
    createLoginConfig,
    updateLoginConfig
} from './env'
import {
    createFunction,
    listFunction,
    deleteFunction,
    getFunctionDetail,
    getFunctionLog,
    updateFunctionConfig,
    createFunctionTriggers,
    deleteFunctionTrigger,
    invokeFunction,
    downloadFunctionCode,
    copyFunction
} from './function'
import * as storage from './storage'
import { authStore } from './utils'
import { ILoginOptions } from './types'
import { codeUpdate } from './commands/functions/code-update'

export = class CloudBase {
    login: (
        options: ILoginOptions
    ) => Promise<{ code: string; msg: string }> = login

    env = {
        list: listEnvs,
        create: createEnv,
        domain: {
            list: getEnvAuthDomains,
            create: createEnvDomain,
            delete: deleteEnvDomain
        },
        login: {
            list: getLoginConfigList,
            create: createLoginConfig,
            update: updateLoginConfig
        }
    }

    functions = {
        invoke: invokeFunction,
        deploy: createFunction,
        list: listFunction,
        delete: deleteFunction,
        detail: getFunctionDetail,
        log: getFunctionLog,
        code: {
            update: codeUpdate
        },
        config: {
            update: updateFunctionConfig
        },
        trigger: {
            create: createFunctionTriggers,
            delete: deleteFunctionTrigger
        },
        download: downloadFunctionCode,
        copy: copyFunction
    }

    storage = storage

    constructor(secretId, secretKey) {
        if (secretId && secretKey) {
            authStore.set('secretId', secretId)
            authStore.set('secretKey', secretKey)
        }
    }
}
