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
const utils_1 = require("../../utils");
function queryGwDomain(ctx, commandOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId } = ctx;
        const { domain: domainName } = commandOptions;
        if (!envId && !domainName) {
            throw new error_1.CloudBaseError('请指定需要查询的环境ID或网关域名！');
        }
        const loading = utils_1.loadingFactory();
        loading.start(`查询自定义网关域名中...`);
        try {
            const res = yield gateway_1.queryGatewayDomain({
                envId,
                domain: domainName
            });
            loading.succeed(`查询自定义网关域名成功！`);
            const head = ['CustomDomain', 'CreateTime'];
            const tableData = res.ServiceSet.map(item => [
                item.Domain,
                item.OpenTime
            ]);
            utils_1.printHorizontalTable(head, tableData);
        }
        catch (e) {
            loading.stop();
            throw e;
        }
    });
}
exports.queryGwDomain = queryGwDomain;
