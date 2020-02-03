"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const open_1 = __importDefault(require("open"));
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const error_1 = require("../../error");
const links = [
    {
        name: 'CLI 文档',
        value: 'cli-doc',
        url: 'https://tencentcloudbase.github.io/2019-09-03-cli/'
    }
];
function openLink(ctx, link) {
    return __awaiter(this, void 0, void 0, function* () {
        let openLink = null;
        console.log(link);
        if (link) {
            openLink = links.find(item => item.value === link);
            if (!openLink) {
                throw new error_1.CloudBaseError(`${link} 链接不存在！`);
            }
        }
        else {
            console.log('go');
            const { selectLink } = yield inquirer_1.default.prompt({
                type: 'list',
                name: 'selectLink',
                message: '请选择需要打开的链接',
                choices: links
            });
            openLink = links.find(item => item.value === selectLink);
        }
        if (!openLink) {
            throw new error_1.CloudBaseError('请指定需要打开的链接！');
        }
        console.log(`在您的默认浏览器中打开 ${openLink.name} 链接：`);
        console.log(chalk_1.default.underline.bold(openLink.url));
        open_1.default(openLink.url);
    });
}
exports.openLink = openLink;
