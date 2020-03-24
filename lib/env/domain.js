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
function getEnvAuthDomains({ envId }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { Domains = [] } = yield tcbService.request('DescribeAuthDomains', {
            EnvId: envId
        });
        return Domains;
    });
}
exports.getEnvAuthDomains = getEnvAuthDomains;
function createEnvDomain({ envId, domains }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield tcbService.request('CreateAuthDomain', {
            EnvId: envId,
            Domains: domains
        });
    });
}
exports.createEnvDomain = createEnvDomain;
function deleteEnvDomain({ envId, domainIds }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { Deleted } = yield tcbService.request('DeleteAuthDomain', {
            EnvId: envId,
            DomainIds: domainIds
        });
        return Deleted;
    });
}
exports.deleteEnvDomain = deleteEnvDomain;
