"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const logger_1 = __importDefault(require("../logger"));
const tencentcloud_sdk_nodejs_1 = __importDefault(require("../../deps/tencentcloud-sdk-nodejs"));
const logger = new logger_1.default('FunctionUploader');
class FunctionUploader {
    constructor(options) {
        this._options = options;
    }
    async requestCloudApi(interfaceName, params) {
        const { secretId, secretKey, token } = this._options;
        const { Client: ScfClient, Models: models } = tencentcloud_sdk_nodejs_1.default.scf.v20180416;
        const { Credential } = tencentcloud_sdk_nodejs_1.default.common;
        const cred = new Credential(secretId, secretKey, token);
        const client = new ScfClient(cred, 'ap-shanghai');
        const req = new models[`${interfaceName}Request`]();
        req.deserialize(params);
        return new Promise((resolve, reject) => {
            client[interfaceName](req, (err, res) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
    }
    async upload() {
        const { distPath, name, envId, override } = this._options;
        const base64 = fs_1.default
            .readFileSync(path_1.default.resolve(distPath, 'dist.zip'))
            .toString('base64');
        const req = {
            Action: 'CreateFunction',
            Version: '2018-04-16',
            Region: 'ap-shanghai',
            FunctionName: name,
            Code: {
                ZipFile: base64
            },
            Handler: 'index.main',
            MemorySize: 256,
            Namespace: envId,
            Role: 'TCB_QcsRole',
            Runtime: 'Nodejs8.9',
            InstallDependency: true,
            Stamp: 'MINI_QCBASE'
        };
        logger.log('Uploading serverless function...');
        try {
            return await this.requestCloudApi('CreateFunction', req);
        }
        catch (e) {
            if (e.code === 'ResourceInUse.Function' && override) {
                return await this.requestCloudApi('UpdateFunctionCode', req);
            }
            else {
                throw e;
            }
        }
    }
}
exports.default = FunctionUploader;
