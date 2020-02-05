"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const DB_KEY = 'usage';
exports.usageStore = new db_1.LocalStore({
    agreeCollect: false,
    commands: []
}, DB_KEY);
