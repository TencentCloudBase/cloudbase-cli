"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_ssh_1 = __importDefault(require("node-ssh"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("../logger"));
const logger = new logger_1.default('NodeUploader');
class NodeUploader {
    constructor(options) {
        this.ssh = new node_ssh_1.default();
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
        await this.ssh.putDirectory(path_1.default.resolve(process.cwd(), distPath), remotePath);
        this.ssh.dispose();
    }
}
exports.default = NodeUploader;
