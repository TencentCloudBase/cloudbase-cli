"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const del_1 = __importDefault(require("del"));
const make_dir_1 = __importDefault(require("make-dir"));
const ora_1 = __importDefault(require("ora"));
const utils_1 = require("../utils");
class FunctionPack {
    constructor(path, distPath) {
        this.path = path;
        this.distPath = distPath;
    }
    async build(name) {
        const entry = path_1.default.resolve(process.cwd(), this.path);
        const distPath = path_1.default.resolve(process.cwd(), this.distPath);
        await make_dir_1.default(distPath);
        const zipPath = path_1.default.resolve(distPath, 'dist.zip');
        const packSpin = ora_1.default('开始构建压缩包...').start();
        await utils_1.zipDir(entry, zipPath);
        packSpin.succeed(`[${name}] 函数压缩包构建完成！`);
        return {
            success: true,
            assets: [zipPath]
        };
    }
    async clean() {
        const distPath = path_1.default.resolve(process.cwd(), this.distPath);
        del_1.default.sync([distPath]);
        return;
    }
}
exports.FunctionPack = FunctionPack;
