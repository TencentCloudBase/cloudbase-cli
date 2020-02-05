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
const env_1 = require("../../env");
const utils_1 = require("../../utils");
const error_1 = require("../../error");
const logger_1 = require("../../logger");
function list() {
    return __awaiter(this, void 0, void 0, function* () {
        const loading = utils_1.loadingFactory();
        loading.start('数据加载中...');
        const data = yield env_1.listEnvs();
        loading.stop();
        const head = ['名称', '环境 Id', '套餐版本', '来源', '创建时间', '环境状态'];
        const sortData = data.sort((prev, next) => {
            if (prev.Alias > next.Alias) {
                return 1;
            }
            if (prev.Alias < next.Alias) {
                return -1;
            }
            return 0;
        });
        const tableData = sortData.map(item => [
            item.Alias,
            item.EnvId,
            item.PackageName || '空',
            item.Source === 'miniapp' ? '小程序' : '云开发',
            item.CreateTime,
            item.Status === 'NORMAL' ? '正常' : '不可用'
        ]);
        utils_1.printHorizontalTable(head, tableData);
        const unavailableEnv = data.find(item => item.Status === 'UNAVAILABLE');
        if (unavailableEnv) {
            logger_1.warnLog(`您的环境中存在不可用的环境：[${unavailableEnv.EnvId}]，请留意！`);
        }
    });
}
exports.list = list;
function rename(ctx, name) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!name) {
            throw new error_1.CloudBaseError('环境名称不能为空！');
        }
        yield env_1.updateEnvInfo({
            envId: ctx.envId,
            alias: name
        });
        logger_1.successLog('更新环境名成功 ！');
    });
}
exports.rename = rename;
