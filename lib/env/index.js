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
__export(require("./domain"));
__export(require("./login"));
const tcbService = utils_1.CloudApiService.getInstance('tcb');
function initTcb(skey) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield tcbService.request('InitTcb', {
            Skey: skey
        });
        return res;
    });
}
exports.initTcb = initTcb;
function createEnv({ alias, paymentMode }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { env } = yield utils_1.getMangerService();
        return env.createEnv({
            paymentMode,
            name: alias
        });
    });
}
exports.createEnv = createEnv;
function getEnvInfo(envId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { EnvList } = yield tcbService.request('DescribeEnvs', {
            EnvId: envId
        });
        return (EnvList === null || EnvList === void 0 ? void 0 : EnvList.length) ? EnvList[0] : {};
    });
}
exports.getEnvInfo = getEnvInfo;
function listEnvs(options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { source } = options;
        const res = yield tcbService.request('DescribeEnvs', {
            IsVisible: false,
            Channels: ['dcloud']
        });
        let { EnvList = [] } = res;
        if (source && Array.isArray(source)) {
            EnvList = EnvList.filter((item) => source.includes(item.Source));
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
function getEnvLimit(source = 'qcloud') {
    return __awaiter(this, void 0, void 0, function* () {
        return tcbService.request('DescribeEnvLimit', {
            Source: source
        });
    });
}
exports.getEnvLimit = getEnvLimit;
