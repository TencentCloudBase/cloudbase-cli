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
const manager_node_1 = __importDefault(require("@cloudbase/manager-node"));
const credential_1 = require("./credential");
const tools_1 = require("./tools");
function getMangerService(envId = '') {
    return __awaiter(this, void 0, void 0, function* () {
        const { secretId, secretKey, token } = yield credential_1.checkAndGetCredential(true);
        const app = new manager_node_1.default({
            secretId,
            secretKey,
            token,
            envId,
            proxy: tools_1.getProxy()
        });
        return app;
    });
}
exports.getMangerService = getMangerService;
