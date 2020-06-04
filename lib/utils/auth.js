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
const arg_1 = __importDefault(require("arg"));
const path_1 = __importDefault(require("path"));
const toolbox_1 = require("@cloudbase/toolbox");
const tools_1 = require("./tools");
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
    const assignConfigPath = configPath || args['--config-path'] || process.cwd();
    const projectPath = path_1.default.resolve(assignConfigPath);
    const config = yield toolbox_1.resolveCloudBaseConfig({
        searchFrom: projectPath
    });
    return config;
});
exports.authSupevisor = toolbox_1.AuthSupevisor.getInstance({
    proxy: tools_1.getProxy(),
    cache: true
});
function getLoginState() {
    return __awaiter(this, void 0, void 0, function* () {
        return exports.authSupevisor.getLoginState();
    });
}
exports.getLoginState = getLoginState;
