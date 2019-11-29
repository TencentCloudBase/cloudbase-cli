"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const error_1 = require("../../error");
function checkPathExist(dest, throwError = false) {
    const exist = fs_1.default.existsSync(dest);
    if (!exist && throwError) {
        throw new error_1.CloudBaseError(`路径不存在：${dest}`);
    }
    return exist;
}
exports.checkPathExist = checkPathExist;
function isDirectory(dest) {
    checkPathExist(dest, true);
    return fs_1.default.statSync(dest).isDirectory();
}
exports.isDirectory = isDirectory;
__export(require("./del"));
