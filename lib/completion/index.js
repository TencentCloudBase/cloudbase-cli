"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tabtab_1 = __importDefault(require("tabtab"));
const constant_1 = require("../constant");
const completion = env => {
    if (!env.complete)
        return;
    const args = process.argv.slice(5);
    const cmd = args[0];
    const commands = constant_1.ALL_COMMANDS.filter(item => item.indexOf(cmd) > -1);
    if (commands.length > 0) {
        return tabtab_1.default.log(commands);
    }
    else {
        return tabtab_1.default.log(['-h', '-v']);
    }
};
function handleCompletion() {
    const env = tabtab_1.default.parseEnv(process.env);
    completion(env);
}
exports.handleCompletion = handleCompletion;
