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
const utils_1 = require("../utils");
const logger_1 = require("../logger");
const error_1 = require("../error");
const scfService = new utils_1.CloudApiService('scf');
function deleteFunction({ functionName, envId }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield scfService.request('DeleteFunction', {
                FunctionName: functionName,
                Namespace: envId
            });
        }
        catch (e) {
            throw new error_1.CloudBaseError(`[${functionName}] 删除操作失败：${e.message}！`);
        }
    });
}
exports.deleteFunction = deleteFunction;
function batchDeleteFunctions({ names, envId }) {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = names.map(name => (() => __awaiter(this, void 0, void 0, function* () {
            try {
                yield deleteFunction({ functionName: name, envId });
                logger_1.successLog(`[${name}] 函数删除成功！`);
            }
            catch (e) {
                throw new error_1.CloudBaseError(e.message);
            }
        }))());
        yield Promise.all(promises);
    });
}
exports.batchDeleteFunctions = batchDeleteFunctions;
