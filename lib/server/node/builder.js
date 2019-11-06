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
const path_1 = __importDefault(require("path"));
const make_dir_1 = __importDefault(require("make-dir"));
const logger_1 = __importDefault(require("../../logger"));
const index_js_1 = require("../../utils/index.js");
const del_1 = __importDefault(require("del"));
const fs_1 = __importDefault(require("fs"));
const logger = new logger_1.default('NodeZipBuilder');
class NodeZipBuilder {
    constructor(options) {
        this._options = options;
    }
    build(zipFileName = 'dist.zip') {
        return __awaiter(this, void 0, void 0, function* () {
            const entry = path_1.default.resolve(process.cwd(), this._options.path);
            const distPath = path_1.default.resolve(process.cwd(), this._options.distPath);
            yield make_dir_1.default(distPath);
            const zipPath = path_1.default.resolve(distPath, zipFileName);
            logger.log(`Building ${entry} to ${zipPath}`);
            yield index_js_1.zipDir(entry, zipPath);
            logger.log('Building success!');
            return {
                success: true,
                assets: [zipPath, zipFileName],
                vemo: fs_1.default.existsSync(path_1.default.resolve(entry, 'vemofile.js'))
            };
        });
    }
    clean() {
        return __awaiter(this, void 0, void 0, function* () {
            const distPath = path_1.default.resolve(process.cwd(), this._options.distPath);
            del_1.default.sync([distPath]);
        });
    }
}
exports.default = NodeZipBuilder;
