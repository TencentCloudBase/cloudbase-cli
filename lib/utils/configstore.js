"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configstore_1 = __importDefault(require("configstore"));
const constant_1 = require("../constant");
const ConfigDefaultItems = [constant_1.ConfigItems.credentail];
class ConfigStore extends configstore_1.default {
    constructor(packageName, defaults, options) {
        super(packageName, defaults, options);
    }
    get(item) {
        if (ConfigDefaultItems.includes(item)) {
            return super.get(item) || {};
        }
        else {
            return super.get(item);
        }
    }
}
exports.configStore = new ConfigStore('@cloudbase/cli');
