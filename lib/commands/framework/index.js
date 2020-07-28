"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.FrameworkCompile = exports.FrameworkDeploy = void 0;
const framework_core_1 = require("@cloudbase/framework-core");
const common_1 = require("../common");
const decorators_1 = require("../../decorators");
const Hosting = __importStar(require("../../hosting"));
const Function = __importStar(require("../../function"));
const utils_1 = require("../../utils");
function callFramework(ctx, command, module) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, config } = ctx;
        const loginState = yield utils_1.authSupevisor.getLoginState();
        const { token, secretId, secretKey } = loginState;
        yield framework_core_1.run({
            projectPath: process.cwd(),
            cloudbaseConfig: {
                secretId,
                secretKey,
                token,
                envId
            },
            config,
            logLevel: ctx.options.verbose ? 'debug' : 'info',
            resourceProviders: {
                hosting: Hosting,
                function: Function
            }
        }, command, module);
    });
}
let FrameworkDeploy = class FrameworkDeploy extends common_1.Command {
    get options() {
        return {
            cmd: 'framework:deploy [module]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                { flags: '--verbose', desc: '是否打印详细日志' }
            ],
            desc: '云开发 Serverless 应用框架：部署全栈应用'
        };
    }
    execute(ctx, logger, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const [module] = params || [];
            yield callFramework(ctx, 'deploy', module);
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.CmdContext()), __param(1, decorators_1.Log()), __param(2, decorators_1.ArgsParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, decorators_1.Logger, Object]),
    __metadata("design:returntype", Promise)
], FrameworkDeploy.prototype, "execute", null);
FrameworkDeploy = __decorate([
    common_1.ICommand()
], FrameworkDeploy);
exports.FrameworkDeploy = FrameworkDeploy;
let FrameworkCompile = class FrameworkCompile extends common_1.Command {
    get options() {
        return {
            cmd: 'framework:compile [module]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                { flags: '--verbose', desc: '是否打印详细日志' }
            ],
            desc: '云开发 Serverless 应用框架：编译应用描述文件'
        };
    }
    execute(ctx, logger, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const [module] = params || [];
            yield callFramework(ctx, 'compile', module);
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.CmdContext()), __param(1, decorators_1.Log()), __param(2, decorators_1.ArgsParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, decorators_1.Logger, Object]),
    __metadata("design:returntype", Promise)
], FrameworkCompile.prototype, "execute", null);
FrameworkCompile = __decorate([
    common_1.ICommand()
], FrameworkCompile);
exports.FrameworkCompile = FrameworkCompile;
