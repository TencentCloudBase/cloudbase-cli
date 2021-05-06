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
exports.ListImage = void 0;
const common_1 = require("../../common");
const error_1 = require("../../../error");
const run_1 = require("../../../run");
const utils_1 = require("../../../utils");
const decorators_1 = require("../../../decorators");
const common_2 = require("./common");
let ListImage = class ListImage extends common_1.Command {
    get options() {
        return Object.assign(Object.assign({}, common_2.imageCommonOptions('list')), { options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-s, --serviceName <serviceName>',
                    desc: '托管服务 name'
                },
                {
                    flags: '-l, --limit <limit>',
                    desc: '返回数据长度，默认值为 20'
                },
                {
                    flags: '-o, --offset <offset>',
                    desc: '数据偏移量，默认值为 0'
                }
            ], desc: '展示选择的云托管服务的版本列表' });
    }
    execute(envId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let { limit = 20, offset = 0, serviceName = '' } = options;
            limit = Number(limit);
            offset = Number(offset);
            if (!Number.isInteger(limit) || !Number.isInteger(offset)) {
                throw new error_1.CloudBaseError('limit 和 offset 必须为整数');
            }
            if (limit < 0 || offset < 0) {
                throw new error_1.CloudBaseError('limit 和 offset 必须为大于 0 的整数');
            }
            if (serviceName.length === 0) {
                throw new error_1.CloudBaseError('请输入查询的服务名');
            }
            const loading = utils_1.loadingFactory();
            loading.start('数据加载中...');
            const data = yield run_1.listImage({
                envId,
                limit: Number(limit),
                offset: Number(offset),
                serviceName: serviceName
            });
            loading.stop();
            const head = ['镜像', '大小', '关联服务版本', '创建时间', '更新时间'];
            const tableData = data.map((item) => [
                item.ImageUrl.split(':')[1],
                item.Size,
                item.ReferVersions.length > 0 ? item.ReferVersions.reduce((sum, item) => `${sum}|${item.VersionName}`, '') : '-',
                item.CreateTime,
                item.UpdateTime,
            ]);
            utils_1.printHorizontalTable(head, tableData);
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()), __param(1, decorators_1.ArgsOptions()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ListImage.prototype, "execute", null);
ListImage = __decorate([
    common_1.ICommand()
], ListImage);
exports.ListImage = ListImage;
