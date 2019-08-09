"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const tencentcloud_sdk_nodejs_1 = __importDefault(require("../../deps/tencentcloud-sdk-nodejs"));
async function tencentcloudTcbEnvRequest(interfaceName, params) {
    const credential = await utils_1.getCredential();
    const { secretId, secretKey, token } = credential;
    const TcbClient = tencentcloud_sdk_nodejs_1.default.tcb.v20180608.Client;
    const models = tencentcloud_sdk_nodejs_1.default.tcb.v20180608.Models;
    const Credential = tencentcloud_sdk_nodejs_1.default.common.Credential;
    let cred = new Credential(secretId, secretKey, token);
    let client = new TcbClient(cred, 'ap-shanghai');
    let req = new models[`${interfaceName}Request`]();
    const _params = Object.assign({ Region: 'ap-shanghai', Role: 'TCB_QcsRole', Stamp: 'MINI_QCBASE' }, params);
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
