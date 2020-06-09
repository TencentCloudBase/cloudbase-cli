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
const common_1 = require("./common");
const _log_1 = require("./_log");
const constants_1 = require("../constants");
const utils_1 = require("../../utils");
const EmptyValue = () => { };
exports.Credential = common_1.createParamDecorator(constants_1.ParamTypes.Credential, () => __awaiter(void 0, void 0, void 0, function* () {
    const credential = yield utils_1.authSupevisor.getLoginState();
    return credential;
}));
exports.Log = common_1.createParamDecorator(constants_1.ParamTypes.Log, () => {
    const args = utils_1.getArgs();
    const verbose = process.VERBOSE || args['--verbose'];
    const log = new _log_1.Logger({
        verbose
    });
    return log;
});
exports.CmdContext = common_1.createParamDecorator(constants_1.ParamTypes.CmdContext, EmptyValue);
exports.ArgsOptions = common_1.createParamDecorator(constants_1.ParamTypes.ArgsOptions, EmptyValue);
exports.ArgsParams = common_1.createParamDecorator(constants_1.ParamTypes.ArgsParams, EmptyValue);
exports.EnvId = common_1.createParamDecorator(constants_1.ParamTypes.EnvId, EmptyValue);
exports.Config = common_1.createParamDecorator(constants_1.ParamTypes.Config, EmptyValue);
