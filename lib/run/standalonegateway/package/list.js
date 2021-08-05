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
exports.listPackageStandalonegateway = void 0;
const yunapi_1 = __importDefault(require("../yunapi"));
const error_1 = require("../../../error");
const listPackageStandalonegateway = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { Response: res } = yield yunapi_1.default('DescribeStandaloneGatewayPackage', {
        EnvId: options.envId,
        AppId: options.appId,
        PackageVersion: options.packageVersion
    });
    const { StandaloneGatewayPackageList } = res;
    if (StandaloneGatewayPackageList === undefined) {
        const { Error: { Message } } = res;
        throw new error_1.CloudBaseError(Message);
    }
    return StandaloneGatewayPackageList.map((item) => [
        item['CPU'],
        item['Mem'],
        item['PackageVersion']
    ]);
});
exports.listPackageStandalonegateway = listPackageStandalonegateway;
