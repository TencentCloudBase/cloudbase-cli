"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const tencentcloud_sdk_nodejs_1 = __importDefault(require("../../deps/tencentcloud-sdk-nodejs"));
const error_1 = require("../error");
async function tencentcloudTcbEnvRequest(interfaceName, params) {
    const credential = await utils_1.getCredential();
    const { secretId, secretKey, token } = credential;
    const TcbClient = tencentcloud_sdk_nodejs_1.default.tcb.v20180608.Client;
    const models = tencentcloud_sdk_nodejs_1.default.tcb.v20180608.Models;
    const Credential = tencentcloud_sdk_nodejs_1.default.common.Credential;
    let cred = new Credential(secretId, secretKey, token);
    let client = new TcbClient(cred, 'ap-shanghai');
    let req = new models[`${interfaceName}Request`]();
    const _params = Object.assign({ Region: 'ap-shanghai' }, params);
    req.deserialize(_params);
    return new Promise((resolve, reject) => {
        client[interfaceName](req, (err, response) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(response);
        });
    });
}
async function listEnvs() {
    const res = await tencentcloudTcbEnvRequest('DescribeEnvs');
    const { EnvList = [] } = res;
    const data = [];
    EnvList.forEach(env => {
        const { EnvId, PackageName, Source, CreateTime } = env;
        data.push({
            envId: EnvId,
            packageName: PackageName,
            source: Source,
            createTime: CreateTime
        });
    });
    return data;
}
exports.listEnvs = listEnvs;
async function createEnv({ alias }) {
    const params = {
        Alias: alias,
        EnvId: `${alias}-${utils_1.guid6()}`,
        Source: 'qcloud'
    };
    try {
        const res = await tencentcloudTcbEnvRequest('CreateEnvAndResource', params);
        return res;
    }
    catch (e) {
        throw new error_1.TcbError(`创建环境失败：${e.message}`);
    }
}
exports.createEnv = createEnv;
async function initTcb(skey) {
    console.log(skey);
    const res = await tencentcloudTcbEnvRequest('InitTcb', {
        Skey: skey
    });
    return res;
}
exports.initTcb = initTcb;
