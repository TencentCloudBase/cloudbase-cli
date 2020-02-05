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
const address_1 = __importDefault(require("address"));
const tools_1 = require("../tools");
function getMacAddress() {
    return new Promise(resolve => {
        address_1.default.mac((err, mac) => {
            if (err) {
                resolve('');
                return;
            }
            resolve(mac);
        });
    });
}
exports.getMacAddress = getMacAddress;
function getMacAddressMd5() {
    return __awaiter(this, void 0, void 0, function* () {
        const mac = yield getMacAddress();
        const macMD5 = tools_1.md5(mac);
        return macMD5;
    });
}
exports.getMacAddressMd5 = getMacAddressMd5;
