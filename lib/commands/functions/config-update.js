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
function configUpdate(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, envId, functions } = ctx;
        let isBathUpdate = false;
        if (!name) {
            const { isBatch } = yield inquirer_1.default.prompt({
                type: 'confirm',
                name: 'isBatch',
                message: '无云函数名称，是否需要更新配置文件中的【全部云函数】的配置？',
                default: false
            });
            isBathUpdate = isBatch;
            if (!isBathUpdate) {
                throw new error_1.CloudBaseError('请指定云函数名称！');
            }
        }
        if (isBathUpdate) {
            yield function_1.batchUpdateFunctionConfig({
                envId,
                functions,
                log: true
            });
            return;
        }
        const functionItem = functions.find(item => item.name === name);
        if (!functionItem) {
            throw new error_1.CloudBaseError('未找到相关函数配置，请检查函数名是否正确');
        }
        yield function_1.updateFunctionConfig({
            envId,
            functionName: name,
            config: functionItem
        });
        logger_1.successLog(`[${name}] 更新云函数配置成功！`);
    });
}
exports.configUpdate = configUpdate;
