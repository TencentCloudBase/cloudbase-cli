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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const error_1 = require("../error");
__export(require("./domain"));
__export(require("./login"));
const tcbService = new utils_1.CloudApiService('tcb');
function initTcb(skey) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield tcbService.request('InitTcb', {
            Skey: skey
        });
        return res;
    });
}
exports.initTcb = initTcb;
function createEnv({ alias }) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = {
            Alias: alias,
            EnvId: `${alias}-${utils_1.random()}`,
            Source: 'qcloud'
        };
        try {
            const res = yield tcbService.request('CreateEnvAndResource', params);
            res.EnvId = params.EnvId;
            return res;
        }
        catch (e) {
            throw new error_1.CloudBaseError(`创建环境失败：${e.message}`);
        }
    });
}
exports.createEnv = createEnv;
function getEnvInfo(envId) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { EnvList } = yield tcbService.request('DescribeEnvs', {
            EnvId: envId
        });
        return ((_a = EnvList) === null || _a === void 0 ? void 0 : _a.length) ? EnvList[0] : {};
    });
}
exports.getEnvInfo = getEnvInfo;
function listEnvs(options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { source } = options;
        const res = yield tcbService.request('DescribeEnvs');
        let { EnvList = [] } = res;
        if (source && Array.isArray(source)) {
            EnvList = EnvList.filter(item => source.includes(item.Source));
        }
        return EnvList;
    });
}
exports.listEnvs = listEnvs;
function updateEnvInfo({ envId, alias }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield tcbService.request('ModifyEnv', {
            EnvId: envId,
            Alias: alias
        });
    });
}
exports.updateEnvInfo = updateEnvInfo;
