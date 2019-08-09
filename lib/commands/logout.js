"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const auth_1 = require("../auth");
commander_1.default
    .command('logout')
    .description('登出腾讯云账号')
    .action(auth_1.logout);
