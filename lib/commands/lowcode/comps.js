"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.LowCodePublishComps = exports.LowCodeDebugComps = exports.LowCodeBuilfComps = exports.LowCodeCreateComps = void 0;
const path_1 = __importDefault(require("path"));
const common_1 = require("../common");
const decorators_1 = require("../../decorators");
const utils_1 = require("../../utils");
const error_1 = require("../../error");
const toolbox_1 = require("@cloudbase/toolbox");
const chalk_1 = __importDefault(require("chalk"));
const lowcode_cli_1 = require("@cloudbase/lowcode-cli");
const child_process_1 = require("child_process");
const enquirer_1 = require("enquirer");
const fs_extra_1 = __importDefault(require("fs-extra"));
const cloudService = utils_1.CloudApiService.getInstance('lowcode');
const DEFAULE_TEMPLATE_PATH = 'https://hole-2ggmiaj108259587-1303199938.tcloudbaseapp.com/comps.zip';
const DEFAULT_COMPS_NAME = 'my-components';
let LowCodeCreateComps = class LowCodeCreateComps extends common_1.Command {
    get options() {
        return {
            cmd: 'lowcode',
            childCmd: 'create [name]',
            options: [
                {
                    flags: '--verbose',
                    desc: '是否打印详细日志'
                }
            ],
            desc: '创建组件库',
            requiredEnvId: false
        };
    }
    execute(params, log) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield cloudService.request('ListUserCompositeGroups');
            const comps = res === null || res === void 0 ? void 0 : res.data;
            if (!(comps === null || comps === void 0 ? void 0 : comps.count)) {
                throw new error_1.CloudBaseError('没有可关联的云端组件库，请到低码控制台新建组件库！');
            }
            let compsName = params === null || params === void 0 ? void 0 : params[0];
            if (!compsName) {
                const { selectCompsName } = yield enquirer_1.prompt({
                    type: 'select',
                    name: 'selectCompsName',
                    message: '关联云端组件库:',
                    choices: comps.rows.map((row) => row.groupName)
                });
                compsName = selectCompsName;
            }
            else {
                const comp = comps.rows.find((row) => row.groupName === compsName);
                if (!comp) {
                    throw new error_1.CloudBaseError(`云端不存在组件库 ${compsName}，请到低码控制台新建该组件库！`);
                }
            }
            const compsPath = path_1.default.resolve(process.cwd(), compsName);
            if (fs_extra_1.default.pathExistsSync(compsPath)) {
                throw new error_1.CloudBaseError(`当前目录下已存在组件库 ${compsName} ！`);
            }
            yield _download(compsPath, compsName);
            const installed = yield _install(compsPath);
            if (installed) {
                log.success('组件库 - 创建成功\n');
                log.info(`👉 执行命令 ${chalk_1.default.bold.cyan(`cd ${compsName}`)} 进入文件夹`);
            }
            else {
                log.error('组件库 - 安装依赖失败\n');
                log.info(`👉 执行命令 ${chalk_1.default.bold.cyan(`cd ${compsName}`)} 进入文件夹`);
                log.info(`👉 执行命令 ${chalk_1.default.bold.cyan('npm install')} 手动安装依赖`);
            }
            log.info(`👉 执行命令 ${chalk_1.default.bold.cyan('tcb lowcode debug')} 调试组件库`);
            log.info(`👉 执行命令 ${chalk_1.default.bold.cyan('tcb lowcode publish')} 发布组件库`);
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.ArgsParams()), __param(1, decorators_1.Log()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, decorators_1.Logger]),
    __metadata("design:returntype", Promise)
], LowCodeCreateComps.prototype, "execute", null);
LowCodeCreateComps = __decorate([
    common_1.ICommand()
], LowCodeCreateComps);
exports.LowCodeCreateComps = LowCodeCreateComps;
let LowCodeBuilfComps = class LowCodeBuilfComps extends common_1.Command {
    get options() {
        return {
            cmd: 'lowcode',
            childCmd: 'build',
            options: [
                {
                    flags: '--verbose',
                    desc: '是否打印详细日志'
                }
            ],
            desc: '构建组件库',
            requiredEnvId: false
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const compsPath = path_1.default.resolve(process.cwd());
            yield _build(compsPath);
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LowCodeBuilfComps.prototype, "execute", null);
LowCodeBuilfComps = __decorate([
    common_1.ICommand()
], LowCodeBuilfComps);
exports.LowCodeBuilfComps = LowCodeBuilfComps;
let LowCodeDebugComps = class LowCodeDebugComps extends common_1.Command {
    get options() {
        return {
            cmd: 'lowcode',
            childCmd: 'debug',
            options: [
                {
                    flags: '--verbose',
                    desc: '是否打印详细日志'
                },
                {
                    flags: '--debug-port <debugPort>',
                    desc: '调试端口，默认是8388'
                }
            ],
            desc: '调试组件库',
            requiredEnvId: false
        };
    }
    execute(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const compsPath = path_1.default.resolve(process.cwd());
            yield lowcode_cli_1.debug(compsPath, (options === null || options === void 0 ? void 0 : options.debugPort) || 8388);
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.ArgsOptions()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LowCodeDebugComps.prototype, "execute", null);
LowCodeDebugComps = __decorate([
    common_1.ICommand()
], LowCodeDebugComps);
exports.LowCodeDebugComps = LowCodeDebugComps;
let LowCodePublishComps = class LowCodePublishComps extends common_1.Command {
    get options() {
        return {
            cmd: 'lowcode',
            childCmd: 'publish',
            options: [
                {
                    flags: '--verbose',
                    desc: '是否打印详细日志'
                }
            ],
            desc: '发布组件库',
            requiredEnvId: false
        };
    }
    execute(log) {
        return __awaiter(this, void 0, void 0, function* () {
            const compsPath = path_1.default.resolve(process.cwd());
            const compsName = fs_extra_1.default.readJSONSync(path_1.default.resolve(compsPath, 'package.json')).name;
            const res = yield cloudService.request('ListUserCompositeGroups');
            const comps = res === null || res === void 0 ? void 0 : res.data;
            if (!(comps === null || comps === void 0 ? void 0 : comps.count)) {
                throw new error_1.CloudBaseError(`云端不存在组件库 ${compsName}，请到低码控制台新建该组件库！`);
            }
            const comp = comps.rows.find((row) => row.groupName === compsName);
            if (!comp) {
                throw new error_1.CloudBaseError(`云端不存在组件库 ${compsName}，请到低码控制台新建该组件库！`);
            }
            const { id: compsId } = comp;
            yield _build(compsPath);
            yield _publish(compsPath, compsName, compsId, log);
            log.info('\n👉 组件库已经同步到云端，请到低码控制台发布该组件库！');
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.Log()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [decorators_1.Logger]),
    __metadata("design:returntype", Promise)
], LowCodePublishComps.prototype, "execute", null);
LowCodePublishComps = __decorate([
    common_1.ICommand()
], LowCodePublishComps);
exports.LowCodePublishComps = LowCodePublishComps;
function _download(compsPath, compsName) {
    return __awaiter(this, void 0, void 0, function* () {
        yield utils_1.execWithLoading(() => __awaiter(this, void 0, void 0, function* () {
            yield utils_1.fetchStream(DEFAULE_TEMPLATE_PATH).then((res) => __awaiter(this, void 0, void 0, function* () {
                if (!res) {
                    throw new error_1.CloudBaseError('请求异常');
                }
                if (res.status !== 200) {
                    throw new error_1.CloudBaseError('未找到组件库模板');
                }
                yield toolbox_1.unzipStream(res.body, compsPath);
                _renamePackage(path_1.default.resolve(compsPath, 'package.json'), compsName);
                _renamePackage(path_1.default.resolve(compsPath, 'package-lock.json'), compsName);
            }));
        }), {
            startTip: '组件库 - 下载模板中',
            successTip: '组件库 - 下载模板成功'
        });
    });
}
function _renamePackage(configPath, name) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs_extra_1.default.existsSync(configPath)) {
            throw new error_1.CloudBaseError(`组件库缺少配置文件: ${configPath}`);
        }
        const packageJson = fs_extra_1.default.readJSONSync(configPath);
        const newPackageJson = Object.assign(Object.assign({}, packageJson), { name });
        fs_extra_1.default.writeJSONSync(configPath, newPackageJson, { spaces: 2 });
    });
}
function _install(compsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield utils_1.execWithLoading(() => __awaiter(this, void 0, void 0, function* () {
            const npmOptions = [
                '--prefer-offline',
                '--no-audit',
                '--progress=false',
            ];
            const childProcess = child_process_1.spawn('npm', ['install', ...npmOptions], {
                cwd: compsPath,
                env: process.env,
                stdio: ['inherit', 'pipe', 'pipe'],
            });
            yield promisifyProcess(childProcess);
        }), {
            startTip: '组件库 - 依赖安装中',
            successTip: '组件库 - 依赖安装成功'
        }).then(() => {
            return true;
        }).catch(() => {
            return false;
        });
        return res;
    });
}
function _build(compsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        yield utils_1.execWithLoading(() => __awaiter(this, void 0, void 0, function* () {
            yield lowcode_cli_1.build(compsPath);
        }), {
            startTip: '组件库 - 构建中',
            successTip: '组件库 - 构建成功'
        });
    });
}
function _publish(compsPath, compsName, compsId, log) {
    return __awaiter(this, void 0, void 0, function* () {
        yield utils_1.execWithLoading(() => __awaiter(this, void 0, void 0, function* () {
            yield lowcode_cli_1.publishComps(compsName, compsId, compsPath, log);
        }), {
            startTip: '组件库 - 发布中',
            successTip: '组件库 - 发布成功'
        });
    });
}
function promisifyProcess(p) {
    return new Promise((resolve, reject) => {
        var _a, _b;
        let stdout = '';
        let stderr = '';
        (_a = p === null || p === void 0 ? void 0 : p.stdout) === null || _a === void 0 ? void 0 : _a.on('data', (data => {
            stdout += String(data);
        }));
        (_b = p === null || p === void 0 ? void 0 : p.stderr) === null || _b === void 0 ? void 0 : _b.on('data', (data => {
            stderr += String(data);
        }));
        p.on('error', reject);
        p.on('exit', exitCode => {
            exitCode === 0 ? resolve(stdout) : reject(new error_1.CloudBaseError(stderr || String(exitCode)));
        });
    });
}
