"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dot_prop_1 = __importDefault(require("dot-prop"));
const xdg_basedir_1 = __importDefault(require("xdg-basedir"));
const write_file_atomic_1 = __importDefault(require("write-file-atomic"));
const make_dir_1 = __importDefault(require("make-dir"));
const uuid_1 = require("../uuid");
const configDirectory = xdg_basedir_1.default.config || path_1.default.join(os_1.default.tmpdir(), uuid_1.random(32));
const permissionError = '你没有权限操作此文件';
const makeDirOptions = { mode: 0o0700 };
const writeFileOptions = { mode: 0o0600 };
class LocalStore {
    constructor(name, defaults) {
        const pathPrefix = path_1.default.join('.cloudbase', `${name}.json`);
        this.path = path_1.default.join(configDirectory, pathPrefix);
        if (defaults) {
            this.all = Object.assign(Object.assign({}, defaults), this.all);
        }
    }
    get all() {
        try {
            return JSON.parse(fs_1.default.readFileSync(this.path, 'utf8'));
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                return {};
            }
            if (error.code === 'EACCES') {
                error.message = `${error.message}\n${permissionError}\n`;
            }
            if (error.name === 'SyntaxError') {
                write_file_atomic_1.default.sync(this.path, '', writeFileOptions);
                return {};
            }
            throw error;
        }
    }
    set all(value) {
        try {
            make_dir_1.default.sync(path_1.default.dirname(this.path), makeDirOptions);
            write_file_atomic_1.default.sync(this.path, JSON.stringify(value, undefined, '\t'), writeFileOptions);
        }
        catch (error) {
            if (error.code === 'EACCES') {
                error.message = `${error.message}\n${permissionError}\n`;
            }
            throw error;
        }
    }
    get size() {
        return Object.keys(this.all || {}).length;
    }
    get(key) {
        return dot_prop_1.default.get(this.all, key);
    }
    set(key, value) {
        const config = this.all;
        if (arguments.length === 1) {
            for (const k of Object.keys(key)) {
                dot_prop_1.default.set(config, k, key[k]);
            }
        }
        else {
            dot_prop_1.default.set(config, key, value);
        }
        this.all = config;
    }
    has(key) {
        return dot_prop_1.default.has(this.all, key);
    }
    delete(key) {
        const config = this.all;
        dot_prop_1.default.delete(config, key);
        this.all = config;
    }
    clear() {
        this.all = {};
    }
}
exports.LocalStore = LocalStore;
