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
const lodash_1 = __importDefault(require("lodash"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const error_1 = require("../../error");
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
    exec.on('error', e => {
        console.log(`进程执行异常：${e.message}`);
        setTimeout(() => { }, 100);
    });
    exec.stdout.on('data', data => {
        console.log(`${data}`);
    });
    exec.stderr.on('data', data => {
        console.log(`${data}`);
    });
    exec.on('close', code => {
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
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        const { config, options, envId } = ctx;
        const { params, debug, port } = options;
        params && checkJSON(params);
        let functionPath = path_1.default.resolve(config.functionRoot, name);
        const filePath = path_1.default.resolve(functionPath);
        utils_1.checkFullAccess(filePath, !debug);
        let debugDirname;
        const funcConfig = config.functions.find(item => item.name === name);
        const handlers = (((_a = funcConfig) === null || _a === void 0 ? void 0 : _a.handler) || 'index.main').split('.');
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
            env: Object.assign(Object.assign(Object.assign(Object.assign({}, process.env), { SCF_NAMESPACE: envId, SCF_FUNCTION_HANDLER: ((_b = funcConfig) === null || _b === void 0 ? void 0 : _b.handler) || 'index.main', SCF_FUNCTION_NAME: ((_c = funcConfig) === null || _c === void 0 ? void 0 : _c.name) || 'main', GLOBAL_USER_FILE_PATH: path_1.default.join(debugDirname, path_1.default.sep), SCF_EVENT_BODY: params || JSON.stringify(((_d = funcConfig) === null || _d === void 0 ? void 0 : _d.params) || {}) }), (_e = funcConfig) === null || _e === void 0 ? void 0 : _e.envVariables), secret)
        });
    });
}
exports.debugByConfig = debugByConfig;
