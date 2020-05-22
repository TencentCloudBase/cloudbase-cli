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
const fs_extra_1 = __importDefault(require("fs-extra"));
const lowdb_1 = __importDefault(require("lowdb"));
const path_1 = __importDefault(require("path"));
const FileAsync_1 = __importDefault(require("lowdb/adapters/FileAsync"));
const FileSync_1 = __importDefault(require("lowdb/adapters/FileSync"));
const xdg_basedir_1 = __importDefault(require("xdg-basedir"));
const configDir = xdg_basedir_1.default.config || path_1.default.join(os_1.default.tmpdir(), '.config');
exports.cloudbaseConfigDir = path_1.default.join(configDir, '.cloudbase');
fs_extra_1.default.ensureDirSync(exports.cloudbaseConfigDir);
function getAsyncDB(file) {
    const dbPath = path_1.default.join(exports.cloudbaseConfigDir, `${file}.json`);
    const adapter = new FileAsync_1.default(dbPath);
    const db = lowdb_1.default(adapter);
    return db;
}
exports.getAsyncDB = getAsyncDB;
function getSyncDB(file) {
    const dbPath = path_1.default.join(exports.cloudbaseConfigDir, `${file}.json`);
    const adapter = new FileSync_1.default(dbPath);
    const db = lowdb_1.default(adapter);
    return db;
}
exports.getSyncDB = getSyncDB;
class LocalStore {
    constructor(defaults, dbKey = 'common') {
        this.defaults = defaults;
        this.dbKey = dbKey;
    }
    getDB() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.db || (yield getAsyncDB(this.dbKey));
            this.db = db;
            return db;
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultValue = this.defaults[key];
            const db = yield this.getDB();
            return db.get(key).value() || defaultValue;
        });
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.getDB();
            yield db.set(key, value).write();
        });
    }
    push(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.getDB();
            yield db.get(key).push(value).write();
        });
    }
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.getDB();
            yield db.unset(key).write();
        });
    }
}
exports.LocalStore = LocalStore;
