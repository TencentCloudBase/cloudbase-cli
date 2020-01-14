"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const terminal_link_1 = __importDefault(require("terminal-link"));
function genClickableLink(link) {
    if (terminal_link_1.default.isSupported) {
        const clickablelink = terminal_link_1.default(link, link);
        return chalk_1.default.bold.cyan(clickablelink);
    }
    return chalk_1.default.bold.underline.cyan(link);
}
exports.genClickableLink = genClickableLink;
