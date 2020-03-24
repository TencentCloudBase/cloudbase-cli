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
const enquirer_1 = require("enquirer");
const gateway_1 = require("../../gateway");
const utils_1 = require("../../utils");
function deleteService(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, options } = ctx;
        let { servicePath, serviceId, name } = options;
        if (!servicePath && !serviceId && (!name || typeof name !== 'string')) {
            const { APISet: allServices } = yield gateway_1.queryGateway({
                envId
            });
            const { selected } = yield enquirer_1.prompt({
                type: 'select',
                name: 'selected',
                message: '请选择需要删除的 Service',
                choices: allServices.map(item => ({
                    name: `函数名：${item.Name}/路径：${item.Path}`,
                    value: item.APIId
                })),
                result(choices) {
                    return Object.values(this.map(choices));
                }
            });
            serviceId = selected === null || selected === void 0 ? void 0 : selected[0];
        }
        const loading = utils_1.loadingFactory();
        loading.start('HTTP Service 删除中...');
        try {
            yield gateway_1.deleteGateway({
                envId,
                name,
                path: servicePath,
                gatewayId: serviceId
            });
            loading.succeed('HTTP Service 删除成功！');
        }
        catch (e) {
            loading.stop();
            throw e;
        }
    });
}
exports.deleteService = deleteService;
