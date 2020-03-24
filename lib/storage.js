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
const manager_node_1 = __importDefault(require("@cloudbase/manager-node"));
const utils_1 = require("./utils");
const error_1 = require("./error");
function getStorageService(envId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { secretId, secretKey, token } = yield utils_1.checkAndGetCredential(true);
        const app = new manager_node_1.default({
            secretId,
            secretKey,
            token,
            envId,
            proxy: utils_1.getProxy()
        });
        return app.storage;
    });
}
function uploadFile(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, localPath, cloudPath } = options;
        const storageService = yield getStorageService(envId);
        return storageService.uploadFile({
            localPath,
            cloudPath
        });
    });
}
exports.uploadFile = uploadFile;
function uploadDirectory(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, localPath, cloudPath } = options;
        const storageService = yield getStorageService(envId);
        return storageService.uploadDirectory({
            localPath,
            cloudPath
        });
    });
}
exports.uploadDirectory = uploadDirectory;
function downloadFile(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, localPath, cloudPath } = options;
        const storageService = yield getStorageService(envId);
        return storageService.downloadFile({
            cloudPath,
            localPath
        });
    });
}
exports.downloadFile = downloadFile;
function downloadDirectory(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, localPath, cloudPath } = options;
        const storageService = yield getStorageService(envId);
        return storageService.downloadDirectory({
            cloudPath,
            localPath
        });
    });
}
exports.downloadDirectory = downloadDirectory;
function deleteFile(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, cloudPath, cloudPaths } = options;
        const storageService = yield getStorageService(envId);
        if (cloudPaths === null || cloudPaths === void 0 ? void 0 : cloudPaths.length) {
            return storageService.deleteFile(cloudPaths);
        }
        return storageService.deleteFile([cloudPath]);
    });
}
exports.deleteFile = deleteFile;
function deleteDirectory(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, cloudPath } = options;
        const storageService = yield getStorageService(envId);
        return storageService.deleteDirectory(cloudPath);
    });
}
exports.deleteDirectory = deleteDirectory;
function list(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, cloudPath } = options;
        const storageService = yield getStorageService(envId);
        return storageService.listDirectoryFiles(cloudPath);
    });
}
exports.list = list;
function getUrl(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, cloudPaths } = options;
        const storageService = yield getStorageService(envId);
        return storageService.getTemporaryUrl(cloudPaths);
    });
}
exports.getUrl = getUrl;
function detail(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, cloudPath } = options;
        const storageService = yield getStorageService(envId);
        return storageService.getFileInfo(cloudPath);
    });
}
exports.detail = detail;
function getAcl(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId } = options;
        const storageService = yield getStorageService(envId);
        return storageService.getStorageAcl();
    });
}
exports.getAcl = getAcl;
function setAcl(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, acl } = options;
        const validAcl = ['READONLY', 'PRIVATE', 'ADMINWRITE', 'ADMINONLY'];
        if (!validAcl.includes(acl)) {
            throw new error_1.CloudBaseError('非法的权限值，仅支持：READONLY, PRIVATE, ADMINWRITE, ADMINONLY');
        }
        const storageService = yield getStorageService(envId);
        return storageService.setStorageAcl(acl);
    });
}
exports.setAcl = setAcl;
