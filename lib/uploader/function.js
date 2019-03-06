"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const logger_1 = require("../logger");
const Capi = require("qcloudapi-sdk");
const logger = new logger_1.default('FunctionUploader');
class NodeUploader {
    constructor(options) {
        this._options = options;
        this.capi = new Capi({
            SecretId: options.secretId,
            SecretKey: options.secretKey,
            serviceType: "scf"
        });
    }
    async upload() {
        const { distPath, name, envId } = this._options;
        const base64 = fs.readFileSync(distPath + '/dist.zip').toString('base64');
        const req = {
            Action: 'CreateFunction',
            Region: 'sh',
            code: '@' + base64,
            codeType: 'Zipfile',
            functionName: name,
            handler: 'index.main',
            memorySize: 256,
            namespace: envId,
            role: 'TCB_QcsRole',
            runtime: 'Nodejs8.9',
        };
        logger.log('Uploading serverless function...');
        return new Promise((resolve, reject) => {
            this.capi.request(req, { method: 'POST' }, (err, data) => {
                if (err) {
                    reject(err);
                }
                else if (data.code) {
                    reject(data);
                }
                else {
                    logger.log(`Uploading serverless function`);
                    resolve(data);
                }
            });
        });
    }
}
exports.default = NodeUploader;
