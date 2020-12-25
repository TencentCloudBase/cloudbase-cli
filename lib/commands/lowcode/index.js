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
exports.LowCodeWatch = void 0;
const common_1 = require("../common");
const decorators_1 = require("../../decorators");
const controller_1 = require("./ci/controller");
const BUILD_TYPE_LIST = ['mp', 'web'];
let LowCodeWatch = class LowCodeWatch extends common_1.Command {
    get options() {
        return {
            cmd: 'lowcode',
            childCmd: 'watch',
            options: [
                {
                    flags: '--verbose',
                    desc: '是否打印详细日志'
                },
            ],
            desc: '开启云开发低码的本地构建模式',
            requiredEnvId: false,
        };
    }
    execute(ctx, log) {
        return __awaiter(this, void 0, void 0, function* () {
            yield controller_1.startLocalCIServer(8288);
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.CmdContext()), __param(1, decorators_1.Log()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, decorators_1.Logger]),
    __metadata("design:returntype", Promise)
], LowCodeWatch.prototype, "execute", null);
LowCodeWatch = __decorate([
    common_1.ICommand()
], LowCodeWatch);
exports.LowCodeWatch = LowCodeWatch;
