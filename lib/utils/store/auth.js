"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
function getAuthDB() {
    const db = db_1.getDB('auth');
    return db;
}
exports.getAuthDB = getAuthDB;
