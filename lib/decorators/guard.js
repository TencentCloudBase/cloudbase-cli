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
exports.AuthGuard = void 0;
const utils_1 = require("../utils");
const AuthGuard = (options = {}) => (target, key, descriptor) => {
    const { tips, ensureConfig = true } = options;
    const rawFunc = descriptor.value;
    descriptor.value = function (...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const credential = target === null || target === void 0 ? void 0 : target.credential;
            const loginState = yield utils_1.authSupevisor.getLoginState();
            if (!credential && !loginState) {
                return;
            }
            if (ensureConfig) {
                const config = yield utils_1.getCloudBaseConfig();
                if (!(config === null || config === void 0 ? void 0 : config.envId)) {
                    return;
                }
            }
            return rawFunc.apply(this, args);
        });
    };
    return descriptor;
};
exports.AuthGuard = AuthGuard;
