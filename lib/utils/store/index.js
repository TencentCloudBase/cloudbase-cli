"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const db_1 = require("./db");
const constant_1 = require("../../constant");
class AuthStore {
    constructor(defaults) {
        this.defaults = defaults;
        this.db = db_1.getAuthDB();
        this.db.defaults(defaults);
        this.moveOldConfig();
    }
    get(item) {
        const defaultValue = this.defaults[item];
        return this.db.get(item).value() || defaultValue;
    }
    set(item, value) {
        this.db.set(item, value).write();
    }
    delete(item) {
        this.db.unset(item).write();
    }
    moveOldConfig() {
        const oldConfigPath = path_1.default.resolve(os_1.default.homedir(), '.config', 'configstore', '@cloudbase', 'cli.json');
        if (fs_1.default.existsSync(oldConfigPath)) {
            try {
                const content = JSON.parse(fs_1.default.readFileSync(oldConfigPath, 'utf8'));
                const { credential, ssh } = content;
                this.db.set(constant_1.ConfigItems.credentail, credential).write();
                this.db.set(constant_1.ConfigItems.ssh, ssh).write();
                fs_1.default.unlinkSync(oldConfigPath);
            }
            catch (e) {
                fs_1.default.unlinkSync(oldConfigPath);
            }
        }
    }
}
exports.authStore = new AuthStore({
    _: '这是您的 CloudBase 身份凭据文件，请不要分享给他人！',
    [constant_1.ConfigItems.credentail]: {},
    [constant_1.ConfigItems.ssh]: {}
});
