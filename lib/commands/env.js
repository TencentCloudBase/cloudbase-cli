"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const env_1 = require("../env");
const utils_1 = require("../utils");
commander_1.default
    .command('env:list')
    .description('列出云开发所有环境')
    .action(async function () {
    const data = await env_1.listEnvs();
    const head = ['EnvId', 'PackageName', 'Source', 'CreateTime'];
    const tableData = data.map(item => [
        item.envId,
        item.packageName,
        item.source,
        item.createTime
    ]);
    utils_1.printCliTable(head, tableData);
});
