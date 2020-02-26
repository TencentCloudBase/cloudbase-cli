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
const archiver_1 = __importDefault(require("archiver"));
function zipDir(dirPath, outputPath, ignore) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const output = fs_1.default.createWriteStream(outputPath);
            const archive = archiver_1.default('zip');
            output.on('close', function () {
                resolve({
                    zipPath: outputPath,
                    size: Math.ceil(archive.pointer() / 1024)
                });
            });
            archive.on('error', function (err) {
                reject(err);
            });
            archive.pipe(output);
            archive.glob('**/*', {
                cwd: dirPath,
                ignore: ignore,
                dot: true
            });
            archive.finalize();
        });
    });
}
exports.zipDir = zipDir;
