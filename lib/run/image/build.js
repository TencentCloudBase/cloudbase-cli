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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadZip = exports.createBuild = void 0;
const fs_1 = require("fs");
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
    let body = fs_1.createReadStream(path);
    yield utils_1.fetchStream(url, {
        method: 'PUT',
        headers: {
            Accept: '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7,en-US;q=0.6',
            [headers['Key']]: headers['Value'],
            'Content-Type': 'application/x-zip-compressed'
        },
        body
    });
});
exports.uploadZip = uploadZip;
