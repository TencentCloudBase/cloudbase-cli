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
const utils_1 = require("../../utils");
const third_1 = require("../../third");
function deleteThirdAttach(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const { options } = ctx;
        const { source, thirdAppId } = options;
        let typeFlag;
        if (source === 'qq') {
            typeFlag = 1;
        }
        if (!typeFlag) {
            throw new Error('请指定对应的source');
        }
        const loading = utils_1.loadingFactory();
        loading.start('数据加载中...');
        const data = yield third_1.deleteThirdPartAttach({
            TypeFlag: typeFlag,
            ThirdPartAppid: thirdAppId
        });
        loading.stop();
        console.log(data);
    });
}
exports.deleteThirdAttach = deleteThirdAttach;
