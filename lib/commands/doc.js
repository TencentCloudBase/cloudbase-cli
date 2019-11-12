"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const open_1 = __importDefault(require("open"));
commander_1.default
    .command('logout')
    .description('查看 CLI 文档')
    .action(() => {
    open_1.default('');
});
