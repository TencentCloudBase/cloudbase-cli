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
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const tcbService = utils_1.CloudApiService.getInstance('tcb');
function switchHttpService(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, enable } = options;
        const value = enable ? 'true' : 'false';
        const res = yield tcbService.request('ModifyCloudBaseGWPrivilege', {
            ServiceId: envId,
            EnableService: enable,
            Options: [
                {
                    Key: 'serviceswitch',
                    Value: value
                }
            ]
        });
        return res;
    });
}
exports.switchHttpService = switchHttpService;
function switchHttpServiceAuth(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, enable } = options;
        const value = enable ? 'true' : 'false';
        const res = yield tcbService.request('ModifyCloudBaseGWPrivilege', {
            ServiceId: envId,
            EnableService: enable,
            Options: [
                {
                    Key: 'authswitch',
                    Value: value
                }
            ]
        });
        return res;
    });
}
exports.switchHttpServiceAuth = switchHttpServiceAuth;
function getHttpServicePrivilege(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId } = options;
        return tcbService.request('DescribeCloudBaseGWPrivilege', {
            ServiceId: envId
        });
    });
}
exports.getHttpServicePrivilege = getHttpServicePrivilege;
function createGateway(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, path, name } = options;
        const res = yield tcbService.request('CreateCloudBaseGWAPI', {
            ServiceId: envId,
            Path: path,
            Type: 1,
            Name: name
        });
        return res;
    });
}
exports.createGateway = createGateway;
function queryGateway(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, domain, path, gatewayId, name } = options;
        const res = yield tcbService.request('DescribeCloudBaseGWAPI', {
            ServiceId: envId,
            Domain: domain,
            Path: path,
            APIId: gatewayId,
            Type: 1,
            Name: name
        });
        return res;
    });
}
exports.queryGateway = queryGateway;
function deleteGateway(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, path, name, gatewayId } = options;
        const res = yield tcbService.request('DeleteCloudBaseGWAPI', {
            ServiceId: envId,
            Path: path,
            APIId: gatewayId,
            Type: 1,
            Name: name
        });
        return res;
    });
}
exports.deleteGateway = deleteGateway;
function bindGatewayDomain(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, domain } = options;
        const res = yield tcbService.request('BindCloudBaseGWDomain', {
            ServiceId: envId,
            Domain: domain
        });
        return res;
    });
}
exports.bindGatewayDomain = bindGatewayDomain;
function queryGatewayDomain(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, domain } = options;
        const res = yield tcbService.request('DescribeCloudBaseGWService', {
            ServiceId: envId,
            Domain: domain
        });
        return res;
    });
}
exports.queryGatewayDomain = queryGatewayDomain;
function unbindGatewayDomain(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, domain } = options;
        const res = yield tcbService.request('DeleteCloudBaseGWDomain', {
            ServiceId: envId,
            Domain: domain
        });
        return res;
    });
}
exports.unbindGatewayDomain = unbindGatewayDomain;
