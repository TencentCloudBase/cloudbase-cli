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
exports.startLocalCIServer = void 0;
const koa_1 = __importDefault(require("koa"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const router_1 = __importDefault(require("@koa/router"));
const cors_1 = __importDefault(require("@koa/cors"));
const path_1 = require("path");
const service_1 = require("./service");
const chalk_1 = __importDefault(require("chalk"));
const os_1 = __importDefault(require("os"));
const WORKSPACE = path_1.resolve(os_1.default.homedir(), 'cloudbase-lowcode/builds');
const SYNC_HISTORY_FLAG = false;
const app = new koa_1.default();
const router = new router_1.default();
const parser = koa_bodyparser_1.default({
    jsonLimit: '5mb'
});
const cors = new cors_1.default();
const builder = new service_1.Builder(path_1.resolve(process.cwd(), WORKSPACE));
const watcher = new service_1.Watcher(path_1.resolve(process.cwd(), WORKSPACE));
router.post('/v1/build', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    watcher.start();
    const params = ctx.request.body;
    const validated = validate(ctx, params, {
        envId: 'string',
        appId: 'string',
    });
    if (validated) {
        const result = yield builder.build(ctx, params);
        const fixedResult = Object.assign(Object.assign({}, result), { ciId: result.buildId });
        ctx.response.body = {
            data: fixedResult,
            errcode: 0
        };
    }
    yield next();
}));
router.post('/v1/checkStatus', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const params = ctx.request.body;
    const fixedParams = params && Object.assign(Object.assign({}, params), { buildId: params.ciId });
    const validated = validate(ctx, fixedParams, {
        envId: 'string',
        appId: 'string',
        ciId: 'string',
        distType: 'object'
    });
    if (validated) {
        const result = yield builder.checkStatusInLocal(ctx, fixedParams);
        ctx.response.body = {
            data: result,
            errcode: 0
        };
    }
    yield next();
}));
router.post('/v1/ping', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    watcher.start();
    ctx.response.body = {
        data: {
            isReady: true,
            syncHistory: SYNC_HISTORY_FLAG
        },
        errcode: 0
    };
    yield next();
}));
router.post('/v1/deployHistory', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const params = ctx.request.body;
    const validated = validate(ctx, params, {
        envId: 'string',
        appId: 'string',
        pageSize: 'number',
        pageIndex: 'number'
    });
    if (validated) {
        const result = yield builder.deployHistory(ctx, params);
        ctx.response.body = {
            data: result,
            errcode: 0
        };
    }
    yield next();
}));
router.post('/v1/deployHistory/detail', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const params = ctx.request.body;
    const validated = validate(ctx, params, {
        envId: 'string',
        appId: 'string',
        idx: 'string'
    });
    if (validated) {
        const result = yield builder.deployDetail(ctx, params);
        ctx.response.body = {
            data: result,
            errcode: 0
        };
    }
    yield next();
}));
app.use(cors);
app.use(parser);
app.use(router.routes());
function startLocalCIServer(port) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const server = app.listen(port);
            server.on('error', (e) => reject(e));
            server.on('close', () => resolve(null));
            console.log(chalk_1.default.green('\n[云开发低码] 成功开启本地构建模式\n'));
        });
    });
}
exports.startLocalCIServer = startLocalCIServer;
function validate(ctx, data, rules) {
    for (const key in rules) {
        if (!data[key]) {
            ctx.response.body = {
                errcode: 1,
                errmsg: `invalid params: ${key} is required !`
            };
            return false;
        }
        else if (typeof data[key] !== rules[key]) {
            ctx.response.body = {
                errcode: 1,
                errmsg: `invalid params: ${key} should be type of ${rules[key]}`
            };
            return false;
        }
    }
    return true;
}
