"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputHelpInfo = void 0;
const chalk_1 = __importDefault(require("chalk"));
const outputHelpInfo = () => {
    const commands = `
  命令

    login           [options]                  登录腾讯云账号
    logout                                     登出腾讯云账号
    env             [cmd]                      环境管理操作
    fn              [cmd]                      操作函数
    framework       [cmd]                      云开发 Serverless 应用框架操作
    hosting         [cmd]                      静态托管资源管理操作
    new             [appName] [template]       创建新的云开发应用
    open            [link]                     在浏览器中打开云开发相关连接
    storage         [cmd]                      云存储资源管理操作
    service         [cmd]                      HTTP 访问服务管理操作`;
    const options = `
  选项

    --verbose                                  打印出内部运行信息
    -r, --region <region>                      指定环境地域
    --mode <mode>                              指定加载 env 文件的环境
    --config-file <path>                       指定配置文件路径
    -v, --version                              输出当前版本
    -h, --help                                 查看命令帮助信息`;
    const tips = `
  Tips:

    ${chalk_1.default.gray('–')} 登录

      ${chalk_1.default.cyan('$ tcb login')}

    ${chalk_1.default.gray('–')} 创建新的云开发应用

      ${chalk_1.default.cyan('$ tcb new appName')}

    ${chalk_1.default.gray('–')} 部署云函数

      ${chalk_1.default.cyan('$ tcb fn deploy')}

    ${chalk_1.default.gray('–')} 查看命令使用介绍

      ${chalk_1.default.cyan('$ tcb fn -h')}`;
    console.log(commands, '\n', options, '\n', tips);
};
exports.outputHelpInfo = outputHelpInfo;
