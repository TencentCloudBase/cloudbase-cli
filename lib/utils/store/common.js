"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
exports.commonStore = new db_1.LocalStore({
    lastNotificationUid: 1,
    lastNotifyTime: 0
});
