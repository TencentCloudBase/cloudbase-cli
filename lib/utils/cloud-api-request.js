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
exports.CloudApiService = void 0;
const toolbox_1 = require("@cloudbase/toolbox");
const cloud_api_1 = require("@cloudbase/cloud-api");
const error_1 = require("../error");
const tools_1 = require("./tools");
const constant_1 = require("../constant");
let commonCredential;
class CloudApiService {
    constructor(service, baseParams, version = '') {
        this.apiService = new cloud_api_1.CloudApiService({
            service,
            version,
            baseParams,
            proxy: tools_1.getProxy(),
            timeout: constant_1.REQUEST_TIMEOUT,
            getCredential: () => __awaiter(this, void 0, void 0, function* () {
                if (commonCredential === null || commonCredential === void 0 ? void 0 : commonCredential.secretId) {
                    return commonCredential;
                }
                const credential = yield toolbox_1.getCredentialWithoutCheck();
                if (!credential) {
                    throw new error_1.CloudBaseError('无有效身份信息，请使用 cloudbase login 登录');
                }
                commonCredential = credential;
                return credential;
            })
        });
    }
    static getInstance(service) {
        var _a;
        if ((_a = CloudApiService.serviceCacheMap) === null || _a === void 0 ? void 0 : _a[service]) {
            return CloudApiService.serviceCacheMap[service];
        }
        const apiService = new CloudApiService(service);
        CloudApiService.serviceCacheMap[service] = apiService;
        return apiService;
    }
    request(action, data = {}, method = 'POST') {
        return __awaiter(this, void 0, void 0, function* () {
            const region = yield toolbox_1.getRegion();
            return this.apiService.request({ action, data, method, region });
        });
    }
}
exports.CloudApiService = CloudApiService;
CloudApiService.serviceCacheMap = {};
