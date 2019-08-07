"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const make_dir_1 = __importDefault(require("make-dir"));
const logger_1 = __importDefault(require("../logger"));
const utils_1 = require("../utils");
const del_1 = __importDefault(require("del"));
const fs_1 = __importDefault(require("fs"));
const logger = new logger_1.default('NodeZipBuilder');
class NodeZipBuilder {
    constructor(options) {
        this._options = options;
    }
    async build() {
        const entry = path_1.default.resolve(process.cwd(), this._options.path);
        const distPath = path_1.default.resolve(process.cwd(), this._options.distPath);
        await make_dir_1.default(distPath);
        const zipPath = path_1.default.resolve(distPath, 'dist.zip');
        logger.log(`Building ${entry} to ${zipPath}`);
        await utils_1.zipDir(entry, zipPath);
        logger.log('Building success!');
        return {
            success: true,
            assets: [zipPath],
            vemo: fs_1.default.existsSync(path_1.default.resolve(entry, 'vemofile.js'))
        };
    }
    async clean() {
        const distPath = path_1.default.resolve(process.cwd(), this._options.distPath);
        del_1.default.sync([distPath]);
    }
}
exports.default = NodeZipBuilder;
