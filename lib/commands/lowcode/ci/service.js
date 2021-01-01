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
exports.Watcher = exports.Builder = exports.DEFAULT_RC_CONTENT = void 0;
const child_process_1 = require("child_process");
const chokidar_1 = require("chokidar");
const path_1 = require("path");
const fs_1 = require("fs");
const url_1 = require("url");
const utils_1 = require("../../../utils");
const hosting_1 = require("../../../hosting");
const chalk_1 = __importDefault(require("chalk"));
const toolbox_1 = require("@cloudbase/toolbox");
const lodash_1 = __importDefault(require("lodash"));
const DEFAULT_FRAMEWORK_COMMAND = 'cloudbase framework deploy';
exports.DEFAULT_RC_CONTENT = {
    version: '2.0',
    envId: '{{env.ENV_ID}}',
    $schema: 'https://framework-1258016615.tcloudbaseapp.com/schema/latest.json',
    framework: {
        name: '{{env.APP_NAME}}',
        plugins: {
            lowcode: {
                use: '@cloudbase/framework-plugin-low-code@release',
                inputs: {
                    debug: true,
                },
            },
        },
    },
};
const DEFAULT_FILENAME = {
    RC: 'cloudbaserc.json',
    INPUT: 'input.json',
    STATUS: 'buildstatus.json',
    ENV: '.env',
    QRCODE: 'qrcode.jpg'
};
const BUILD_STATUE = {
    BUILDING: 'building',
    BUILD_FAILED: 'buildFail',
    BUILD_SUCCESS: 'success',
    INSTALL_FAILED: 'fail'
};
const BUILD_TAG = {
    'building': '构建中',
    'buildFail': '构建失败',
    'success': '构建成功'
};
const BUILD_TIME_OUT = 600000;
const tcbService = utils_1.CloudApiService.getInstance('tcb');
const getFileUrl = (path) => url_1.format({ protocol: 'file:', host: path });
const getDotenvStr = (env) => {
    return Object.keys(env).reduce((content, key) => {
        return `${key}=${env[key]}\n${content}`;
    }, '');
};
class Builder {
    constructor(workspace) {
        this._workspace = workspace;
    }
    build(ctx, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { envId, appId } = params;
            const fixedParams = Object.assign(Object.assign({}, params), { mainAppSerializeData: Object.assign(Object.assign({}, JSON.parse(params === null || params === void 0 ? void 0 : params.mainAppSerializeData)), { dataSources: (params === null || params === void 0 ? void 0 : params.datasources) || [] }), datasources: null });
            const buildId = Date.now().toString();
            const env = {
                ENV_ID: envId,
                APP_NAME: `lcap-localbuild-${appId}`,
            };
            yield this._writeFiles(appId, buildId, [
                [DEFAULT_FILENAME.INPUT, JSON.stringify(fixedParams, null, 4)],
                [DEFAULT_FILENAME.ENV, getDotenvStr(env)],
                [DEFAULT_FILENAME.RC, JSON.stringify(exports.DEFAULT_RC_CONTENT, null, 4)]
            ]);
            return {
                buildId
            };
        });
    }
    _writeFiles(appId, buildId, contents) {
        return __awaiter(this, void 0, void 0, function* () {
            const buildPath = path_1.resolve(this._workspace, appId, buildId);
            fs_1.mkdirSync(buildPath, { recursive: true });
            contents.forEach(content => {
                fs_1.writeFileSync(path_1.resolve(buildPath, content[0]), content[1]);
            });
        });
    }
    checkStatusInLocal(ctx, params) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { buildId, appId } = params;
            const buildPath = path_1.resolve(this._workspace, appId, buildId);
            const statusPath = path_1.resolve(buildPath, DEFAULT_FILENAME.STATUS);
            const inputsPath = path_1.resolve(buildPath, DEFAULT_FILENAME.INPUT);
            const isTimeOut = (Date.now() - parseInt(buildId, 10) >= BUILD_TIME_OUT);
            if (!utils_1.checkFullAccess(buildPath)) {
                return {
                    status: BUILD_STATUE.INSTALL_FAILED
                };
            }
            if (!utils_1.checkFullAccess(statusPath)) {
                return {
                    status: isTimeOut ?
                        BUILD_STATUE.INSTALL_FAILED :
                        BUILD_STATUE.BUILDING
                };
            }
            const status = (_a = getContent(statusPath)) === null || _a === void 0 ? void 0 : _a.status;
            const inputs = getContent(inputsPath);
            if (!status || !inputs) {
                return {
                    status: BUILD_STATUE.INSTALL_FAILED
                };
            }
            switch (status) {
                case BUILD_STATUE.BUILDING: {
                    return {
                        status: isTimeOut ?
                            BUILD_STATUE.INSTALL_FAILED :
                            BUILD_STATUE.BUILDING
                    };
                }
                case BUILD_STATUE.BUILD_FAILED: {
                    return { status };
                }
                case BUILD_STATUE.BUILD_SUCCESS: {
                    const allDist = yield this._getAllDist(params, inputs);
                    return Object.assign({ status }, allDist);
                }
                default: {
                    return {
                        status: BUILD_STATUE.INSTALL_FAILED
                    };
                }
            }
        });
    }
    _getAllDist(params, inputs) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const allDist = {};
            const { buildId, distType, appId } = params;
            const { envId, deployOptions: { mode } } = inputs;
            if (distType.includes('qrcode')) {
                const qrcodePath = path_1.resolve(this._workspace, appId, buildId, DEFAULT_FILENAME.QRCODE);
                if (utils_1.checkFullAccess(qrcodePath)) {
                    const base64 = fs_1.readFileSync(qrcodePath, { encoding: 'base64' });
                    allDist['qrcode'] = `data:image/jpg;base64,${base64}`;
                }
            }
            if (distType.includes('web')) {
                yield utils_1.checkAndGetCredential();
                const hostings = yield hosting_1.getHostingInfo({ envId });
                const website = (_a = hostings === null || hostings === void 0 ? void 0 : hostings.data) === null || _a === void 0 ? void 0 : _a[0];
                if (website) {
                    const rootPath = getWebRootPath(appId, mode);
                    allDist['web'] = `https://${path_1.join(website.cdnDomain, rootPath)}`;
                }
            }
            if (distType.includes('dist')) {
                const distPath = path_1.resolve(this._workspace, appId, buildId, 'dist');
                const distZipPath = path_1.resolve(this._workspace, appId, buildId, 'dist.zip');
                if (utils_1.checkFullAccess(distZipPath)) {
                    allDist['dist'] = getFileUrl(distZipPath);
                }
                else if (utils_1.checkFullAccess(distPath)) {
                    yield utils_1.zipDir(distPath, distZipPath);
                    allDist['dist'] = getFileUrl(distZipPath);
                }
            }
            return allDist;
        });
    }
    deployHistory(ctx, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { appId, pageIndex = 1, pageSize = 10 } = params;
            const appPath = path_1.resolve(this._workspace, appId);
            if (!utils_1.checkFullAccess(appPath)) {
                ctx.throw(404, `unknown appId: ${appId}`);
            }
            const historyPaths = fs_1.readdirSync(appPath).filter(path => {
                if (!toolbox_1.isDirectorySync(path_1.resolve(appPath, path))) {
                    return false;
                }
                if (!utils_1.checkFullAccess(path_1.resolve(appPath, path, DEFAULT_FILENAME.STATUS))) {
                    return false;
                }
                if (!/[0-9]{13}/.test(path)) {
                    return false;
                }
                return true;
            }).reverse();
            const startIndex = pageSize * (pageIndex - 1);
            const endIndex = pageSize * pageIndex - 1;
            const history = yield Promise.all(historyPaths.slice(startIndex, endIndex + 1).map((path) => __awaiter(this, void 0, void 0, function* () {
                const result = yield this.checkStatusInLocal(ctx, {
                    appId,
                    buildId: path,
                    distType: ['qrcode', 'web', 'dist'],
                }).catch(e => {
                    return { status: BUILD_STATUE.BUILDING };
                });
                return {
                    appId,
                    idx: path,
                    ciId: path,
                    createdAt: path,
                    status: result.status,
                    preview: lodash_1.default.pick(result, 'web', 'qrcode', 'dist')
                };
            })));
            return {
                count: history.length,
                rows: history
            };
        });
    }
    deployDetail(ctx, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idx, appId } = params;
            const result = yield this.checkStatusInLocal(ctx, {
                buildId: idx,
                distType: ['web', 'qrcode', 'dist'],
                appId
            });
            return {
                appId,
                idx,
                ciId: idx,
                createdAt: idx,
                status: result.status,
                preview: lodash_1.default.pick(result, 'web', 'qrcode', 'dist')
            };
        });
    }
}
exports.Builder = Builder;
class Watcher {
    constructor(workspace) {
        this._workspace = workspace;
    }
    start() {
        if (this._watcher) {
            return;
        }
        if (!utils_1.checkFullAccess(this._workspace)) {
            fs_1.mkdirSync(this._workspace, { recursive: true });
        }
        this._watcher = chokidar_1.watch(this._workspace, { ignoreInitial: true }).on('all', (eventName, path) => __awaiter(this, void 0, void 0, function* () {
            switch (eventName) {
                case 'add':
                case 'change': {
                    const parse = path_1.parse(path);
                    if (parse.base === 'cloudbaserc.json' &&
                        !utils_1.checkFullAccess(path_1.resolve(parse.dir, DEFAULT_FILENAME.STATUS))) {
                        this._setStatus(parse.dir, BUILD_STATUE.BUILDING);
                        yield this._callFramework(parse.dir).then(() => {
                            this._setStatus(parse.dir, BUILD_STATUE.BUILD_SUCCESS);
                        }).catch(() => {
                            this._setStatus(parse.dir, BUILD_STATUE.BUILD_FAILED);
                        });
                    }
                    break;
                }
                default: {
                    break;
                }
            }
        }));
    }
    _callFramework(projectPath, command = DEFAULT_FRAMEWORK_COMMAND) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var _a, _b;
                const cmd = child_process_1.exec(command, {
                    cwd: projectPath,
                    env: Object.assign({ CI: 'true' }, process.env)
                });
                (_a = cmd.stdout) === null || _a === void 0 ? void 0 : _a.pipe(process.stdout);
                (_b = cmd.stderr) === null || _b === void 0 ? void 0 : _b.pipe(process.stderr);
                cmd.on('exit', (code) => {
                    if (code === 0) {
                        resolve(code);
                    }
                    else {
                        reject(code);
                    }
                });
            });
        });
    }
    _setStatus(path, status) {
        const statusPath = path_1.resolve(path, DEFAULT_FILENAME.STATUS);
        const content = JSON.stringify({ status }, null, 4);
        fs_1.writeFileSync(statusPath, content, { encoding: 'utf8' });
        const buildId = path_1.parse(path).name;
        const appId = path_1.parse(path_1.resolve(path, '..')).name;
        console.log(chalk_1.default.green(`\n[云开发低码] 低码应用${BUILD_TAG[status]} [ appId:${appId}, buildId:${buildId} ]\n`));
    }
    _clean(path) {
        fs_1.unlinkSync(path_1.resolve(path, DEFAULT_FILENAME.INPUT));
        fs_1.unlinkSync(path_1.resolve(path, DEFAULT_FILENAME.ENV));
        fs_1.unlinkSync(path_1.resolve(path, DEFAULT_FILENAME.RC));
    }
    end() {
        var _a;
        (_a = this._watcher) === null || _a === void 0 ? void 0 : _a.close();
    }
}
exports.Watcher = Watcher;
function getWebRootPath(appId, mode) {
    return mode === 'preview'
        ? `/${appId}/preview/`
        : `/${appId}/production/`;
}
function getContent(path) {
    try {
        utils_1.checkFullAccess(path, true);
        const rawData = fs_1.readFileSync(path, 'utf8');
        return JSON.parse(rawData);
    }
    catch (e) {
        return;
    }
}
