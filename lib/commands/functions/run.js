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
const lodash_1 = __importDefault(require("lodash"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const common_1 = require("../common");
const error_1 = require("../../error");
const decorators_1 = require("../../decorators");
const utils_1 = require("../../utils");
const bootstrapFilePath = path_1.default.join(__dirname, '../../../runtime/nodejs/bootstrap.js');
function checkJSON(data) {
    try {
        JSON.parse(data);
    }
    catch (e) {
        throw new error_1.CloudBaseError('非法的 JSON 字符串');
    }
}
function errorLog(msg, debug) {
    throw new error_1.CloudBaseError(msg, {
        meta: { debug }
    });
}
function getDebugArgs(port = 9229) {
    return [
        `--inspect-brk=0.0.0.0:${port}`,
        '--nolazy',
        '--expose-gc',
        '--max-semi-space-size=150',
        '--max-old-space-size=2707'
    ];
}
function spawnNodeProcess(args, options) {
    const commonOptions = {
        cwd: path_1.default.dirname(bootstrapFilePath),
        windowsHide: true
    };
    const exec = child_process_1.spawn('node', args, Object.assign(Object.assign({}, commonOptions), options));
    exec.on('error', (e) => {
        console.log(`进程执行异常：${e.message}`);
        setTimeout(() => { }, 100);
    });
    exec.stdout.on('data', (data) => {
        console.log(`${data}`);
    });
    exec.stderr.on('data', (data) => {
        console.log(`${data}`);
    });
    exec.on('close', (code) => {
        if (code !== 0) {
            console.log(`\n云函数执行异常退出，错误码：${code}`);
        }
    });
}
function getSecret() {
    return __awaiter(this, void 0, void 0, function* () {
        const credential = yield utils_1.checkAndGetCredential();
        if (lodash_1.default.isEmpty(credential)) {
            console.log('未登录，无法直接调用 Node SDK');
            return {};
        }
        const { secretId, secretKey, token } = credential;
        return {
            TENCENTCLOUD_SECRETID: secretId,
            TENCENTCLOUD_SECRETKEY: secretKey,
            TENCENTCLOUD_SESSIONTOKEN: token
        };
    });
}
function debugFunctionByPath(functionPath, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { params, debug, port } = options;
        params && checkJSON(params);
        const filePath = path_1.default.resolve(functionPath);
        utils_1.checkFullAccess(filePath);
        let debugDirname;
        const isDir = utils_1.isDirectory(filePath);
        if (isDir) {
            const exists = utils_1.checkFullAccess(path_1.default.join(filePath, 'index.js'));
            if (!exists) {
                errorLog('index.js 文件不存在！', debug);
            }
            debugDirname = filePath;
        }
        else {
            const { base, dir } = path_1.default.parse(filePath);
            if (base !== 'index.js') {
                errorLog('index.js 文件不存在！', debug);
            }
            debugDirname = dir;
        }
        try {
            const fileExports = require(path_1.default.join(debugDirname, 'index.js'));
            if (!fileExports.main) {
                errorLog('main 方法不存在！', debug);
            }
        }
        catch (e) {
            errorLog(`导入云函数异常：${e.message}`, debug);
        }
        const secret = yield getSecret();
        const debugArgs = getDebugArgs(port);
        const args = debug ? [...debugArgs, bootstrapFilePath] : [bootstrapFilePath];
        console.log('> 以默认配置启动 Node 云函数调试');
        spawnNodeProcess(args, {
            env: Object.assign(Object.assign(Object.assign({}, process.env), { SCF_FUNCTION_HANDLER: 'index.main', SCF_FUNCTION_NAME: 'main', GLOBAL_USER_FILE_PATH: path_1.default.join(debugDirname, path_1.default.sep), SCF_EVENT_BODY: params || '{}' }), secret)
        });
    });
}
exports.debugFunctionByPath = debugFunctionByPath;
function debugByConfig(ctx, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const { config, options, envId } = ctx;
        const { params, debug, port } = options;
        params && checkJSON(params);
        let functionPath = path_1.default.resolve(config.functionRoot, name);
        const filePath = path_1.default.resolve(functionPath);
        utils_1.checkFullAccess(filePath, !debug);
        let debugDirname;
        const funcConfig = config.functions.find((item) => item.name === name);
        const handlers = ((funcConfig === null || funcConfig === void 0 ? void 0 : funcConfig.handler) || 'index.main').split('.');
        const indexFileName = handlers[0];
        const indexFile = `${indexFileName}.js`;
        const mainFunction = handlers[1];
        const isDir = utils_1.isDirectory(filePath);
        if (isDir) {
            const exists = utils_1.checkFullAccess(path_1.default.join(filePath, indexFile));
            if (!exists) {
                errorLog(`${indexFile} 文件不存在！`, debug);
            }
            debugDirname = filePath;
        }
        else {
            const { base, dir } = path_1.default.parse(filePath);
            if (base !== indexFile) {
                errorLog(`${indexFile} 文件不存在！`, debug);
            }
            debugDirname = dir;
        }
        try {
            const fileExports = require(path_1.default.join(debugDirname, indexFile));
            if (!fileExports[mainFunction]) {
                errorLog(`handler 中的 ${mainFunction} 方法不存在，请检查你的配置！`, debug);
            }
        }
        catch (e) {
            errorLog(`导入云函数异常:${e.message}`, debug);
        }
        const secret = yield getSecret();
        const debugArgs = getDebugArgs(port);
        const args = debug ? [...debugArgs, bootstrapFilePath] : [bootstrapFilePath];
        spawnNodeProcess(args, {
            env: Object.assign(Object.assign(Object.assign(Object.assign({}, process.env), { SCF_NAMESPACE: envId, SCF_FUNCTION_HANDLER: (funcConfig === null || funcConfig === void 0 ? void 0 : funcConfig.handler) || 'index.main', SCF_FUNCTION_NAME: (funcConfig === null || funcConfig === void 0 ? void 0 : funcConfig.name) || 'main', GLOBAL_USER_FILE_PATH: path_1.default.join(debugDirname, path_1.default.sep), SCF_EVENT_BODY: params || JSON.stringify((funcConfig === null || funcConfig === void 0 ? void 0 : funcConfig.params) || {}) }), funcConfig === null || funcConfig === void 0 ? void 0 : funcConfig.envVariables), secret)
        });
    });
}
exports.debugByConfig = debugByConfig;
let FunctionDebug = class FunctionDebug extends common_1.Command {
    get options() {
        return {
            cmd: 'functions:run',
            options: [
                {
                    flags: '--path <path>',
                    desc: '云函数路径，使用默认配置直接调用云函数，无需配置文件'
                },
                {
                    flags: '--name <name>',
                    desc: '指定云函数的名称进行调用，需要配置文件'
                },
                {
                    flags: '--params <params>',
                    desc: '调用函数传入的参数，JSON 字符串格式'
                },
                {
                    flags: '--port <port>',
                    desc: '启动调试时监听的端口号，默认为 9229'
                },
                {
                    flags: '--debug',
                    desc: '启动调试模式'
                }
            ],
            desc: '本地运行云函数（当前仅支持 Node）'
        };
    }
    execute(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { options } = ctx;
            const { path, name } = options;
            if (path) {
                yield debugFunctionByPath(path, options);
            }
            else if (typeof name === 'string') {
                yield debugByConfig(ctx, name);
            }
            else {
                throw new error_1.CloudBaseError('请指定运行函数的名称或函数的路径\n\n例如 cloudbase functions:run --name app');
            }
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.CmdContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FunctionDebug.prototype, "execute", null);
FunctionDebug = __decorate([
    common_1.ICommand()
], FunctionDebug);
exports.FunctionDebug = FunctionDebug;
