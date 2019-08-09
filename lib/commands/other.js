"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const controller_1 = require("../controller");
const deploy_1 = require("../deploy");
const error_1 = require("../error");
const utils_1 = require("../utils");
function checkDeploys(deploys) {
    const names = {};
    deploys.forEach(d => {
        if (names[d.name]) {
            throw new error_1.TcbError(`Duplicated deploy name: "${d.name}"`);
        }
        names[d.name] = true;
    });
}
async function getDeploys(name) {
    const configPath = path_1.default.join(process.cwd(), 'tcb.json');
    if (!fs_1.default.existsSync(configPath)) {
        throw new error_1.TcbError('未找到 TCB 配置文件：[tcb.json]');
    }
    const tcbConfig = await Promise.resolve().then(() => __importStar(require(configPath)));
    let deploys = tcbConfig.deploys;
    checkDeploys(deploys);
    if (name) {
        deploys = deploys.filter(d => d.name === name);
    }
    return {
        deploys
    };
}
commander_1.default
    .command('deploy [name]')
    .description('执行完整的发布')
    .action(async function (name) {
    const { deploys } = await getDeploys(name);
    const credential = await utils_1.getCredential();
    if (!credential.secretId || !credential.secretKey) {
        throw new error_1.TcbError('你还没有登录，请登录后执行此操作！');
    }
    deploys.forEach(async (deploy) => {
        if (deploy.type === 'node') {
            if (!deploy.path) {
                throw new error_1.TcbError('未指定发布目录');
            }
            await new deploy_1.NodeDeploy(Object.assign({}, credential, deploy)).deploy();
            return;
        }
        if (deploy.type === 'function') {
            await new deploy_1.FunctionDeploy(Object.assign({}, credential, deploy)).deploy();
            return;
        }
        throw new error_1.TcbError(`Unsupported deploy type: "${deploy.type}"`);
    });
});
commander_1.default
    .command('logs <name>')
    .description('查看日志')
    .option('-n <n>', '输出日志的行数')
    .action(async function (name, options) {
    const { deploys: [deploy] } = await getDeploys(name);
    const credential = await utils_1.getCredential();
    if (deploy.type === 'node') {
        await new controller_1.NodeController(Object.assign({}, credential, deploy)).logs({
            lines: options.n || 20
        });
    }
});
commander_1.default
    .command('stop <name>')
    .description('停止应用')
    .action(async function (name) {
    const { deploys: [deploy] } = await getDeploys(name);
    const credential = await utils_1.getCredential();
    if (deploy.type === 'node') {
        await new controller_1.NodeController(Object.assign({}, credential, deploy)).delete();
    }
});
commander_1.default
    .command('show')
    .description('查看状态')
    .action(async function () {
    const credential = await utils_1.getCredential();
    await new controller_1.NodeController(Object.assign({}, credential)).show();
});
commander_1.default
    .command('create <name>')
    .description('创建项目')
    .action(async function (name) {
    fs_extra_1.default.copySync(path_1.default.resolve(__dirname, '../assets/helloworld'), path_1.default.resolve(process.cwd(), name));
});
