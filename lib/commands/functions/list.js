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
const function_1 = require("../../function");
const utils_1 = require("../../utils");
const StatusMap = {
    Active: '部署完成',
    Creating: '创建中',
    CreateFailed: '创建失败',
    Updating: '更新中',
    UpdateFailed: '更新失败'
};
function list(ctx, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId } = ctx;
        let { limit = 20, offset = 0 } = options;
        limit = Number(limit);
        offset = Number(offset);
        if (!Number.isInteger(limit) || !Number.isInteger(offset)) {
            throw new error_1.CloudBaseError('limit 和 offset 必须为整数');
        }
        if (limit < 0 || offset < 0) {
            throw new error_1.CloudBaseError('limit 和 offset 必须为大于 0 的整数');
        }
        const loading = utils_1.loadingFactory();
        loading.start('加载列表中...');
        const data = yield function_1.listFunction({
            envId,
            limit: Number(limit),
            offset: Number(offset)
        });
        loading.stop();
        const head = ['函数 Id', '函数名称', '运行时', '创建时间', '修改时间', '状态'];
        const tableData = data.map(item => [
            item.FunctionId,
            item.FunctionName,
            item.Runtime,
            item.AddTime,
            item.ModTime,
            StatusMap[item.Status]
        ]);
        utils_1.printHorizontalTable(head, tableData);
    });
}
exports.list = list;
