"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const vpcService = new utils_1.CloudService('vpc', '2017-03-12');
async function getVpcs() {
    const { VpcSet } = await vpcService.request('DescribeVpcs');
    return VpcSet;
}
exports.getVpcs = getVpcs;
async function getSubnets(vpcId) {
    const { SubnetSet } = await vpcService.request('DescribeSubnets', {
        Filters: [
            {
                Name: 'vpc-id',
                Values: [vpcId]
            }
        ]
    });
    return SubnetSet;
}
exports.getSubnets = getSubnets;
