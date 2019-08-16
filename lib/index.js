"use strict";
require("./commands");
const env_1 = require("./env");
const function_1 = require("./function");
const configstore_1 = require("./utils/configstore");
module.exports = class Client {
    constructor(secretId, secretKey) {
        this.env = {
            list: env_1.listEnvs,
            create: env_1.createEnv,
            domain: {
                list: env_1.getEnvAuthDomains,
                create: env_1.createEnvDomain,
                delete: env_1.deleteEnvDomain
            }
        };
        this.functions = {
            invoke: function_1.invokeFunction,
            deploy: function_1.createFunction,
            list: function_1.listFunction,
            delete: function_1.deleteFunction,
            detail: function_1.getFunctionDetail,
            log: function_1.getFunctionLog,
            config: {
                update: function_1.updateFunctionConfig
            },
            trigger: {
                create: function_1.createFunctionTriggers,
                delete: function_1.deleteFunctionTrigger
            }
        };
        if (secretId && secretKey) {
            configstore_1.configStore.set('secretId', secretId);
            configstore_1.configStore.set('secretKey', secretKey);
        }
    }
};
