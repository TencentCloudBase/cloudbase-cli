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
exports.listRun = void 0;
const utils_1 = require("../utils");
const scfService = utils_1.CloudApiService.getInstance('tcb');
function listRun(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { limit = 20, offset = 0, envId } = options;
        const res = yield scfService.request('DescribeCloudBaseRunServers', {
            EnvId: envId,
            Limit: limit,
            Offset: offset
        });
        const { CloudBaseRunServerSet = [] } = res;
        const data = [];
        CloudBaseRunServerSet.forEach(run => {
            const { ServerName, CreatedTime, UpdatedTime, Status, VpcId, ServiceRemark } = run;
            data.push({
                ServerName,
                ServiceRemark,
                CreatedTime,
                UpdatedTime,
                VpcId,
                Status,
            });
        });
        return data;
    });
}
exports.listRun = listRun;
