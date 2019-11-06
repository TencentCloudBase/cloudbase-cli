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
const function_1 = require("../../function");
const logger_1 = require("../../logger");
const error_1 = require("../../error");
function copy(ctx, newFunctionName, targentEnvId, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, envId } = ctx;
        const { force, codeSecret } = options;
        if (!name || !newFunctionName) {
            throw new error_1.CloudBaseError('请指定函数名称！');
        }
        yield function_1.copyFunction({
            force,
            envId,
            codeSecret,
            newFunctionName,
            functionName: name,
            targetEnvId: targentEnvId || envId
        });
        logger_1.successLog('拷贝函数成功');
    });
}
exports.copy = copy;
