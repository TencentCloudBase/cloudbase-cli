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
const path_1 = __importDefault(require("path"));
const unzipper_1 = __importDefault(require("unzipper"));
const utils_1 = require("../utils");
const scfService = utils_1.CloudApiService.getInstance('scf');
function downloadFunctionCode(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { destPath, envId, functionName, codeSecret, unzip = false } = options;
        utils_1.checkFullAccess(destPath, true);
        const { Url } = yield scfService.request('GetFunctionAddress', {
            FunctionName: functionName,
            Namespace: envId,
            CodeSecret: codeSecret
        });
        const res = yield utils_1.fetchStream(Url);
        const zipPath = path_1.default.join(destPath, `${functionName}.zip`);
        const dest = fs_1.default.createWriteStream(zipPath);
        res.body.pipe(dest);
        return new Promise(resolve => {
            dest.on('close', () => {
                if (!unzip) {
                    resolve();
                    return;
                }
                const unzipStream = unzipper_1.default.Extract({
                    path: destPath
                });
                fs_1.default.createReadStream(zipPath).pipe(unzipStream);
                unzipStream.on('close', () => {
                    utils_1.delSync([zipPath]);
                    resolve();
                });
            });
        });
    });
}
exports.downloadFunctionCode = downloadFunctionCode;
