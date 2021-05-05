"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.packDir = exports.uploadZip = exports.createBuild = void 0;
const fs_1 = require("fs");
const https = __importStar(require("https"));
const url_1 = require("url");
const path_1 = require("path");
const compressing_1 = require("compressing");
const utils_1 = require("../../utils");
const tcbService = utils_1.CloudApiService.getInstance('tcb');
const createBuild = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { PackageName, PackageVersion, UploadHeaders, UploadUrl } = yield tcbService.request('DescribeCloudBaseBuildService', {
        EnvId: options.envId,
        ServiceName: options.serviceName,
    });
    return { PackageName, PackageVersion, UploadHeaders, UploadUrl };
});
exports.createBuild = createBuild;
const uploadZip = (path, url, headers) => __awaiter(void 0, void 0, void 0, function* () {
    let parsedUrl = new url_1.URL(url);
    let body = fs_1.createReadStream(path);
    let req = https.request({
        method: 'PUT',
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        headers: {
            Accept: '*/*',
            ['Accept-Encoding']: 'gzip, deflate, br',
            ['Accept-Language']: 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7,en-US;q=0.6',
            [headers['Key']]: headers['Value'],
            ['Content-Type']: 'application/x-zip-compressed'
        }
    });
    body.pipe(req);
    return new Promise(resolve => req.on('finish', () => resolve('end')));
});
exports.uploadZip = uploadZip;
const packDir = (path, resPath) => __awaiter(void 0, void 0, void 0, function* () {
    let files = fs_1.readdirSync(path);
    const zipStream = new compressing_1.zip.Stream();
    files.forEach(item => zipStream.addEntry(path_1.join(path, item)));
    const ws = fs_1.createWriteStream(resPath);
    zipStream.pipe(ws);
    return new Promise(resolve => ws.on('finish', _ => resolve('完成压缩')));
});
exports.packDir = packDir;
