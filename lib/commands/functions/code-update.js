"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ora_1 = __importDefault(require("ora"));
const path_1 = __importDefault(require("path"));
const error_1 = require("../../error");
const function_1 = require("../../function");
const env_1 = require("../../env");
async function codeUpdate(ctx, options) {
    const { name, envId, config, functions } = ctx;
    const envInfo = await env_1.getEnvInfo(envId);
    if (envInfo.Source === 'miniapp') {
        throw new error_1.CloudBaseError('无法更新小程序云函数代码！');
    }
    const { codeSecret } = options;
    if (!name) {
        throw new error_1.CloudBaseError('请指定函数名称！');
    }
    const func = functions.find(item => item.name === name);
    if (!func || !func.name) {
        throw new error_1.CloudBaseError(`函数 ${name} 配置不存在`);
    }
    const spinner = ora_1.default(`[${func.name}] 函数代码更新中...`).start();
    try {
        await function_1.updateFunctionCode({
            func,
            envId,
            codeSecret,
            functionRootPath: path_1.default.join(process.cwd(), config.functionRoot)
        });
        spinner.succeed(`[${func.name}] 函数代码更新成功！`);
    }
    catch (e) {
        spinner.stop();
        throw e;
    }
}
exports.codeUpdate = codeUpdate;
