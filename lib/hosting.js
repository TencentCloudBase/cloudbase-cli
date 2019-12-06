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
const path_1 = __importDefault(require("path"));
const manager_node_1 = __importDefault(require("@cloudbase/manager-node"));
const utils_1 = require("./utils");
const error_1 = require("./error");
const utils_2 = require("./utils");
function getStorageService(envId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { secretId, secretKey, token } = yield utils_2.checkAndGetCredential();
        const app = new manager_node_1.default({
            secretId,
            secretKey,
            token,
            envId,
            proxy: utils_2.getProxy()
        });
        return app.storage;
    });
}
const HostingStatusMap = {
    init: '初始化中',
    process: '处理中',
    online: '上线',
    destroying: '销毁中',
    offline: '下线',
    create_fail: '初始化失败',
    destroy_fail: '销毁失败'
};
const tcbService = new utils_1.CloudApiService('tcb');
function getHostingInfo(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId } = options;
        const res = yield tcbService.request('DescribeStaticStore', {
            EnvId: envId
        });
        const data = utils_1.firstLetterToLowerCase(res);
        return data;
    });
}
exports.getHostingInfo = getHostingInfo;
function checkHostingStatus(envId) {
    return __awaiter(this, void 0, void 0, function* () {
        const hostings = yield getHostingInfo({ envId });
        if (!hostings.data || !hostings.data.length) {
            throw new error_1.CloudBaseError('您还没有开启静态网站服务，请先到云开发控制台开启静态网站服务！\n 👉 https://console.cloud.tencent.com/tcb', {
                code: 'INVALID_OPERATION'
            });
        }
        const website = hostings.data[0];
        if (website.status !== 'online') {
            throw new error_1.CloudBaseError(`静态网站服务【${HostingStatusMap[website.status]}】，请稍后重试！`, {
                code: 'INVALID_OPERATION'
            });
        }
        return website;
    });
}
function enableHosting(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId } = options;
        const hostings = yield getHostingInfo(options);
        if (hostings.data && hostings.data.length) {
            const website = hostings.data[0];
            if (website.status !== 'offline') {
                throw new error_1.CloudBaseError('静态网站服务已开启，请勿重复操作！');
            }
        }
        const res = yield tcbService.request('CreateStaticStore', {
            EnvId: envId
        });
        const code = res.Result === 'succ' ? 0 : -1;
        return {
            code,
            requestId: res.RequestId
        };
    });
}
exports.enableHosting = enableHosting;
function hostingList(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId } = options;
        const hosting = yield checkHostingStatus(envId);
        const { bucket, regoin } = hosting;
        const storageService = yield getStorageService(envId);
        const list = yield storageService.walkCloudDirCustom('', bucket, regoin);
        return list;
    });
}
exports.hostingList = hostingList;
function destroyHosting(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId } = options;
        const files = yield hostingList(options);
        if (files && files.length) {
            throw new error_1.CloudBaseError('静态网站文件不为空，无法销毁！', {
                code: 'INVALID_OPERATION'
            });
        }
        const hostings = yield getHostingInfo(options);
        if (!hostings.data || !hostings.data.length) {
            throw new error_1.CloudBaseError('静态网站服务未开启！', {
                code: 'INVALID_OPERATION'
            });
        }
        const website = hostings.data[0];
        if (website.status !== 'online' && website.status !== 'destroy_fail') {
            throw new error_1.CloudBaseError(`静态网站服务【${HostingStatusMap[website.status]}】，无法处理请求！`, {
                code: 'INVALID_OPERATION'
            });
        }
        const res = yield tcbService.request('DestroyStaticStore', {
            EnvId: envId
        });
        const code = res.Result === 'succ' ? 0 : -1;
        return {
            code,
            requestId: res.RequestId
        };
    });
}
exports.destroyHosting = destroyHosting;
function hostingDeploy(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, filePath, cloudPath } = options;
        const resolvePath = path_1.default.resolve(filePath);
        utils_1.checkPathExist(resolvePath, true);
        const hosting = yield checkHostingStatus(envId);
        const { bucket, regoin } = hosting;
        const storageService = yield getStorageService(envId);
        if (utils_1.isDirectory(resolvePath)) {
            storageService.uploadDirectoryCustom(resolvePath, cloudPath, bucket, regoin);
        }
        else {
            storageService.uploadFileCustom(resolvePath, cloudPath, bucket, regoin);
        }
    });
}
exports.hostingDeploy = hostingDeploy;
function hostingDelete(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, cloudPath, isDir } = options;
        const hosting = yield checkHostingStatus(envId);
        const { bucket, regoin } = hosting;
        const storageService = yield getStorageService(envId);
        if (isDir) {
            storageService.deleteDirectoryCustom(cloudPath, bucket, regoin);
        }
        else {
            storageService.deleteFileCustom([cloudPath], bucket, regoin);
        }
    });
}
exports.hostingDelete = hostingDelete;
