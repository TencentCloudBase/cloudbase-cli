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
const logger = new logger_1.default('NodeZipUploader');
class NodeUploader {
    constructor(options) {
        this.ssh = new node_ssh_1.default();
        this._options = options;
    }
    upload(zipFileName = 'dist.zip') {
        return __awaiter(this, void 0, void 0, function* () {
            const { host, username, port, password, distPath, remotePath } = this._options;
            logger.log(`Deploying ${distPath} to ${username}@${host}:${remotePath}`);
            yield this.ssh.connect({
                host,
                username,
                port,
                password
            });
            yield this.ssh.execCommand(`rm -rf ${remotePath}`);
            yield this.ssh.putDirectory(path_1.default.resolve(process.cwd(), distPath), remotePath);
            let command = `cd ${remotePath} && unzip ${zipFileName} && rm ${zipFileName}`;
            logger.log('Unzip...');
            logger.log(command);
            const { stderr } = yield this.ssh.execCommand(command);
            if (stderr)
                console.log(stderr);
            this.ssh.dispose();
        });
    }
}
exports.default = NodeUploader;
