"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const controller_1 = require("../server/node/controller");
const error_1 = require("../error");
const utils_1 = require("../utils");
function checkServers(servers) {
    const names = {};
    servers.forEach(server => {
        if (!server.name) {
            throw new error_1.TcbError(`Every server must have a name.`);
        }
        else if (!server.path) {
            throw new error_1.TcbError('未指定发布目录');
        }
        else if (server.type != 'node') {
            throw new error_1.TcbError(`Unsupported deploy type: "${server.type}"`);
        }
        else if (names[server.name]) {
            throw new error_1.TcbError(`Duplicated deploy name: "${server.name}"`);
        }
        names[server.name] = true;
    });
}
async function getServers(name) {
    const config = await utils_1.resolveTcbrcConfig();
    if (!config.servers || !Array.isArray(config.servers)) {
        throw new Error('服务配置错误');
    }
    let { servers } = config;
    checkServers(servers);
    return name ? servers.filter(d => d.name === name) : servers;
}
commander_1.default
    .command('server:deploy [name]')
    .description('部署 node 服务')
    .action(async function (name) {
    const servers = await getServers(name);
    const credential = await utils_1.getCredential();
    const sshConfig = await utils_1.getSSH();
    servers.forEach(async (server) => {
        if (!server.path) {
            throw new error_1.TcbError('未指定发布目录');
        }
        await new controller_1.NodeController(Object.assign({}, sshConfig, server, credential)).deploy();
        return;
    });
});
commander_1.default
    .command('server:log <name>')
    .description('查看日志')
    .option('-n, --lines <n>', '输出日志的行数')
    .action(async function (name, options) {
    const servers = await getServers(name);
    const server = servers[0];
    const credential = await utils_1.getCredential();
    const sshConfig = await utils_1.getSSH();
    await new controller_1.NodeController(Object.assign({}, credential, sshConfig, server)).logs({
        lines: options.lines || 20
    });
});
commander_1.default
    .command('server:reload <name>')
    .description('重启 node 服务')
    .action(async function (name) {
    const servers = await getServers(name);
    const server = servers[0];
    const credential = await utils_1.getCredential();
    const sshConfig = await utils_1.getSSH();
    servers.forEach(async (server) => {
        await new controller_1.NodeController(Object.assign({}, sshConfig, server, credential)).reload();
        return;
    });
});
commander_1.default
    .command('server:stop <name>')
    .description('停止应用')
    .action(async function (name) {
    const servers = await getServers(name);
    const server = servers[0];
    const credential = await utils_1.getCredential();
    const sshConfig = await utils_1.getSSH();
    await new controller_1.NodeController(Object.assign({}, credential, sshConfig, server)).delete();
});
commander_1.default
    .command('server:show')
    .description('查看状态')
    .action(async function () {
    const credential = await utils_1.getCredential();
    const sshConfig = await utils_1.getSSH();
    await new controller_1.NodeController(Object.assign({}, credential, sshConfig)).show();
});
