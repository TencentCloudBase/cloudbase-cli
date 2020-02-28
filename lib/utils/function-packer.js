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
const fs_1 = __importDefault(require("fs"));
const del_1 = __importDefault(require("del"));
const path_1 = __importDefault(require("path"));
const make_dir_1 = __importDefault(require("make-dir"));
const tools_1 = require("./tools");
const fs_2 = require("./fs");
const error_1 = require("../error");
var CodeType;
(function (CodeType) {
    CodeType[CodeType["File"] = 0] = "File";
    CodeType[CodeType["JavaFile"] = 1] = "JavaFile";
})(CodeType = exports.CodeType || (exports.CodeType = {}));
class FunctionPacker {
    constructor(root, name, ignore) {
        this.name = name;
        this.root = root;
        this.ignore = ignore;
        this.funcPath = path_1.default.join(root, name);
    }
    getFileCode() {
        return __awaiter(this, void 0, void 0, function* () {
            fs_2.checkFullAccess(this.funcPath, true);
            this.tmpPath = path_1.default.join(this.root, `.cloudbase_tmp_${tools_1.random()}`);
            this.funcDistPath = path_1.default.join(this.tmpPath, this.name);
            yield make_dir_1.default(this.funcDistPath);
            const zipPath = path_1.default.resolve(this.funcDistPath, 'dist.zip');
            yield fs_2.zipDir(this.funcPath, zipPath, this.ignore);
            const base64 = fs_1.default.readFileSync(zipPath).toString('base64');
            this.clean();
            return base64;
        });
    }
    getJavaFileCode() {
        const { funcPath } = this;
        const jarExist = fs_2.checkFullAccess(`${funcPath}.jar`);
        const zipExist = fs_2.checkFullAccess(`${funcPath}.zip`);
        if (!jarExist && !zipExist) {
            return null;
        }
        const packagePath = jarExist ? `${funcPath}.jar` : `${funcPath}.zip`;
        return fs_1.default.readFileSync(packagePath).toString('base64');
    }
    build(type) {
        return __awaiter(this, void 0, void 0, function* () {
            if (type === CodeType.JavaFile) {
                try {
                    const code = yield this.getJavaFileCode();
                    return code;
                }
                catch (error) {
                    this.clean();
                    throw new error_1.CloudBaseError(`函数代码打包失败：\n ${error.message}`);
                }
            }
            if (type === CodeType.File) {
                try {
                    const code = yield this.getFileCode();
                    return code;
                }
                catch (error) {
                    this.clean();
                    throw new error_1.CloudBaseError(`函数代码打包失败：\n ${error.message}`);
                }
            }
        });
    }
    clean() {
        this.funcDistPath && del_1.default.sync([this.funcDistPath], { force: true });
        this.tmpPath && del_1.default.sync([this.tmpPath], { force: true });
    }
}
exports.FunctionPacker = FunctionPacker;
