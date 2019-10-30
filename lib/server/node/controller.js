"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        let _config = Object.assign({ username: 'root', port: '22', path: '.', distPath: './.tcb-dist', remotePath: `/data/tcb-service/${config.name}` }, config);
        this.config = _config;
        this.ssh = new node_ssh_1.default();
        this.deployer = new deployer_1.NodeDeployer(Object.assign({}, _config));
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const { host, username, port, password } = this.config;
            yield this.ssh.connect({ host, username, port, password });
        });
    }
    deploy() {
        return __awaiter(this, void 0, void 0, function* () {
            let { vemo } = yield this.deployer.deploy();
            yield this.start({ vemo });
        });
    }
    start({ vemo }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect();
            yield this.installDependencies();
            logger.log('Starting application...');
            const secret = this.injectSecret();
            const { remotePath, name } = this.config;
            yield this.ssh.execCommand('pm2 delete all');
            if (vemo) {
                logger.log('start vemo');
                const { stdout, stderr } = yield this.ssh.execCommand(secret +
                    `pm2 start $(${GET_VEMO_ENTRY}) ${PM2_OPTIONS} --name ${name}`, {
                    cwd: remotePath
                });
                console.log(stdout || stderr);
            }
            else {
                const entryPath = path_1.default.posix.resolve(remotePath, 'index.js');
                logger.log(`start ${entryPath}`);
                const { stdout, stderr } = yield this.ssh.execCommand(secret + `pm2 start ${entryPath} ${PM2_OPTIONS} --name ${name}`, {
                    cwd: remotePath
                });
                console.log(stdout || stderr);
            }
            this.ssh.dispose();
        });
    }
    installDependencies() {
        return __awaiter(this, void 0, void 0, function* () {
            const { remotePath } = this.config;
            logger.log('Installing dependencies...');
            yield this.ssh.execCommand('rm -rf node_modules', {
                cwd: remotePath
            });
            const installResult = yield this.ssh.execCommand('npm install --production', {
                cwd: remotePath
            });
            console.log(installResult.stdout || installResult.stderr);
        });
    }
    injectSecret() {
        const { secretId, secretKey, token, envId } = this.config;
        let authSecret = `export TCB_ENV=${envId} && export TENCENTCLOUD_SECRETID=${secretId} && export TENCENTCLOUD_SECRETKEY=${secretKey} && `;
        return token
            ? authSecret + `export TENCENTCLOUD_SESSIONTOKEN=${token} && `
            : authSecret;
    }
    logs({ lines }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect();
            const { remotePath } = this.config;
            const { stdout: logContent, stderr: logFail } = yield this.ssh.execCommand(`tail -n ${lines} out.log`, {
                cwd: remotePath
            });
            const { stdout: errContent, stderr: errFail } = yield this.ssh.execCommand(`tail -n ${lines} err.log`, {
                cwd: remotePath
            });
            console.log(chalk_1.default.gray(`${remotePath}/out.log last ${lines} lines:`));
            console.log(logContent || logFail);
            console.log('\n');
            console.log(chalk_1.default.gray(`${remotePath}/err.log last ${lines} lines:`));
            console.log(errContent || errFail);
            this.ssh.dispose();
        });
    }
    reload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect();
            const { remotePath, name } = this.config;
            const { stdout, stderr } = yield this.ssh.execCommand(`pm2 reload ${name}`, { cwd: remotePath });
            console.log(stdout || stderr);
            this.ssh.dispose();
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect();
            const { remotePath, name } = this.config;
            const { stdout, stderr } = yield this.ssh.execCommand(`pm2 delete ${name}`, { cwd: remotePath });
            console.log(stdout || stderr);
            this.ssh.dispose();
        });
    }
    show() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect();
            const { stdout, stderr } = yield this.ssh.execCommand('pm2 list');
            console.log(stdout || stderr);
            this.ssh.dispose();
        });
    }
}
exports.NodeController = NodeController;
