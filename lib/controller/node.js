"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_ssh = require("node-ssh");
const path = require("path");
const logger_1 = require("../logger");
const utils_1 = require("../utils");
const logger = new logger_1.default('NodeController');
const GET_VEMO_ENTRY = 'npm run vemo -- main | tail -n 1';
class NodeController {
    constructor(options) {
        console.log(options);
        this.ssh = new node_ssh();
        this._options = options;
    }
    async reload({ vemo }) {
        const { host, username, port, password, remotePath } = this._options;
        await this.ssh.connect({ host, username, port, password });
        logger.log('Reloading application...');
        const secret = await this.injectSecret();
        if (vemo) {
            logger.log(`reload vemo`);
            const { stdout, stderr } = await this.ssh.execCommand(secret + `pm2 reload $(${GET_VEMO_ENTRY})`, { cwd: remotePath });
            console.log(stdout || stderr);
        }
        else {
            const entryPath = path.resolve(remotePath, 'index.js');
            logger.log(`reload ${entryPath}`);
            const { stdout, stderr } = await this.ssh.execCommand(secret + `pm2 reload ${entryPath}`);
            console.log(stdout || stderr);
        }
        this.ssh.dispose();
    }
    async start({ vemo }) {
        const { host, username, port, password, remotePath } = this._options;
        await this.ssh.connect({ host, username, port, password });
        logger.log('Starting application...');
        const secret = await this.injectSecret();
        if (vemo) {
            logger.log(`start vemo`);
            const { stdout, stderr } = await this.ssh.execCommand(secret + `pm2 start $(${GET_VEMO_ENTRY})`, {
                cwd: remotePath
            });
            console.log(stdout || stderr);
        }
        else {
            const entryPath = path.resolve(remotePath, 'index.js');
            logger.log(`start ${entryPath}`);
            const { stdout, stderr } = await this.ssh.execCommand(secret + `pm2 start ${entryPath}`);
            console.log(stdout || stderr);
        }
        this.ssh.dispose();
    }
    async injectSecret() {
        const { secretId, secretKey } = await utils_1.getSecret();
        return `TENCENTCLOUD_SECRETID=${secretId} TENCENTCLOUD_SECRETKEY=${secretKey} `;
    }
    async stop({ vemo }) {
        const { host, username, port, password, remotePath } = this._options;
        await this.ssh.connect({ host, username, port, password });
        logger.log('Stoping application...');
        if (vemo) {
            await this.ssh.execCommand(`cd ${remotePath}`);
            logger.log(`stop vemo`);
            const { stdout, stderr } = await this.ssh.execCommand(`pm2 stop $(${GET_VEMO_ENTRY})`, { cwd: remotePath });
            console.log(stdout || stderr);
        }
        else {
            const entryPath = path.resolve(remotePath, 'index.js');
            logger.log(`stop ${entryPath}`);
            const { stdout, stderr } = await this.ssh.execCommand(`pm2 stop ${entryPath}`);
            console.log(stdout || stderr);
        }
        this.ssh.dispose();
    }
    async npmInstall() {
        const { host, username, port, password, remotePath } = this._options;
        await this.ssh.connect({ host, username, port, password });
        logger.log('Installing dependencies...');
        const { stdout, stderr } = await this.ssh.execCommand(`cd ${remotePath} && npm i -d`);
        console.log(stdout || stderr);
        this.ssh.dispose();
    }
    logs() { }
    async show() {
        const { host, username, port, password } = this._options;
        await this.ssh.connect({ host, username, port, password });
        const { stdout, stderr } = await this.ssh.execCommand(`pm2 list`);
        console.log(stdout || stderr);
        this.ssh.dispose();
    }
}
exports.default = NodeController;
