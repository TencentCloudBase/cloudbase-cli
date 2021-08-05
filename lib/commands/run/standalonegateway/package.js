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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageStandalonegateway = void 0;
const common_1 = require("../../common");
const run_1 = require("../../../run");
const toolbox_1 = require("@cloudbase/toolbox");
const decorators_1 = require("../../../decorators");
const common_2 = require("./common");
const error_1 = require("../../../error");
const utils_1 = require("../../../utils");
let PackageStandalonegateway = class PackageStandalonegateway extends common_1.Command {
    get options() {
        return Object.assign(Object.assign({}, common_2.standalonegatewayCommonOptions('package <operation>')), { options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-a, --appId <appId>',
                    desc: '应用 Id'
                },
                {
                    flags: '-p, --packageVersion <packageVersion>',
                    desc: '套餐版本'
                }
            ], desc: '套餐操作' });
    }
    execute(envId, params, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const operation = params === null || params === void 0 ? void 0 : params[0];
            if (!operation || ['list'].indexOf(operation) === -1) {
                throw new error_1.CloudBaseError('请输入具体操作');
            }
            switch (operation) {
                case 'list':
                    {
                        let { appId, packageVersion = '' } = options;
                        appId = String(appId);
                        packageVersion = String(packageVersion);
                        if (appId === '') {
                            throw new error_1.CloudBaseError('请输入应用 Id');
                        }
                        const loading = toolbox_1.loadingFactory();
                        loading.start('数据加载中...');
                        const data = yield run_1.listPackageStandalonegateway({
                            envId,
                            appId: Number(appId),
                            packageVersion
                        });
                        loading.stop();
                        const head = ['CPU', '内存', '版本'];
                        utils_1.printHorizontalTable(head, data);
                    }
                    break;
                default:
                    break;
            }
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()),
    __param(1, decorators_1.ArgsParams()),
    __param(2, decorators_1.ArgsOptions()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PackageStandalonegateway.prototype, "execute", null);
PackageStandalonegateway = __decorate([
    common_1.ICommand()
], PackageStandalonegateway);
exports.PackageStandalonegateway = PackageStandalonegateway;
