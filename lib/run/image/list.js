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
exports.listImage = exports.getImageRepo = void 0;
const utils_1 = require("../../utils");
const tcrService = utils_1.CloudApiService.getInstance('tcr');
const tcbService = utils_1.CloudApiService.getInstance('tcb');
const getImageRepo = () => __awaiter(void 0, void 0, void 0, function* () {
    const { Data: { RepoInfo } } = yield tcrService.request('DescribeRepositoryFilterPersonal');
    return RepoInfo;
});
exports.getImageRepo = getImageRepo;
const listImage = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { Images } = yield tcbService.request('DescribeCloudBaseRunImages', {
        EnvId: options.envId,
        ServiceName: options.serviceName,
        Limit: options.limit,
        Offset: options.offset
    });
    return Images;
});
exports.listImage = listImage;
