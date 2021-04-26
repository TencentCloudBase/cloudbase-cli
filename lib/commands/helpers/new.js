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
exports.isGitUrl = exports.NewCommand = void 0;
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const execa_1 = __importDefault(require("execa"));
const toolbox_1 = require("@cloudbase/toolbox");
const common_1 = require("../common");
const utils_1 = require("../../utils");
const decorators_1 = require("../../decorators");
const auth_1 = require("../../auth");
let NewCommand = class NewCommand extends common_1.Command {
    get options() {
        return {
            cmd: 'new [appName] [templateUri]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '--clone',
                    desc: '从 Git 创建模板时是否 Clone 整个仓库'
                }
            ],
            desc: '创建一个新的云开发应用',
            requiredEnvId: false,
            withoutAuth: true
        };
    }
    execute(ctx, log) {
        return __awaiter(this, void 0, void 0, function* () {
            const { params, options, envId } = ctx;
            const { clone } = options;
            let appName = params === null || params === void 0 ? void 0 : params[0];
            const templateUri = params === null || params === void 0 ? void 0 : params[1];
            yield auth_1.checkLogin();
            let region = yield toolbox_1.getRegion(true);
            if (!region) {
                region = yield utils_1.getSelectRegion();
            }
            let env = envId;
            if (!env) {
                env = yield utils_1.getSelectedEnv(envId);
            }
            let projectPath;
            if (templateUri && isGitUrl(templateUri)) {
                if (clone) {
                    yield execa_1.default('git', ['clone', templateUri, appName], {
                        stdio: 'inherit'
                    });
                }
                else {
                    yield execa_1.default('git', ['clone', '--depth', 1, templateUri, appName], {
                        stdio: 'inherit'
                    });
                    yield utils_1.delSync([path_1.default.join(process.cwd(), appName, '.git')]);
                }
                projectPath = path_1.default.join(process.cwd(), appName);
            }
            else {
                projectPath = yield utils_1.downloadTemplate({
                    appName,
                    projectPath,
                    templateUri,
                    newProject: true
                });
            }
            yield utils_1.initProjectConfig(env, region, projectPath);
            this.initSuccessOutput(appName);
        });
    }
    initSuccessOutput(appName, log) {
        log.success(appName ? `创建应用 ${appName} 成功！\n` : '创建应用成功！');
        if (appName) {
            const command = chalk_1.default.bold.cyan(`cd ${appName}`);
            log.info(`👉 执行命令 ${command} 进入文件夹`);
        }
        log.info(`👉 开发完成后，执行命令 ${chalk_1.default.bold.cyan('tcb')} 一键部署`);
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.CmdContext()), __param(1, decorators_1.Log()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, decorators_1.Logger]),
    __metadata("design:returntype", Promise)
], NewCommand.prototype, "execute", null);
__decorate([
    decorators_1.InjectParams(),
    __param(1, decorators_1.Log()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, decorators_1.Logger]),
    __metadata("design:returntype", void 0)
], NewCommand.prototype, "initSuccessOutput", null);
NewCommand = __decorate([
    common_1.ICommand()
], NewCommand);
exports.NewCommand = NewCommand;
function isGitUrl(url) {
    const regex = /(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/;
    return regex.test(url);
}
exports.isGitUrl = isGitUrl;
