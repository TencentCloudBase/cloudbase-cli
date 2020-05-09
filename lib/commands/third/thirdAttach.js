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
const common_1 = require("../common");
const utils_1 = require("../../utils");
const third_1 = require("../../third");
const decorators_1 = require("../../decorators");
class DeleteThirdAttach extends common_1.Command {
    get options() {
        return {
            cmd: 'third:deleteThirdAttach',
            options: [
                {
                    flags: '--source <source>',
                    desc: '第三方来源'
                },
                {
                    flags: '--thirdAppId <thirdAppId>',
                    desc: '第三方appId'
                }
            ],
            desc: '解除第三方绑定',
            requiredEnvId: false
        };
    }
    execute(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { source, thirdAppId } = options;
            let typeFlag;
            if (source === 'qq') {
                typeFlag = 1;
            }
            if (!typeFlag) {
                throw new Error('请指定对应的source');
            }
            const loading = utils_1.loadingFactory();
            loading.start('数据加载中...');
            const data = yield third_1.deleteThirdPartAttach({
                TypeFlag: typeFlag,
                ThirdPartAppid: thirdAppId
            });
            loading.stop();
            console.log(data);
        });
    }
}
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.ArgsOptions()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeleteThirdAttach.prototype, "execute", null);
exports.DeleteThirdAttach = DeleteThirdAttach;
