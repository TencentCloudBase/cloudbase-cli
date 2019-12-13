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
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../../error");
const gateway_1 = require("../../gateway");
const function_1 = require("../../function");
const utils_1 = require("../../utils");
function createGw(ctx, gatewayPath, commandOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId } = ctx;
        if (!gatewayPath) {
            throw new error_1.CloudBaseError('请指定需要创建的网关路径！');
        }
        const { function: functionName } = commandOptions;
        if (functionName) {
            const loading = utils_1.loadingFactory();
            loading.start(`[${functionName}] 云函数网关创建中...`);
            try {
                const functionList = yield function_1.listFunction({
                    envId,
                    limit: 100
                });
                const isExisted = functionList.filter(item => item.FunctionName === functionName);
                if (isExisted.length <= 0) {
                    throw new error_1.CloudBaseError(`[${functionName}] 云函数不存在！`);
                }
                const res = yield gateway_1.createFunctionGateway({
                    envId,
                    path: gatewayPath,
                    functionName
                });
                loading.succeed(`[${functionName}:${res.APIId}] 云函数网关创建成功！`);
            }
            catch (e) {
                loading.stop();
                throw e;
            }
            return;
        }
        throw new error_1.CloudBaseError('请指定需要创建的网关类型！');
    });
}
exports.createGw = createGw;
