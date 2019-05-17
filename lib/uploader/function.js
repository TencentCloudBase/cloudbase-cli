"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const logger_1 = require("../logger");
const tcloud = require("../../deps/tencentcloud-sdk-nodejs");
const logger = new logger_1.default("FunctionUploader");
class NodeUploader {
  constructor(options) {
    this._options = options;
  }
  async requestCloudApi(interfaceName, params) {
    const { secretId, secretKey } = this._options;
    const { Client: ScfClient, Models: models } = tcloud.scf.v20180416;
    const { Credential, HttpProfile } = tcloud.common;
    const cred = new Credential(secretId, secretKey);
    const client = new ScfClient(cred, "ap-shanghai", {
      signMethod: "TC3-HMAC-SHA256",
      httpProfile: new HttpProfile()
    });
    const req = new models[`${interfaceName}Request`]();
    // console.log(params);
    req.deserialize(params);
    return new Promise((resolve, reject) => {
      client[interfaceName](req, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
  async upload() {
    const { distPath, name, envId, override } = this._options;
    console.log(envId);
    const base64 = fs.readFileSync(distPath + "/dist.zip").toString("base64");
    const req = {
      Action: "CreateFunction",
      Version: "2018-04-16",
      Region: "ap-shanghai",
      FunctionName: name,
      Code: {
        ZipFile: base64
      },
      Handler: "index.main",
      // Handler: "index.main_handler",
      MemorySize: 256,
      Namespace: envId,
      Role: "TCB_QcsRole",
      Runtime: "Nodejs8.9",
      // Runtime: "Php7",
      InstallDependency: false,
      Stamp: "MINI_QCBASE"
    };
    logger.log("Uploading serverless function...");
    try {
      return await this.requestCloudApi("CreateFunction", req);
    } catch (e) {
      console.log(e);
      if (e.code === "ResourceInUse.FunctionName" && override) {
        return await this.requestCloudApi("UpdateFunctionCode", req);
      } else {
        throw e;
      }
    }
  }
}
exports.default = NodeUploader;
