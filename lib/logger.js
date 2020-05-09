"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_symbols_1 = __importDefault(require("log-symbols"));
function errorLog(msg) {
    console.log(`${log_symbols_1.default.error} ${msg}`);
}
exports.errorLog = errorLog;
function successLog(msg) {
    console.log(`${log_symbols_1.default.success} ${msg}`);
}
exports.successLog = successLog;
function warnLog(msg) {
    console.log(`${log_symbols_1.default.warning} ${msg}`);
}
exports.warnLog = warnLog;
