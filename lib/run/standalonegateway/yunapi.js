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
const toolbox_1 = require("@cloudbase/toolbox");
const utils_1 = require("../../utils");
const axios_1 = __importDefault(require("axios"));
const error_1 = require("../../error");
function yunapi(action, params) {
    return __awaiter(this, void 0, void 0, function* () {
        let envId = Object.keys(params).indexOf('EnvId') !== -1 ? params['EnvId'] : '';
        let appId = Object.keys(params).indexOf('AppId') !== -1 ? params['AppId'] : '';
        let region = utils_1.CloudApiService.getInstance('tcb').region;
        if (region === undefined)
            region = 'ap-shanghai';
        const credential = yield toolbox_1.getCredentialWithoutCheck();
        const result = yield axios_1.default
            .post('http://11.185.14.226:8081/yun-api/v2', Object.assign({ Action: action, ApiModule: 'tcb', CInfo: {
                Uin: credential.uin,
                Region: utils_1.CloudApiService.getInstance('tcb').region,
                Zone: '',
                EnvId: envId,
                AppId: appId
            }, SubAccountUin: credential.uin, Uin: credential.uin }, params), {
            headers: {
                'Content-Type': 'application/json',
                'cache-control': 'no-cache'
            }
        })
            .catch((error) => {
            throw new error_1.CloudBaseError(error);
        });
        return result.data;
    });
}
exports.default = yunapi;
