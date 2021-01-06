"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.smartDeploy = void 0;
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const enquirer_1 = require("enquirer");
const framework_core_1 = require("@cloudbase/framework-core");
const toolbox_1 = require("@cloudbase/toolbox");
const utils_1 = require("../utils");
const Hosting = __importStar(require("../hosting"));
const Function = __importStar(require("../function"));
const auth_1 = require("../auth");
function smartDeploy() {
    return __awaiter(this, void 0, void 0, function* () {
        const loading = utils_1.loadingFactory();
        loading.start('环境检测中');
        yield auth_1.checkLogin();
        yield utils_1.checkTcbService();
        const files = fs_1.default.readdirSync(process.cwd());
        loading.stop();
        const home = os_1.default.homedir();
        const current = process.cwd();
        let relative = current;
        if (current.indexOf(home) > -1) {
            relative = path_1.default.relative(home, current);
        }
        let region = yield toolbox_1.getRegion(true);
        if (!files.length) {
            utils_1.logger.info('当前目录为空，初始化云开发项目\n');
            region = yield utils_1.getSelectRegion();
            const envId = yield utils_1.getSelectedEnv();
            const projectPath = yield utils_1.downloadTemplate();
            yield utils_1.initProjectConfig(envId, region, projectPath);
            utils_1.logger.success('初始化项目成功！\n');
        }
        const { setup } = yield enquirer_1.prompt({
            type: 'confirm',
            name: 'setup',
            message: `是否使用云开发部署当前项目 <${chalk_1.default.bold.cyan(relative)}> ？`,
            initial: true
        });
        if (!setup) {
            return;
        }
        const config = yield utils_1.getCloudBaseConfig();
        let envId = config === null || config === void 0 ? void 0 : config.envId;
        if (!(config === null || config === void 0 ? void 0 : config.region) && !region) {
            region = yield utils_1.getSelectRegion();
        }
        if (!envId) {
            envId = yield utils_1.getSelectedEnv();
            fs_1.default.writeFileSync(path_1.default.join(process.cwd(), 'cloudbaserc.json'), JSON.stringify({
                envId,
                region,
                version: '2.0',
                $schema: 'https://framework-1258016615.tcloudbaseapp.com/schema/latest.json'
            }));
        }
        const parser = new toolbox_1.ConfigParser();
        parser.update('region', region);
        yield callFramework(envId);
    });
}
exports.smartDeploy = smartDeploy;
function callFramework(envId) {
    return __awaiter(this, void 0, void 0, function* () {
        const loginState = yield utils_1.authSupevisor.getLoginState();
        const { token, secretId, secretKey } = loginState;
        const config = yield utils_1.getCloudBaseConfig();
        yield framework_core_1.run({
            projectPath: process.cwd(),
            cloudbaseConfig: {
                secretId,
                secretKey,
                token,
                envId
            },
            config,
            logLevel: process.argv.includes('--verbose') ? 'debug' : 'info',
            resourceProviders: {
                hosting: Hosting,
                function: Function
            }
        }, 'deploy', '');
    });
}
