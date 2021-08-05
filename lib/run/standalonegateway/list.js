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
exports.listStandalonegateway = void 0;
const error_1 = require("../../error");
const yunapi_1 = __importDefault(require("./yunapi"));
const listStandalonegateway = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { Response: res } = yield yunapi_1.default('DescribeStandaloneGateway', {
        EnvId: options.envId,
        AppId: options.appId,
        GatewayName: options.gatewayName,
        GatewayAlias: options.gatewayAlias
    });
    const { StandaloneGatewayList } = res;
    if (StandaloneGatewayList !== undefined) {
        return StandaloneGatewayList.map((item) => [
            item['CPU'],
            item['GateWayStatus'],
            item['GatewayAlias'],
            item['GatewayDesc'],
            item['GatewayName'],
            item['Mem'],
            item['PackageVersion'],
            JSON.stringify(item['SubnetIds'])
        ]);
    }
    else {
        const { Error: { Message } } = res;
        throw new error_1.CloudBaseError(Message);
    }
});
exports.listStandalonegateway = listStandalonegateway;
