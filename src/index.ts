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
    invokeFunction
} from './function'
import { configStore } from './utils/configstore'

export = class Client {
    login = login
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
        config: {
            update: updateFunctionConfig
        },
        trigger: {
            create: createFunctionTriggers,
            delete: deleteFunctionTrigger
        }
    }

    constructor(secretId, secretKey) {
        if (secretId && secretKey) {
            configStore.set('secretId', secretId)
            configStore.set('secretKey', secretKey)
        }
    }
}
