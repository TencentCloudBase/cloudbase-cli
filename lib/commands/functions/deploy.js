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
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const error_1 = require("../../error");
const function_1 = require("../../function");
const gateway_1 = require("../../gateway");
const utils_1 = require("../../utils");
const constant_1 = require("../../constant");
function printSuccessTips(envId) {
    const link = utils_1.genClickableLink(`https://console.cloud.tencent.com/tcb/scf?envId=${envId}`);
    console.log(`\n控制台查看函数详情或创建 HTTP Service 链接 🔗：${link}`);
    console.log(`\n使用 ${utils_1.highlightCommand('cloudbase functions:list')} 命令查看已部署云函数`);
}
function genApiGateway(envId, name) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const loading = utils_1.loadingFactory();
        const res = yield gateway_1.queryGateway({
            name,
            envId
        });
        if (((_a = res) === null || _a === void 0 ? void 0 : _a.EnableService) === false)
            return;
        loading.start('生成云函数 HTTP Service 中...');
        let path;
        if (((_c = (_b = res) === null || _b === void 0 ? void 0 : _b.APISet) === null || _c === void 0 ? void 0 : _c.length) > 0) {
            path = (_d = res.APISet[0]) === null || _d === void 0 ? void 0 : _d.Path;
        }
        else {
            path = `/${utils_1.random(12)}`;
            yield gateway_1.createGateway({
                envId,
                name,
                path
            });
        }
        loading.stop();
        const link = utils_1.genClickableLink(`https://${envId}.service.tcloudbase.com${path}`);
        console.log(`\n云函数 HTTP Service 链接：${link}`);
    });
}
function deploy(ctx, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, config, options } = ctx;
        const { functions } = config;
        const { force, codeSecret, verbose } = options;
        const functionRootPath = path_1.default.join(process.cwd(), config.functionRoot);
        let isBatchCreating = false;
        if (!name) {
            const { isBatch } = yield inquirer_1.default.prompt({
                type: 'confirm',
                name: 'isBatch',
                message: '没有指定需要部署的云函数，是否部署配置文件中的全部云函数？',
                default: false
            });
            isBatchCreating = isBatch;
            if (!isBatchCreating) {
                throw new error_1.CloudBaseError('请指定需要部署的云函数的名称！');
            }
        }
        if (isBatchCreating) {
            const promises = functions.map(func => (() => __awaiter(this, void 0, void 0, function* () {
                const loading = utils_1.loadingFactory();
                loading.start('云函数部署中');
                try {
                    yield function_1.createFunction({
                        func,
                        envId,
                        force,
                        codeSecret,
                        functionRootPath
                    });
                    loading.succeed(`[${func.name}] 函数部署成功`);
                }
                catch (e) {
                    loading.fail(`[${func.name}] 函数部署失败`);
                    throw new error_1.CloudBaseError(e.message);
                }
            }))());
            yield Promise.all(promises);
            return;
        }
        let newFunction;
        if (functions && functions.length > 0) {
            newFunction = functions.find(item => item.name === name);
        }
        if (!newFunction || !newFunction.name) {
            const { useDefaultConfig } = yield inquirer_1.default.prompt({
                type: 'confirm',
                name: 'useDefaultConfig',
                message: '未找到函数发布配置，是否使用默认配置（仅适用于 Node.js 云函数）',
                default: false
            });
            if (useDefaultConfig) {
                newFunction = Object.assign({ name }, constant_1.DefaultFunctionDeployConfig);
            }
            else {
                throw new error_1.CloudBaseError(`函数 ${name} 配置不存在`);
            }
        }
        const loading = utils_1.loadingFactory();
        loading.start('云函数部署中...');
        try {
            yield function_1.createFunction({
                force,
                envId,
                func: newFunction,
                codeSecret,
                functionRootPath
            });
            loading.succeed(`[${newFunction.name}] 云函数部署成功！`);
            printSuccessTips(envId);
        }
        catch (e) {
            loading.stop();
            if (e.code === 'ResourceInUse.FunctionName') {
                const { force } = yield inquirer_1.default.prompt({
                    type: 'confirm',
                    name: 'force',
                    message: '存在同名云函数，是否覆盖原函数代码与配置',
                    default: false
                });
                if (force) {
                    loading.start('云函数部署中...');
                    try {
                        yield function_1.createFunction({
                            envId,
                            force: true,
                            func: newFunction,
                            codeSecret,
                            functionRootPath
                        });
                        loading.succeed(`[${newFunction.name}] 云函数部署成功！`);
                        printSuccessTips(envId);
                    }
                    catch (e) {
                        loading.stop();
                        throw e;
                    }
                    return;
                }
            }
            throw e;
        }
    });
}
exports.deploy = deploy;
