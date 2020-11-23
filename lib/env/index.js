"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
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
exports.getEnvLimit = exports.updateEnvInfo = exports.listEnvs = exports.getEnvInfo = exports.createEnv = exports.initTcb = void 0;
const utils_1 = require("../utils");
__exportStar(require("./domain"), exports);
__exportStar(require("./login"), exports);
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
