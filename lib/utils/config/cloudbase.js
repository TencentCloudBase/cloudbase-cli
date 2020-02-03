"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cosmiconfig_1 = require("./cosmiconfig");
const error_1 = require("../../error");
const DefaultFunctionDeployOptions = {
    timeout: 5,
    runtime: 'Nodejs8.9',
    handler: 'index.main'
};
const DefaultCloudBaseConfig = {
    functionRoot: './functions',
    functions: []
};
function resolveCloudBaseConfig(configPath = '') {
    return __awaiter(this, void 0, void 0, function* () {
        const oldTcbConfig = yield cosmiconfig_1.loadConfig({
            moduleName: 'tcb'
        });
        if (oldTcbConfig) {
            throw new error_1.CloudBaseError('tcbrc.json 配置文件已废弃，请使用 cloudbaserc 配置文件！');
        }
        const localCloudBaseConfig = yield cosmiconfig_1.loadConfig({
            configPath
        });
        if (localCloudBaseConfig && !localCloudBaseConfig.envId) {
            throw new error_1.CloudBaseError('无效的配置文件，配置文件必须包含含环境 Id');
        }
        const cloudbaseConfig = Object.assign(Object.assign({}, DefaultCloudBaseConfig), localCloudBaseConfig);
        cloudbaseConfig.functions = cloudbaseConfig.functions.map(func => {
            if (func.config) {
                return Object.assign(Object.assign({}, func), func.config);
            }
            else {
                return func;
            }
        });
        return cloudbaseConfig;
    });
}
exports.resolveCloudBaseConfig = resolveCloudBaseConfig;
function getEnvId(commandOptions) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const envId = (_a = commandOptions) === null || _a === void 0 ? void 0 : _a.envId;
        const configPath = (_c = (_b = commandOptions) === null || _b === void 0 ? void 0 : _b.parent) === null || _c === void 0 ? void 0 : _c.configFile;
        const cloudbaseConfig = yield resolveCloudBaseConfig(configPath);
        const assignEnvId = envId || cloudbaseConfig.envId;
        return assignEnvId;
    });
}
exports.getEnvId = getEnvId;
