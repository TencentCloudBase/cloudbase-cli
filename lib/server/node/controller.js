"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_ssh_1 = __importDefault(require("node-ssh"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("../../logger"));
const deployer_1 = require("./deployer");
const chalk_1 = __importDefault(require("chalk"));
const logger = new logger_1.default('NodeController');
const GET_VEMO_ENTRY = 'npm run vemo -- main | tail -n 1';
const PM2_OPTIONS = '-o out.log -e err.log';
class NodeController {
    constructor(config) {
        this.config = Object.assign({ username: 'root', port: 22, remotePath: `/data/tcb-service/${config.name}` }, config);
        this.ssh = new node_ssh_1.default();
        this.deployer = new deployer_1.NodeDeployer(this.config);
    }
    async connect() {
        const { host, username, port, password } = this.config;
        await this.ssh.connect({ host, username, port, password });
    }
    async deploy() {
        let { vemo } = await this.deployer.deploy();
        await this.start({ vemo });
    }
    async start({ vemo }) {
        await this.connect();
        await this.installDependencies();
        logger.log('Starting application...');
        const secret = this.injectSecret();
        const { remotePath, name } = this.config;
        await this.ssh.execCommand('pm2 delete all');
        if (vemo) {
            logger.log('start vemo');
            const { stdout, stderr } = await this.ssh.execCommand(secret +
                `pm2 start $(${GET_VEMO_ENTRY}) ${PM2_OPTIONS} --name ${name}`, {
                cwd: remotePath
            });
            console.log(stdout || stderr);
        }
        else {
            const entryPath = path_1.default.posix.resolve(remotePath, 'index.js');
            logger.log(`start ${entryPath}`);
            const { stdout, stderr } = await this.ssh.execCommand(secret + `pm2 start ${entryPath} ${PM2_OPTIONS} --name ${name}`, {
                cwd: remotePath
            });
            console.log(stdout || stderr);
        }
        this.ssh.dispose();
    }
    async installDependencies() {
        const { remotePath } = this.config;
        logger.log('Installing dependencies...');
        await this.ssh.execCommand('rm -rf node_modules', {
            cwd: remotePath
        });
        const installResult = await this.ssh.execCommand('npm install --production', {
            cwd: remotePath
        });
        console.log(installResult.stdout || installResult.stderr);
    }
    injectSecret() {
        const { secretId, secretKey, token } = this.config;
        let authSecret = `export TENCENTCLOUD_SECRETID=${secretId} && export TENCENTCLOUD_SECRETKEY=${secretKey} && `;
        return token
            ? authSecret + `export TENCENTCLOUD_SESSIONTOKEN=${token} && `
            : authSecret;
    }
    async logs({ lines }) {
        await this.connect();
        const { remotePath } = this.config;
        const { stdout: logContent, stderr: logFail } = await this.ssh.execCommand(`tail -n ${lines} out.log`, {
            cwd: remotePath
        });
        const { stdout: errContent, stderr: errFail } = await this.ssh.execCommand(`tail -n ${lines} err.log`, {
            cwd: remotePath
        });
        console.log(chalk_1.default.gray(`${remotePath}/out.log last ${lines} lines:`));
        console.log(logContent || logFail);
        console.log('\n');
        console.log(chalk_1.default.gray(`${remotePath}/err.log last ${lines} lines:`));
        console.log(errContent || errFail);
        this.ssh.dispose();
    }
    async reload() {
        await this.connect();
        const { remotePath, name } = this.config;
        const { stdout, stderr } = await this.ssh.execCommand(`pm2 reload ${name}`, { cwd: remotePath });
        console.log(stdout || stderr);
        this.ssh.dispose();
    }
    async delete() {
        await this.connect();
        const { remotePath, name } = this.config;
        const { stdout, stderr } = await this.ssh.execCommand(`pm2 delete ${name}`, { cwd: remotePath });
        console.log(stdout || stderr);
        this.ssh.dispose();
    }
    async show() {
        await this.connect();
        const { stdout, stderr } = await this.ssh.execCommand('pm2 list');
        console.log(stdout || stderr);
        this.ssh.dispose();
    }
}
exports.NodeController = NodeController;
