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
function serviceSwitch(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId } = ctx;
        const loading = utils_1.loadingFactory();
        loading.start('数据加载中...');
        const { EnableService } = yield gateway_1.getHttpServicePrivilege({ envId });
        const status = EnableService ? '已开启' : '已关闭';
        loading.stop();
        const { enable } = yield enquirer_1.prompt({
            type: 'select',
            name: 'enable',
            message: `开启/关闭 HTTP Service 服务（当前状态：${status}）`,
            choices: ['开启', '关闭']
        });
        try {
            loading.start(`HTTP Service 服务${enable}中`);
            yield gateway_1.switchHttpService({
                envId,
                enable: enable === '开启'
            });
            loading.succeed(`HTTP Service 服务${enable}成功！`);
        }
        catch (e) {
            loading.stop();
            throw e;
        }
    });
}
exports.serviceSwitch = serviceSwitch;
function serviceAuthSwitch(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId } = ctx;
        const loading = utils_1.loadingFactory();
        loading.start('数据加载中...');
        const { EnableAuth } = yield gateway_1.getHttpServicePrivilege({ envId });
        const status = EnableAuth ? '已开启' : '已关闭';
        loading.stop();
        const { enable } = yield enquirer_1.prompt({
            type: 'select',
            name: 'enable',
            message: `开启/关闭 HTTP Service 服务访问鉴权（当前状态：${status}）`,
            choices: ['开启', '关闭']
        });
        try {
            loading.start(`HTTP Service 服务访问鉴权${enable}中`);
            yield gateway_1.switchHttpServiceAuth({
                envId,
                enable: enable === '开启'
            });
            loading.succeed(`HTTP Service 服务访问鉴权${enable}成功！`);
        }
        catch (e) {
            loading.stop();
            throw e;
        }
    });
}
exports.serviceAuthSwitch = serviceAuthSwitch;
