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
exports.getAuthFlag = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const error_1 = require("../../error");
const getAuthFlag = () => __awaiter(void 0, void 0, void 0, function* () {
    const USER_HOME = process.env.HOME || process.env.USERPROFILE;
    try {
        yield (new Promise((resolve, reject) => fs_1.access(path_1.join(USER_HOME, '.docker/config.json'), fs_1.constants.F_OK, err => err ? reject(false) : resolve(true))));
    }
    catch (e) {
        throw new error_1.CloudBaseError('无法找到~/.docker/config.json文件');
    }
    const data = JSON.parse(fs_1.readFileSync(path_1.join(USER_HOME, '.docker/config.json')).toString());
    console.log();
    return Boolean(data['auths']['ccr.ccs.tencentyun.com']);
});
exports.getAuthFlag = getAuthFlag;
