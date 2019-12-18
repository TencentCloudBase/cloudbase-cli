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
const error_1 = require("../../error");
const gateway_1 = require("../../gateway");
const utils_1 = require("../../utils");
function unbindGwDomain(ctx, domain) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId } = ctx;
        if (!domain) {
            throw new error_1.CloudBaseError('请指定需要解绑的HTTP service域名！');
        }
        const loading = utils_1.loadingFactory();
        loading.start(`HTTP service域名 [${domain}] 解绑中...`);
        try {
            yield gateway_1.unbindGatewayDomain({
                envId,
                domain
            });
            loading.succeed(`HTTP service域名 [${domain}] 解绑成功！`);
        }
        catch (e) {
            loading.stop();
            throw e;
        }
    });
}
exports.unbindGwDomain = unbindGwDomain;
