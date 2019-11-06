"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const controller_1 = require("../server/node/controller");
const error_1 = require("../error");
const utils_1 = require("../utils");
const types_1 = require("../types");
function checkServers(servers) {
    const names = {};
    servers.forEach((server) => {
        if (!server.name) {
            throw new error_1.CloudBaseError('Every server must have a name.');
        }
        else if (!server.path) {
            throw new error_1.CloudBaseError('未指定发布目录');
        }
        else if (server.type != types_1.ServerLanguageType.node) {
            throw new error_1.CloudBaseError(`Unsupported deploy type: "${server.type}"`);
        }
        else if (names[server.name]) {
            throw new error_1.CloudBaseError(`Duplicated deploy name: "${server.name}"`);
        }
        names[server.name] = true;
    });
}
function getServers(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = yield utils_1.resolveCloudBaseConfig();
        if (!config.servers || !Array.isArray(config.servers)) {
            throw new Error('服务配置错误');
        }
        let { servers } = config;
        checkServers(servers);
        return name ? servers.filter(d => d.name === name) : servers;
    });
}
commander_1.default
    .command('server:deploy [name]')
    .description('部署 node 服务')
    .action(function (name) {
    return __awaiter(this, void 0, void 0, function* () {
        const servers = yield getServers(name);
        const envId = yield utils_1.getEnvId('');
        const credential = yield utils_1.checkAndGetCredential();
        const sshConfig = yield utils_1.getSSH();
        servers.forEach((server) => __awaiter(this, void 0, void 0, function* () {
            if (!server.path) {
                throw new error_1.CloudBaseError('未指定发布目录');
            }
            yield new controller_1.NodeController(Object.assign(Object.assign(Object.assign({ envId }, sshConfig), server), credential)).deploy();
            return;
        }));
    });
});
commander_1.default
    .command('server:log <name>')
    .description('查看日志')
    .option('-n, --lines <n>', '输出日志的行数')
    .action(function (name, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const servers = yield getServers(name);
        const server = servers[0];
        const credential = yield utils_1.checkAndGetCredential();
        const sshConfig = yield utils_1.getSSH();
        yield new controller_1.NodeController(Object.assign(Object.assign(Object.assign({}, credential), sshConfig), server)).logs({
            lines: options.lines || 20
        });
    });
});
commander_1.default
    .command('server:reload <name>')
    .description('重启 node 服务')
    .action(function (name) {
    return __awaiter(this, void 0, void 0, function* () {
        const servers = yield getServers(name);
        const server = servers[0];
        const credential = yield utils_1.checkAndGetCredential();
        const sshConfig = yield utils_1.getSSH();
        yield new controller_1.NodeController(Object.assign(Object.assign(Object.assign({}, sshConfig), server), credential)).reload();
        return;
    });
});
commander_1.default
    .command('server:stop <name>')
    .description('停止应用')
    .action(function (name) {
    return __awaiter(this, void 0, void 0, function* () {
        const servers = yield getServers(name);
        const server = servers[0];
        const credential = yield utils_1.checkAndGetCredential();
        const sshConfig = yield utils_1.getSSH();
        yield new controller_1.NodeController(Object.assign(Object.assign(Object.assign({}, credential), sshConfig), server)).delete();
    });
});
commander_1.default
    .command('server:show')
    .description('查看状态')
    .action(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const credential = yield utils_1.checkAndGetCredential();
        const sshConfig = yield utils_1.getSSH();
        yield new controller_1.NodeController(Object.assign(Object.assign({}, credential), sshConfig)).show();
    });
});
