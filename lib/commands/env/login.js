"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
const inquirer_1 = __importDefault(require("inquirer"));
const common_1 = require("../common");
const error_1 = require("../../error");
const utils_1 = require("../../utils");
const decorators_1 = require("../../decorators");
const env_1 = require("../../env");
const platformMap = {
    'WECHAT-OPEN': '微信开放平台',
    'WECHAT-PUBLIC': '微信公众平台',
    ANONYMOUS: '匿名登录'
};
let ListLoginCommand = class ListLoginCommand extends common_1.Command {
    get options() {
        return {
            cmd: 'env:login:list',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '列出环境登录配置'
        };
    }
    execute(envId) {
        return __awaiter(this, void 0, void 0, function* () {
            const configList = yield env_1.getLoginConfigList({
                envId
            });
            const head = ['平台', '平台 Id', '创建时间', '状态'];
            const tableData = configList.map((item) => [
                platformMap[item.Platform] ? platformMap[item.Platform] : item.Platform,
                item.PlatformId,
                item.CreateTime,
                item.Status === 'ENABLE' ? '启用' : '禁用'
            ]);
            utils_1.printHorizontalTable(head, tableData);
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ListLoginCommand.prototype, "execute", null);
ListLoginCommand = __decorate([
    common_1.ICommand()
], ListLoginCommand);
exports.ListLoginCommand = ListLoginCommand;
let CreateLoginCommand = class CreateLoginCommand extends common_1.Command {
    get options() {
        return {
            cmd: 'env:login:create',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '添加环境登录方式配置'
        };
    }
    execute(envId, log) {
        return __awaiter(this, void 0, void 0, function* () {
            const { platform } = yield inquirer_1.default.prompt([
                {
                    type: 'list',
                    name: 'platform',
                    choices: [
                        {
                            name: '微信公众平台',
                            value: 'WECHAT-PUBLIC'
                        },
                        {
                            name: '微信开放平台',
                            value: 'WECHAT-OPEN'
                        },
                        {
                            name: '匿名登录',
                            value: 'ANONYMOUS'
                        }
                    ],
                    message: '请选择登录方式：',
                    default: 'WECHAT-PUBLIC'
                }
            ]);
            let appId;
            let appSecret;
            if (platform === 'WECHAT-OPEN' || platform === 'WECHAT-PUBLIC') {
                const input = yield inquirer_1.default.prompt([
                    {
                        type: 'input',
                        name: 'appId',
                        message: '请输入 AppId：'
                    },
                    {
                        type: 'input',
                        name: 'appSecret',
                        message: '请输入 AppSecret：'
                    }
                ]);
                appId = input === null || input === void 0 ? void 0 : input.appId;
                appSecret = input === null || input === void 0 ? void 0 : input.appSecret;
                if (!appId || !appSecret) {
                    throw new error_1.CloudBaseError('appId 和 appSecret 不能为空！');
                }
            }
            if (platform === 'ANONYMOUS') {
                appId = 'anonymous';
                appSecret = 'anonymous';
            }
            try {
                yield env_1.createLoginConfig({
                    envId,
                    appId,
                    appSecret,
                    platform
                });
                log.success('创建登录方式成功！');
            }
            catch (e) {
                if (e.code === 'ResourceInUse') {
                    log.error('登录方式已开启');
                }
            }
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()), __param(1, decorators_1.Log()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, decorators_1.Logger]),
    __metadata("design:returntype", Promise)
], CreateLoginCommand.prototype, "execute", null);
CreateLoginCommand = __decorate([
    common_1.ICommand()
], CreateLoginCommand);
exports.CreateLoginCommand = CreateLoginCommand;
let UpdateLogin = class UpdateLogin extends common_1.Command {
    get options() {
        return {
            cmd: 'env:login:update',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '更新环境登录方式配置'
        };
    }
    execute(envId, log) {
        return __awaiter(this, void 0, void 0, function* () {
            const configList = yield env_1.getLoginConfigList({
                envId
            });
            const configChoices = configList.map((item) => ({
                name: `${platformMap[item.Platform]}：${item.PlatformId} [${item.Status === 'ENABLE' ? '启用' : '禁用'}]`,
                value: item,
                short: `${platformMap[item.Platform]}：${item.PlatformId}`
            }));
            const { config, status } = yield inquirer_1.default.prompt([
                {
                    type: 'list',
                    name: 'config',
                    choices: configChoices,
                    message: '请选择需要配置的条目：'
                },
                {
                    type: 'list',
                    name: 'status',
                    choices: [
                        {
                            name: '启用',
                            value: 'ENABLE'
                        },
                        {
                            name: '禁用',
                            value: 'DISABLE'
                        }
                    ],
                    message: '请选择登录方式状态：',
                    default: '启用'
                }
            ]);
            const platform = config.Platform;
            let appId;
            let appSecret;
            if (platform === 'WECHAT-OPEN' || platform === 'WECHAT-PUBLIC') {
                const input = yield inquirer_1.default.prompt([
                    {
                        type: 'input',
                        name: 'appId',
                        message: '请输入 AppId（配置状态时可不填）：'
                    },
                    {
                        type: 'input',
                        name: 'appSecret',
                        message: '请输入 AppSecret（配置状态时可不填）：'
                    }
                ]);
                appId = input === null || input === void 0 ? void 0 : input.appId;
                appSecret = input === null || input === void 0 ? void 0 : input.appSecret;
            }
            yield env_1.updateLoginConfig({
                envId,
                configId: config.Id,
                appId,
                appSecret,
                status
            });
            log.success('更新登录方式成功！');
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()), __param(1, decorators_1.Log()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, decorators_1.Logger]),
    __metadata("design:returntype", Promise)
], UpdateLogin.prototype, "execute", null);
UpdateLogin = __decorate([
    common_1.ICommand()
], UpdateLogin);
exports.UpdateLogin = UpdateLogin;
