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
exports.createRun = void 0;
const utils_1 = require("../utils");
const tcbService = utils_1.CloudApiService.getInstance('tcb');
const createRun = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { Result } = yield tcbService.request('EstablishCloudBaseRunServer', Object.assign(Object.assign({ EnvId: options.envId, ServiceName: options.name, Remark: options.remark, VpcInfo: options.vpcInfo, LogType: options.logType, IsPublic: options.isPublic }, (options.imageRepo ? { ImageRepo: options.imageRepo } : {})), (options.logType === 'es' ? { EsInfo: options.esInfo } : {})));
    return Result;
});
exports.createRun = createRun;
