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
const logger_1 = require("../logger");
const error_1 = require("../error");
const utils_1 = require("../utils");
const gateway_1 = require("../gateway");
const scfService = utils_1.CloudApiService.getInstance('scf');
function deleteFunction({ functionName, envId }) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield gateway_1.queryGateway({
            envId,
            name: functionName
        });
        if (((_a = res === null || res === void 0 ? void 0 : res.APISet) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            yield gateway_1.deleteGateway({
                envId,
                name: functionName
            });
        }
        yield scfService.request('DeleteFunction', {
            FunctionName: functionName,
            Namespace: envId
        });
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
