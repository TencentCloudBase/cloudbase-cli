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
const inquirer_1 = __importDefault(require("inquirer"));
const error_1 = require("../../error");
const function_1 = require("../../function");
const logger_1 = require("../../logger");
function deleteFunc(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, envId, functions } = ctx;
        let isBatchDelete = false;
        if (!name) {
            const answer = yield inquirer_1.default.prompt({
                type: 'confirm',
                name: 'isBatch',
                message: '无云函数名称，是否需要删除配置文件中的全部云函数？',
                default: false
            });
            if (answer.isBatch) {
                const { reConfirm } = yield inquirer_1.default.prompt({
                    type: 'confirm',
                    name: 'reConfirm',
                    message: '确定要删除配置文件中的全部云函数？',
                    default: false
                });
                isBatchDelete = reConfirm;
            }
            if (!isBatchDelete) {
                throw new error_1.CloudBaseError('请指定需要删除的云函数名称！');
            }
        }
        if (isBatchDelete) {
            const names = functions.map(item => item.name);
            return function_1.batchDeleteFunctions({
                names,
                envId
            });
        }
        yield function_1.deleteFunction({
            envId,
            functionName: name
        });
        logger_1.successLog(`删除函数 [${name}] 成功！`);
    });
}
exports.deleteFunc = deleteFunc;
