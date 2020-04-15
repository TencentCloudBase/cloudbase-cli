"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
function md5(str = '') {
    const hash = crypto_1.default.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
}
exports.md5 = md5;
