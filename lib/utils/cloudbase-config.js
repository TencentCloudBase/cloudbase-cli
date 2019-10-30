"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const store_1 = require("./store");
const error_1 = require("../error");
const DefaultFunctionDeployOptions = {
    config: {
        timeout: 5,
        runtime: 'Nodejs8.9'
    },
    handler: 'index.main'
};
const DefaultCloudBaseConfig = {
    functionRoot: './functions',
    functions: []
};
function getCloudBaseConfig() {
    return store_1.authStore.all();
}
exports.getCloudBaseConfig = getCloudBaseConfig;
function resolveCloudBaseConfig(configPath = '') {
    return __awaiter(this, void 0, void 0, function* () {
        const tcbrcPath = path_1.default.resolve('tcbrc.json');
        if (fs_1.default.existsSync(tcbrcPath)) {
            throw new error_1.CloudBaseError('tcbrc.json 配置文件已废弃，请使用 cloudbaserc.json 或 cloudbaserc.js 配置文件！');
        }
        const cloudbaseJSONPath = path_1.default.resolve('cloudbaserc.json');
        const cloudbaseJSPath = path_1.default.resolve('cloudbaserc.js');
        const customConfigPath = (configPath && path_1.default.resolve(configPath)) || null;
        const cloudbasePath = [
            customConfigPath,
            cloudbaseJSPath,
            cloudbaseJSONPath
        ].find(item => item && fs_1.default.existsSync(item));
        if (!cloudbasePath ||
            !fs_1.default.existsSync(cloudbasePath) ||
            !cloudbasePath.match(/.js$|.json$/g)) {
            throw new error_1.CloudBaseError('配置文件不存在');
        }
        const localCloudBaseConfig = yield Promise.resolve().then(() => __importStar(require(cloudbasePath)));
        if (!localCloudBaseConfig.envId) {
            throw new error_1.CloudBaseError('配置文件无效，配置文件必须包含含环境 Id');
        }
        const cloudbaseConfig = Object.assign({}, DefaultCloudBaseConfig, localCloudBaseConfig);
        cloudbaseConfig.functions = cloudbaseConfig.functions.map(config => (Object.assign({}, DefaultFunctionDeployOptions, config)));
        return cloudbaseConfig;
    });
}
exports.resolveCloudBaseConfig = resolveCloudBaseConfig;
function getEnvId(envId, configPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const cloudbaseConfig = yield resolveCloudBaseConfig(configPath);
        const assignEnvId = envId || cloudbaseConfig.envId;
        if (!assignEnvId) {
            throw new error_1.CloudBaseError('未识别到有效的环境 Id 变量，请在项目根目录进行操作或通过 envId 参数指定环境 Id');
        }
        return assignEnvId;
    });
}
exports.getEnvId = getEnvId;
