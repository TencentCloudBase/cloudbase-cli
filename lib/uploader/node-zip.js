"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NodeSSH = require("node-ssh");
const path = require("path");
const logger_1 = require("../logger");
const logger = new logger_1.default('NodeZipUploader');
class NodeUploader {
    constructor(options) {
        this.ssh = new NodeSSH();
        this._options = options;
    }
    async upload() {
        const { host, username, port, password, distPath, remotePath } = this._options;
        logger.log(`Deploying ${distPath} to ${username}@${host}:${remotePath}`);
        await this.ssh.connect({
            host,
            username,
            port,
            password,
        });
        await this.ssh.execCommand(`rm -rf ${remotePath}`);
        await this.ssh.putDirectory(path.resolve(process.cwd(), distPath), remotePath);
        logger.log('Unzip...');
        logger.log(`cd ${distPath} && unzip dist.zip`);
        const { stdout, stderr } = await this.ssh.execCommand(`cd ${remotePath} && unzip dist.zip`);
        if (stderr)
            console.log(stderr);
        this.ssh.dispose();
    }
}
exports.default = NodeUploader;
