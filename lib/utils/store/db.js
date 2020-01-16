"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const lowdb_1 = __importDefault(require("lowdb"));
const path_1 = __importDefault(require("path"));
const FileSync_1 = __importDefault(require("lowdb/adapters/FileSync"));
const xdg_basedir_1 = __importDefault(require("xdg-basedir"));
const configDir = xdg_basedir_1.default.config || path_1.default.join(os_1.default.tmpdir(), '.config');
exports.cloudbaseConfigDir = path_1.default.join(configDir, '.cloudbase');
fs_extra_1.default.ensureDirSync(exports.cloudbaseConfigDir);
function getDB(file) {
    const dbPath = path_1.default.join(exports.cloudbaseConfigDir, `${file}.json`);
    const adapter = new FileSync_1.default(dbPath);
    const db = lowdb_1.default(adapter);
    return db;
}
exports.getDB = getDB;
