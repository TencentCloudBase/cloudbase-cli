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
__export(require("./del"));
__export(require("./compress"));
function checkFullAccess(dest, throwError = false) {
    try {
        fs_1.default.accessSync(dest, fs_1.default.constants.F_OK);
        fs_1.default.accessSync(dest, fs_1.default.constants.W_OK);
        fs_1.default.accessSync(dest, fs_1.default.constants.R_OK);
        return true;
    }
    catch (e) {
        if (throwError) {
            throw new error_1.CloudBaseError(`路径不存在或没有权限访问：${dest}`);
        }
        else {
            return false;
        }
    }
}
exports.checkFullAccess = checkFullAccess;
function checkWritable(dest, throwError = false) {
    try {
        fs_1.default.accessSync(dest, fs_1.default.constants.F_OK);
        fs_1.default.accessSync(dest, fs_1.default.constants.W_OK);
        return true;
    }
    catch (e) {
        if (throwError) {
            throw new error_1.CloudBaseError(`路径不存在或没有权限访问：${dest}`);
        }
        else {
            return false;
        }
    }
}
exports.checkWritable = checkWritable;
function checkReadable(dest, throwError = false) {
    try {
        fs_1.default.accessSync(dest, fs_1.default.constants.F_OK);
        fs_1.default.accessSync(dest, fs_1.default.constants.R_OK);
        return true;
    }
    catch (e) {
        if (throwError) {
            throw new error_1.CloudBaseError(`路径不存在或没有权限访问：${dest}`);
        }
        else {
            return false;
        }
    }
}
exports.checkReadable = checkReadable;
function isDirectory(dest) {
    checkFullAccess(dest, true);
    return fs_1.default.statSync(dest).isDirectory();
}
exports.isDirectory = isDirectory;
function formateFileSize(size, unit) {
    const numSize = Number(size);
    const unitMap = {
        KB: 1024,
        MB: Math.pow(1024, 2),
        GB: Math.pow(1024, 3)
    };
    return Number(numSize / unitMap[unit]).toFixed(2);
}
exports.formateFileSize = formateFileSize;
