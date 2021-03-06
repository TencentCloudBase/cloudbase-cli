"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
require("reflect-metadata");
const commands_1 = require("./commands");
commands_1.registerCommands();
const auth_1 = require("./auth");
const env_1 = require("./env");
const third_1 = require("./third");
const function_1 = require("./function");
const storage = __importStar(require("./storage"));
const utils_1 = require("./utils");
module.exports = class CloudBase {
    constructor(secretId, secretKey) {
        this.login = auth_1.login;
        this.logout = auth_1.logout;
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
        this.third = {
            deleteThirdPartAttach: third_1.deleteThirdPartAttach
        };
        this.functions = {
            invoke: function_1.invokeFunction,
            deploy: function_1.createFunction,
            list: function_1.listFunction,
            delete: function_1.deleteFunction,
            detail: function_1.getFunctionDetail,
            log: function_1.getFunctionLog,
            code: {
                update: function_1.updateFunctionCode
            },
            config: {
                update: function_1.updateFunctionConfig
            },
            trigger: {
                create: function_1.createFunctionTriggers,
                delete: function_1.deleteFunctionTrigger
            },
            download: function_1.downloadFunctionCode,
            copy: function_1.copyFunction
        };
        this.storage = storage;
        console.warn('');
        if (secretId && secretKey) {
            const credential = {
                secretId,
                secretKey
            };
            utils_1.getSyncDB('auth').set('credential', credential).write();
        }
    }
};
