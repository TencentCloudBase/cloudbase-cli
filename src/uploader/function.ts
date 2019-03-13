import * as path from 'path'
import * as fs from 'fs'
import Logger from '../logger'
import { IFunctionDeployConfig } from "../deploy/function";
import * as tcloud from '../../deps/tencentcloud-sdk-nodejs'

const logger = new Logger('FunctionUploader')

export default class NodeUploader {
    _options: IFunctionDeployConfig
    constructor(options: IFunctionDeployConfig) {
        this._options = options
    }

    async requestCloudApi(interfaceName, params) {
        const { secretId, secretKey } = this._options
        const { Client: ScfClient, Models: models } = tcloud.scf.v20180416
        const { Credential } = tcloud.common

        const cred = new Credential(secretId, secretKey)
        const client = new ScfClient(cred, "ap-shanghai")
        const req = new models[`${interfaceName}Request`]()

        req.deserialize(params)

        return new Promise((resolve, reject) => {
            client[interfaceName](req, (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    }

    async upload() {

        const { distPath, name, envId, override } = this._options

        const base64 = fs.readFileSync(distPath + '/dist.zip').toString('base64')

        const req = {
            Action: 'CreateFunction',
            Version: '2018-04-16',
            Region: 'ap-shanghai',
            FunctionName: name,
            Code: {
                ZipFile: '@' + base64
            },
            Handler: 'index.main',
            MemorySize: 256,
            Namespace: envId,
            Role: 'TCB_QcsRole',
            Runtime: 'Nodejs8.9',
            InstallDependency: true,
            Stamp: 'MINI_QCBASE'
        }

        logger.log('Uploading serverless function...')

        try {
            return await this.requestCloudApi('CreateFunction', req)
        } catch(e) {
            if (e.code === 'ResourceInUse.FunctionName' && override) {
                return await this.requestCloudApi('UpdateFunctionCode', req)
            } else {
                throw e
            }
        }
    }
}
