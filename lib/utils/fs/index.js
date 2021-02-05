"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formateFileSize = exports.isDirectory = exports.checkReadable = exports.checkWritable = exports.checkFullAccess = void 0;
const fs_1 = __importDefault(require("fs"));
const error_1 = require("../../error");
__exportStar(require("./del"), exports);
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
