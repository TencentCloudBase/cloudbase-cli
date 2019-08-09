"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
const configstore_1 = __importDefault(require("configstore"));
const constant_1 = require("../constant");
const ConfigDefaultItems = [constant_1.ConfigItems.credentail];
class ConfigStore extends configstore_1.default {
    constructor(packageName, defaults, options) {
        super(packageName, defaults, options);
        this.deleteOldConfig();
    }
    get(item) {
        if (ConfigDefaultItems.includes(item)) {
            return super.get(item) || {};
        }
        else {
            return super.get(item);
        }
    }
    deleteOldConfig() {
        const oldConfigPath = path_1.default.resolve(os_1.default.homedir(), 'tcbrc.json');
        if (fs_1.default.existsSync(oldConfigPath)) {
            fs_1.default.unlinkSync(oldConfigPath);
        }
    }
}
exports.configStore = new ConfigStore('@cloudbase/cli');
