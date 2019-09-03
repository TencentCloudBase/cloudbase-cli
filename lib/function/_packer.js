"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const del_1 = __importDefault(require("del"));
const make_dir_1 = __importDefault(require("make-dir"));
const utils_1 = require("../utils");
const error_1 = require("../error");
var CodeType;
(function (CodeType) {
    CodeType[CodeType["File"] = 0] = "File";
    CodeType[CodeType["JavaFile"] = 1] = "JavaFile";
})(CodeType = exports.CodeType || (exports.CodeType = {}));
class FunctionPacker {
    constructor(root, name) {
        this.name = name;
        this.root = root;
        this.funcPath = path_1.default.join(root, name);
    }
    validPath(path) {
        if (!fs_1.default.existsSync(path)) {
            throw new error_1.TcbError('file not exist');
        }
    }
    async getFileCode() {
        this.validPath(this.funcPath);
        this.tmpPath = path_1.default.join(this.root, '.cloudbase_tmp');
        this.funcDistPath = path_1.default.join(this.tmpPath, this.name);
        this.clean();
        await make_dir_1.default(this.funcDistPath);
        const zipPath = path_1.default.resolve(this.funcDistPath, 'dist.zip');
        await utils_1.zipDir(this.funcPath, zipPath);
        const base64 = fs_1.default.readFileSync(zipPath).toString('base64');
        await this.clean();
        return base64;
    }
    getJavaFileCode() {
        const { funcPath } = this;
        const jarExist = fs_1.default.existsSync(`${funcPath}.jar`);
        const zipExist = fs_1.default.existsSync(`${funcPath}.zip`);
        if (!jarExist && !zipExist) {
            return null;
        }
        const packagePath = jarExist ? `${funcPath}.jar` : `${funcPath}.zip`;
        return fs_1.default.readFileSync(packagePath).toString('base64');
    }
    async build(type) {
        if (type === CodeType.JavaFile) {
            return this.getJavaFileCode();
        }
        if (type === CodeType.File) {
            return await this.getFileCode();
        }
    }
    async clean() {
        del_1.default.sync([this.funcDistPath, this.tmpPath]);
        return;
    }
}
exports.FunctionPacker = FunctionPacker;
