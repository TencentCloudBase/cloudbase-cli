"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const error_1 = require("../error");
const utils_2 = require("../utils");
__export(require("./domain"));
const tcbService = new utils_2.BaseHTTPService('tcb', '2018-06-08');
async function initTcb(skey) {
    const res = await tcbService.request('InitTcb', {
        Skey: skey
    });
    return res;
}
exports.initTcb = initTcb;
async function createEnv({ alias }) {
    const params = {
        Alias: alias,
        EnvId: `${alias}-${utils_1.guid6()}`,
        Source: 'qcloud'
    };
    try {
        const res = await tcbService.request('CreateEnvAndResource', params);
        res.EnvId = params.EnvId;
        return res;
    }
    catch (e) {
        throw new error_1.TcbError(`创建环境失败：${e.message}`);
    }
}
exports.createEnv = createEnv;
async function getEnvInfo(envId) {
    const { EnvList } = await tcbService.request('DescribeEnvs', {
        EnvId: envId
    });
    return EnvList && EnvList.length ? EnvList[0] : {};
}
exports.getEnvInfo = getEnvInfo;
async function listEnvs() {
    const res = await tcbService.request('DescribeEnvs');
    const { EnvList = [] } = res;
    const data = [];
    EnvList.forEach(env => {
        const { EnvId, PackageName, Source, CreateTime, Status } = env;
        data.push({
            envId: EnvId,
            packageName: PackageName,
            source: Source,
            status: Status,
            createTime: CreateTime
        });
    });
    return data;
}
exports.listEnvs = listEnvs;
