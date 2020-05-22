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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const fs_2 = require("../fs");
const db_1 = require("./db");
const constant_1 = require("../../constant");
class AuthStore extends db_1.LocalStore {
    constructor(defaults) {
        super(defaults, 'auth');
        this.defaults = defaults;
        this.moveOldConfig();
    }
    moveOldConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.getDB();
            const oldConfigPath = path_1.default.resolve(os_1.default.homedir(), '.config', 'configstore', '@cloudbase', 'cli.json');
            if (fs_2.checkFullAccess(oldConfigPath)) {
                try {
                    const content = JSON.parse(fs_1.default.readFileSync(oldConfigPath, 'utf8'));
                    const { credential, ssh } = content;
                    yield db.set(constant_1.ConfigItems.credential, credential).write();
                    yield db.set(constant_1.ConfigItems.ssh, ssh).write();
                    fs_1.default.unlinkSync(oldConfigPath);
                }
                catch (e) {
                    fs_1.default.unlinkSync(oldConfigPath);
                }
            }
        });
    }
}
exports.authStore = new AuthStore({
    _: '这是您的 CloudBase 身份凭据文件，请不要分享给他人！',
    [constant_1.ConfigItems.credential]: {},
    [constant_1.ConfigItems.ssh]: {}
});
function getUin() {
    return __awaiter(this, void 0, void 0, function* () {
        const credential = yield exports.authStore.get(constant_1.ConfigItems.credential);
        return (credential === null || credential === void 0 ? void 0 : credential.uin) || '无';
    });
}
exports.getUin = getUin;
