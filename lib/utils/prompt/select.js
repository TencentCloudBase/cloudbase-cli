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
exports.pagingSelectPromp = void 0;
const enquirer_1 = require("enquirer");
const error_1 = require("../../error");
const pagingSelectPromp = (type, listFetcher, options, message, filter = _ => true, mapper = item => item) => __awaiter(void 0, void 0, void 0, function* () {
    let res = [];
    let offset = 0;
    let nextRoundList;
    while (true) {
        const thisRoundList = nextRoundList || (yield listFetcher(Object.assign(Object.assign({}, options), { limit: 10, offset: offset }))).filter(filter).map(mapper);
        offset += 10;
        nextRoundList = (yield listFetcher(Object.assign(Object.assign({}, options), { limit: 10, offset: offset }))).filter(filter).map(mapper);
        if (!thisRoundList || !thisRoundList.length)
            throw new error_1.CloudBaseError('列表没有数据');
        if (type === 'select') {
            let receiver = (yield enquirer_1.prompt({
                type: type,
                name: 'receiver',
                message: message,
                choices: (nextRoundList === null || nextRoundList === void 0 ? void 0 : nextRoundList.length) ? [...thisRoundList, '下一页'] : [...thisRoundList]
            })).receiver;
            res = receiver;
            if (receiver !== '下一页')
                break;
        }
        else {
            let { receiver } = yield enquirer_1.prompt({
                type: type,
                name: 'receiver',
                message: message,
                choices: (nextRoundList === null || nextRoundList === void 0 ? void 0 : nextRoundList.length) ? [...thisRoundList, '下一页'] : [...thisRoundList]
            });
            if (!receiver)
                receiver = [];
            res = [...res, ...receiver.filter(item => item !== '下一页')];
            if (receiver.indexOf('下一页') === -1)
                break;
        }
    }
    return res;
});
exports.pagingSelectPromp = pagingSelectPromp;
