"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const del_1 = __importDefault(require("del"));
function delSync(patterns) {
    del_1.default.sync(patterns, { force: true });
}
exports.delSync = delSync;
