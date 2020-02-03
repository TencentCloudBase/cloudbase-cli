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
const cosmiconfig_1 = require("cosmiconfig");
const error_1 = require("../../error");
const MODULE_NAME = 'cloudbase';
function loadConfig(options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { moduleName = MODULE_NAME, configPath } = options;
        const explorer = cosmiconfig_1.cosmiconfig(moduleName, {
            searchPlaces: [
                'package.json',
                `${moduleName}rc`,
                `${moduleName}rc.json`,
                `${moduleName}rc.yaml`,
                `${moduleName}rc.yml`,
                `${moduleName}rc.js`,
                `${moduleName}.config.js`
            ]
        });
        if (configPath) {
            try {
                const result = yield explorer.load(configPath);
                if (!result)
                    return null;
                const { config, filepath, isEmpty } = result;
                return config;
            }
            catch (e) {
                throw new error_1.CloudBaseError(e.message);
            }
        }
        try {
            const result = yield explorer.search(process.cwd());
            if (!result)
                return null;
            const { config, filepath, isEmpty } = result;
            return config;
        }
        catch (e) {
            throw new error_1.CloudBaseError('配置文件解析失败！');
        }
    });
}
exports.loadConfig = loadConfig;
function searchConfig(dest) {
    return __awaiter(this, void 0, void 0, function* () {
        const moduleName = MODULE_NAME;
        const explorer = cosmiconfig_1.cosmiconfig(moduleName, {
            searchPlaces: [
                'package.json',
                `${moduleName}rc`,
                `${moduleName}rc.json`,
                `${moduleName}rc.yaml`,
                `${moduleName}rc.yml`,
                `${moduleName}rc.js`,
                `${moduleName}.config.js`
            ]
        });
        try {
            return explorer.search(dest || process.cwd());
        }
        catch (e) {
            return null;
        }
    });
}
exports.searchConfig = searchConfig;
