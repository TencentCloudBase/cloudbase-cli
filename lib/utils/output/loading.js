"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ora_1 = __importDefault(require("ora"));
function loading(msg, timeout = 300) {
    let spinner;
    let running = false;
    let stopped = false;
    setTimeout(() => {
        if (stopped) {
            return null;
        }
        spinner = ora_1.default(msg);
        spinner.start();
        running = true;
    }, timeout);
    const cancel = () => {
        stopped = true;
        if (running) {
            spinner.stop();
            running = false;
        }
        process.removeListener('tcbExit', cancel);
    };
    process.on('tcbExit', cancel);
    return cancel;
}
exports.loading = loading;
