"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_ssh = require("node-ssh");
const path = require("path");
const logger_1 = require("../logger");
const logger = new logger_1.default('NodeUploader');
class NodeUploader {
    constructor(options) {
        this.ssh = new node_ssh();
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
        this.ssh.dispose();
    }
}
exports.default = NodeUploader;
