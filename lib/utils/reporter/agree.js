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
const http_request_1 = require("../http-request");
const platform_1 = require("../platform");
const store_1 = require("../store");
const url = 'https://tcli.service.tcloudbase.com/agree-collect';
function collectAgree(agree) {
    return __awaiter(this, void 0, void 0, function* () {
        const uin = yield store_1.getUin();
        const macMd5 = yield platform_1.getMacAddressMd5();
        const os = yield platform_1.getOSInfo();
        const data = {
            macMd5,
            agree,
            uin,
            os
        };
        return http_request_1.postFetch(url, data);
    });
}
exports.collectAgree = collectAgree;
