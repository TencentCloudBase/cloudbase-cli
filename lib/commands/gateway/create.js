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
function createService(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, options } = ctx;
        const { function: functionName, servicePath } = options;
        if (!servicePath) {
            throw new error_1.CloudBaseError('请指定需要创建的 HTTP Service 路径！');
        }
        if (!functionName) {
            throw new error_1.CloudBaseError('请指定需要创建的 HTTP Service 的云函数名称！');
        }
        const loading = utils_1.loadingFactory();
        loading.start(`[${functionName}] 云函数 HTTP Service 创建中...`);
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
                path: servicePath,
                functionName
            });
            const link = utils_1.genClickableLink(`https://${envId}.service.tcloudbase.com${servicePath}`);
            loading.succeed(`云函数 HTTP Service 创建成功！\n点击访问> ${link}`);
        }
        catch (e) {
            loading.stop();
            if (e.code === 'InvalidParameter.APICreated') {
                throw new error_1.CloudBaseError('路径已存在！');
            }
            throw e;
        }
    });
}
exports.createService = createService;
