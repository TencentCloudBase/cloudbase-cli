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
exports.deleteImageRepo = exports.describeImageRepo = void 0;
const utils_1 = require("../utils");
const tcbService = utils_1.CloudApiService.getInstance('tcb');
const describeImageRepo = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { ImageRepo } = yield tcbService.request('DescribeCloudBaseRunServer', {
        EnvId: options.envId,
        Limit: options.limit ? options.limit : 100,
        Offset: options.offset ? options.offset : 0,
        ServerName: options.serverName
    });
    return ImageRepo;
});
exports.describeImageRepo = describeImageRepo;
const deleteImageRepo = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { result } = yield tcbService.request('DeleteCloudBaseRunImageRepo', {
        ImageRepo: options.imageRepo
    });
    return result;
});
exports.deleteImageRepo = deleteImageRepo;
