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
exports.getLoginState = exports.authSupevisor = exports.getCloudBaseConfig = exports.getArgs = void 0;
const arg_1 = __importDefault(require("arg"));
const path_1 = __importDefault(require("path"));
const toolbox_1 = require("@cloudbase/toolbox");
const tools_1 = require("./tools");
const constant_1 = require("../constant");
exports.getArgs = () => {
    const args = arg_1.default({
        '--config-path': String(),
        '--envId': String(),
        '--verbose': String(),
        '-e': '--envId'
    }, { permissive: true, argv: process.argv.slice(2) });
    return args;
};
exports.getCloudBaseConfig = (configPath) => __awaiter(void 0, void 0, void 0, function* () {
    const args = exports.getArgs();
    let specificConfigPath = configPath || args['--config-path'];
    specificConfigPath = specificConfigPath ? path_1.default.resolve(specificConfigPath) : undefined;
    const parser = new toolbox_1.ConfigParser({
        configPath: specificConfigPath
    });
    const config = yield parser.get();
    return config;
});
exports.authSupevisor = toolbox_1.AuthSupevisor.getInstance({
    cache: true,
    proxy: tools_1.getProxy(),
    timeout: constant_1.REQUEST_TIMEOUT
});
function getLoginState() {
    return __awaiter(this, void 0, void 0, function* () {
        return exports.authSupevisor.getLoginState();
    });
}
exports.getLoginState = getLoginState;
