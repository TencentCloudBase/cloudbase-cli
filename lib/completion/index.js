"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../constant");
function handleCompletion({ reply, line }) {
    const cmd = line.replace(/^cloudbase\s|^tcb\s/, '');
    const commands = constant_1.ALL_COMMANDS.filter(item => item.indexOf(cmd) > -1);
    if (commands.length > 0) {
        reply(commands);
    }
    else {
        reply(['-h', '-v']);
    }
}
exports.handleCompletion = handleCompletion;
