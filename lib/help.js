"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputHelpInfo = void 0;
const chalk_1 = __importDefault(require("chalk"));
exports.outputHelpInfo = () => {
    const commands = `
  命令

    env             [cmd]           环境管理操作
    fn              [cmd]           操作函数
    framework       [cmd]           云开发 Serverless 应用框架操作
    hosting         [cmd]           静态托管资源管理操作
    init            [options]       创建并初始化一个新的云开发项目
    login           [options]       登录腾讯云账号
    logout                          登出腾讯云账号
    open            [link]          在浏览器中打开云开发相关连接
    storage         [cmd]           云存储资源管理操作
    service         [cmd]           云接入管理操作`;
    const options = `
  选项

    --verbose                       打印出内部运行信息
    --mode <mode>                   指定加载 env 文件的环境
    --config-file <path>            指定配置文件路径
    -v, --version                   输出当前版本
    -h, --help                      打印帮助信息`;
    const tips = `
  Tips:

    ${chalk_1.default.gray('–')} 简写

      ${chalk_1.default.cyan('使用 tcb 替代 cloudbase')}

    ${chalk_1.default.gray('–')} 登录

      ${chalk_1.default.cyan('$ cloudbase login')}

    ${chalk_1.default.gray('–')} 初始化云开发项目

      ${chalk_1.default.cyan('$ cloudbase init')}

    ${chalk_1.default.gray('–')} 部署云函数

      ${chalk_1.default.cyan('$ cloudbase functions:deploy')}

    ${chalk_1.default.gray('–')} 查看命令使用介绍

      ${chalk_1.default.cyan('$ cloudbase env:list -h')}`;
    console.log(commands, '\n', options, '\n', tips);
};
