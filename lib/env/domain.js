"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const tcbService = new utils_1.CloudService('tcb', '2018-06-08');
async function getEnvAuthDomains({ envId }) {
    const { Domains = [] } = await tcbService.request('DescribeAuthDomains', {
        EnvId: envId
    });
    return Domains;
}
exports.getEnvAuthDomains = getEnvAuthDomains;
async function createEnvDomain({ envId, domains }) {
    await tcbService.request('CreateAuthDomain', {
        EnvId: envId,
        Domains: domains
    });
}
exports.createEnvDomain = createEnvDomain;
async function deleteEnvDomain({ envId, domainIds }) {
    const { Deleted } = await tcbService.request('DeleteAuthDomain', {
        EnvId: envId,
        DomainIds: domainIds
    });
    return Deleted;
}
exports.deleteEnvDomain = deleteEnvDomain;
