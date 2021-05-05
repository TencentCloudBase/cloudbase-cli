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
exports.listBranch = exports.listRepo = void 0;
const utils_1 = require("../../utils");
const tcbService = utils_1.CloudApiService.getInstance('tcb');
const listRepo = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { IsFinished, RepoList, Error } = yield tcbService.request('DescribeCloudBaseCodeRepos', {
        Channel: options.channel,
        PageNumber: options.pageNumber,
        PageSize: options.pageSize
    });
    return { IsFinished, RepoList, Error };
});
exports.listRepo = listRepo;
const listBranch = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { IsFinished, BranchList } = yield tcbService.request('DescribeCloudBaseCodeBranch', {
        Channel: options.channel,
        PageNumber: options.pageNumber,
        PageSize: options.pageSize,
        RepoName: options.repoName
    });
    return { IsFinished, BranchList };
});
exports.listBranch = listBranch;
