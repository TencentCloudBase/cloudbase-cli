"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const log_symbols_1 = __importDefault(require("log-symbols"));
class Logger {
    constructor(moduleName) {
        this.moduleName = moduleName;
    }
    genLog(level, msg) {
        const LevelColorMap = {
            info: 'blue',
            error: 'red',
            success: 'green'
        };
        return [
            log_symbols_1.default[level],
            chalk_1.default[LevelColorMap[level]](`[${this.moduleName}]`),
            msg
        ].join(' ');
    }
    log(msg) {
        if (!this.moduleName) {
            console.log(`${log_symbols_1.default.info} ${msg}`);
        }
        else {
            console.log(this.genLog('info', msg));
        }
    }
    success(msg) {
        if (!this.moduleName) {
            console.log(`${log_symbols_1.default.success} ${msg}`);
        }
        else {
            console.log(this.genLog('success', msg));
        }
    }
    error(msg) {
        if (!this.moduleName) {
            console.log(`${log_symbols_1.default.error} ${msg}`);
        }
        else {
            console.log(this.genLog('error', msg));
        }
    }
}
exports.default = Logger;
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
