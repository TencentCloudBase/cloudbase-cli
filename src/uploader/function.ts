import * as path from 'path'
import * as fs from 'fs'
import Logger from '../logger'
import { IFunctionDeployConfig } from "../deploy/function";
import * as Capi from 'qcloudapi-sdk'

const logger = new Logger('FunctionUploader')

export default class NodeUploader {
    capi: any
    _options: IFunctionDeployConfig
    constructor(options: IFunctionDeployConfig) {
        this._options = options
        this.capi = new Capi({
            SecretId: options.secretId,
            SecretKey: options.secretKey,
            serviceType: "scf"
        });
    }

    async upload() {

        const { distPath, name, envId } = this._options

        const base64 = fs.readFileSync(distPath + '/dist.zip').toString('base64')

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
        }

        return new Promise((resolve, reject) => {
            this.capi.request(req, { method: 'POST' }, (err, data) => {
                if (err) {
                    reject(err)
                } else if (data.code) {
                    reject(data)
                } else {
                    resolve(data)
                }
            })
        })
    }
}
