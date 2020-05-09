import 'reflect-metadata'
import { registerCommands } from './commands'

registerCommands()

import { login, logout } from './auth'
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
import { deleteThirdPartAttach } from './third'
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
    copyFunction,
    updateFunctionCode
} from './function'
import * as storage from './storage'
import { getSyncDB } from './utils'
import { ILoginOptions } from './types'

export = class CloudBase {
    login: (options: ILoginOptions) => Promise<{ code: string; msg: string }> = login

    logout = logout

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

    third = {
        deleteThirdPartAttach
    }

    functions = {
        invoke: invokeFunction,
        deploy: createFunction,
        list: listFunction,
        delete: deleteFunction,
        detail: getFunctionDetail,
        log: getFunctionLog,
        code: {
            update: updateFunctionCode
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
        console.warn('')

        if (secretId && secretKey) {
            const credential = {
                secretId,
                secretKey
            }
            getSyncDB('auth').set('credential', credential).write()
        }
    }
}
