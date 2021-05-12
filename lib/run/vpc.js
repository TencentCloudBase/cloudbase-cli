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
exports.getSubnets = exports.getVpcs = void 0;
const utils_1 = require("../utils");
const vpcService = utils_1.CloudApiService.getInstance('vpc');
const getVpcs = () => __awaiter(void 0, void 0, void 0, function* () {
    const { VpcSet } = yield vpcService.request('DescribeVpcs');
    return VpcSet;
});
exports.getVpcs = getVpcs;
const getSubnets = (vpcId) => __awaiter(void 0, void 0, void 0, function* () {
    const { SubnetSet } = yield vpcService.request('DescribeSubnets', {
        Filters: [
            {
                Name: 'vpc-id',
                Values: [vpcId]
            }
        ]
    });
    return SubnetSet;
});
exports.getSubnets = getSubnets;
