"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
class Logger {
    constructor(moduleName) {
        this.moduleName = moduleName;
    }
    log(msg) {
        if (!this.moduleName) {
            console.log(msg);
        }
        else {
            console.log(chalk_1.default.blue('[' + this.moduleName + ']') + ` ${msg}`);
        }
    }
}
exports.default = Logger;
