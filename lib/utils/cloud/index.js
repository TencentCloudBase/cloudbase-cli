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
const store_1 = require("../store");
const url = 'https://tcli.service.tcloudbase.com/notify';
const ONE_DAY = 86400000;
function getNotification() {
    return __awaiter(this, void 0, void 0, function* () {
        const now = Date.now();
        const lastTime = yield store_1.commonStore.get('lastNotifyTime');
        const diff = now - Number(lastTime);
        const day = new Date(lastTime).getDay();
        const today = new Date().getDay();
        if (day === today && diff < ONE_DAY)
            return null;
        const lastUid = yield store_1.commonStore.get('lastNotificationUid');
        const data = yield http_request_1.postFetch(url);
        const uid = (data === null || data === void 0 ? void 0 : data.uid) || 0;
        if (Number(lastUid) >= Number(uid))
            return;
        yield store_1.commonStore.set('readNotificationUid', data.uid);
        yield store_1.commonStore.set('lastNotifyTime', Date.now());
        return data;
    });
}
exports.getNotification = getNotification;
