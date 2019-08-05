import './commands'
import { listEnvs } from './env'
import {
    createFunction,
    listFunction,
    deleteFunction,
    getFunctionDetail,
    getFunctionLog,
    updateFunctionConfig,
    createFunctionTriggers,
    deleteFunctionTrigger
} from './function'
import { configStore } from './utils/configstore'

export = class Client {
    list = listEnvs

    function = {
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
