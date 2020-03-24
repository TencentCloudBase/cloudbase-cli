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
function listService(ctx) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, options } = ctx;
        const { domain: domainName, servicePath, serviceId } = options;
        if (!envId && !domainName) {
            throw new error_1.CloudBaseError('请指定需要查询的环境 ID 或 HTTP Service 自定义域名！');
        }
        const loading = utils_1.loadingFactory();
        loading.start('查询 HTTP Service 中...');
        try {
            const res = yield gateway_1.queryGateway({
                envId,
                domain: domainName,
                path: servicePath,
                gatewayId: serviceId
            });
            loading.stop();
            if (((_a = res === null || res === void 0 ? void 0 : res.APISet) === null || _a === void 0 ? void 0 : _a.length) === 0) {
                console.log('HTTP Service 为空');
                return;
            }
            const head = ['Id', 'Path', 'FunctionName', 'CreateTime'];
            const tableData = res.APISet.map(item => [
                item.APIId,
                item.Path,
                item.Name,
                utils_1.formatDate(item.CreateTime * 1000, 'yyyy-MM-dd hh:mm:ss')
            ]);
            utils_1.printHorizontalTable(head, tableData);
        }
        catch (e) {
            loading.stop();
            throw e;
        }
    });
}
exports.listService = listService;
