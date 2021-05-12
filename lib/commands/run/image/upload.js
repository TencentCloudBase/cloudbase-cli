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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
exports.UploadImage = void 0;
const child_process_1 = require("child_process");
const util = __importStar(require("util"));
const enquirer_1 = require("enquirer");
const common_1 = require("../../common");
const error_1 = require("../../../error");
const run_1 = require("../../../run");
const utils_1 = require("../../../utils");
const decorators_1 = require("../../../decorators");
const common_2 = require("./common");
let UploadImage = class UploadImage extends common_1.Command {
    get options() {
        return Object.assign(Object.assign({}, common_2.imageCommonOptions('upload')), { options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-s, --serviceName <serviceName>',
                    desc: '托管服务 name'
                },
                {
                    flags: '-i, --imageId <imageId>',
                    desc: '本地镜像 id'
                },
                {
                    flags: '-t, --imageTag <imageTag>',
                    desc: '镜像 tag'
                }
            ], desc: '删除云开发环境下云托管服务的版本' });
    }
    execute(envId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { serviceName = '', imageId = '', imageTag = '' } = options;
            if (serviceName.length === 0 || imageId.length === 0 || imageTag.length === 0) {
                throw new error_1.CloudBaseError('必须输入 serviceName 和 imageId 和 imageTag');
            }
            const loading = utils_1.loadingFactory();
            const uin = yield utils_1.getUin();
            if (uin === '无')
                throw new error_1.CloudBaseError('请确认是否登录cloudbase');
            if (!(yield run_1.getAuthFlag())) {
                console.log('操作会自动执行docker login');
                const { pw } = yield enquirer_1.prompt({
                    type: 'password',
                    message: '请输入镜像仓库密码',
                    name: 'pw'
                });
                loading.start('登陆中');
                let { stdout, stderr } = yield util.promisify(child_process_1.exec)(`docker login --username=${uin} ccr.ccs.tencentyun.com -p ${pw}`);
                if (stdout.search('Login Succeeded') === -1)
                    throw new error_1.CloudBaseError(stderr);
                loading.succeed('登录成功');
            }
            const imageRepo = yield run_1.describeImageRepo({ envId, serverName: serviceName });
            let stderr;
            if (stderr = (yield util.promisify(child_process_1.exec)(`docker tag ${imageId} ccr.ccs.tencentyun.com/${imageRepo}:${imageTag}`)).stderr)
                throw new error_1.CloudBaseError(stderr);
            let sh = new Promise((resolve, reject) => child_process_1.exec(`docker push ccr.ccs.tencentyun.com/${imageRepo}:${imageTag}`, (stderr, stdout) => stderr ? reject({ code: -1, info: stderr }) : resolve({ code: 0, info: stdout })).stdout.pipe(process.stdout));
            try {
                let res = yield sh;
                if (res.code === -1)
                    throw new error_1.CloudBaseError(res.info);
            }
            catch (e) {
                throw e;
            }
            loading.succeed('上传成功');
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()), __param(1, decorators_1.ArgsOptions()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UploadImage.prototype, "execute", null);
UploadImage = __decorate([
    common_1.ICommand()
], UploadImage);
exports.UploadImage = UploadImage;
