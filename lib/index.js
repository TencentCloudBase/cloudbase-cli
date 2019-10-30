"use strict";
require("./commands");
const auth_1 = require("./auth");
const env_1 = require("./env");
const function_1 = require("./function");
const utils_1 = require("./utils");
exports.authStore = utils_1.authStore;
module.exports = class CloudBase {
    constructor(secretId, secretKey) {
        this.login = auth_1.login;
        this.env = {
            list: env_1.listEnvs,
            create: env_1.createEnv,
            domain: {
                list: env_1.getEnvAuthDomains,
                create: env_1.createEnvDomain,
                delete: env_1.deleteEnvDomain
            },
            login: {
                list: env_1.getLoginConfigList,
                create: env_1.createLoginConfig,
                update: env_1.updateLoginConfig
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
            utils_1.authStore.set('secretId', secretId);
            utils_1.authStore.set('secretKey', secretKey);
        }
    }
};
