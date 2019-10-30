"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const local_store_1 = require("./local-store");
const constant_1 = require("../../constant");
const ConfigDefaultItems = [constant_1.ConfigItems.credentail];
class AuthStore extends local_store_1.LocalStore {
    constructor(name, defaults) {
        super(name, defaults);
        this.moveOldConfig();
    }
    get(item) {
        if (ConfigDefaultItems.includes(item)) {
            return super.get(item) || {};
        }
        else {
            return super.get(item);
        }
    }
    moveOldConfig() {
        const oldConfigPath = path_1.default.resolve(os_1.default.homedir(), '.config', 'configstore', '@cloudbase', 'cli.json');
        if (fs_1.default.existsSync(oldConfigPath)) {
            try {
                const content = JSON.parse(fs_1.default.readFileSync(oldConfigPath, 'utf8'));
                const { credential, ssh } = content;
                this.set(constant_1.ConfigItems.credentail, credential);
                this.set(constant_1.ConfigItems.ssh, ssh);
                fs_1.default.unlinkSync(oldConfigPath);
            }
            catch (e) {
                fs_1.default.unlinkSync(oldConfigPath);
            }
        }
    }
}
exports.authStore = new AuthStore('auth', {
    _: '这是您的 CloudBase 身份凭据文件，请不要分享给他人！',
    [constant_1.ConfigItems.credentail]: {},
    [constant_1.ConfigItems.ssh]: {}
});
