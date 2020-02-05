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
const tabtab_1 = __importDefault(require("tabtab"));
const error_1 = require("../../error");
function installCompletion() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield tabtab_1.default.install({
                name: 'tcb',
                completer: 'tcb'
            });
        }
        catch (e) {
            throw new error_1.CloudBaseError('安装失败！');
        }
    });
}
exports.installCompletion = installCompletion;
function unInstallCompletion() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield tabtab_1.default.uninstall({
                name: 'tcb',
                completer: 'tcb'
            });
        }
        catch (e) {
            throw new error_1.CloudBaseError('卸载失败！');
        }
    });
}
exports.unInstallCompletion = unInstallCompletion;
