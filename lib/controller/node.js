"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_ssh = require("node-ssh");
const path = require("path");
const logger_1 = require("../logger");
const logger = new logger_1.default('NodeController');
class NodeController {
    constructor(options) {
        this.ssh = new node_ssh();
        this._options = options;
    }
    async reload() {
        const { host, username, port, password, remotePath, entry } = this._options;
        await this.ssh.connect({ host, username, port, password });
        logger.log('Reloading application...');
        const entryPath = path.resolve(remotePath, entry);
        logger.log(`reload ${entryPath}`);
        const { stdout, stderr } = await this.ssh.execCommand(`pm2 reload ${entryPath}`);
        console.log(stdout);
        this.ssh.dispose();
    }
    start() { }
    stop() { }
    logs() { }
    show() { }
}
exports.default = NodeController;
