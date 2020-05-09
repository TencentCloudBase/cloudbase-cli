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
const constants_1 = require("./constants");
function InjectParams() {
    return function (target, key, descriptor) {
        const rawFunc = descriptor.value;
        const paramMetadata = Reflect.getMetadata(constants_1.PARAM_METADATA, target[key]);
        if (paramMetadata) {
            descriptor.value = function (...args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const ctx = args[0] || {};
                    for (const paramKey in paramMetadata) {
                        if (Object.prototype.hasOwnProperty.call(paramMetadata, paramKey)) {
                            const { getter, index } = paramMetadata[paramKey];
                            switch (paramKey) {
                                case constants_1.ParamTypes.CmdContext:
                                    args[index] = ctx;
                                    break;
                                case constants_1.ParamTypes.Config:
                                    args[index] = ctx.config;
                                    break;
                                case constants_1.ParamTypes.ArgsParams:
                                    args[index] = ctx.params;
                                    break;
                                case constants_1.ParamTypes.ArgsOptions:
                                    args[index] = ctx.options;
                                    break;
                                case constants_1.ParamTypes.EnvId:
                                    args[index] = ctx.envId;
                                    break;
                                default: {
                                    const injectValue = yield getter(target);
                                    args[index] = injectValue;
                                }
                            }
                        }
                    }
                    return rawFunc.apply(this, args);
                });
            };
        }
        return descriptor;
    };
}
exports.InjectParams = InjectParams;
