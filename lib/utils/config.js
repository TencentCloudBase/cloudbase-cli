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
exports.getCloudBaseConfig = exports.getArgs = void 0;
const lodash_1 = __importDefault(require("lodash"));
const path_1 = __importDefault(require("path"));
const yargs_1 = __importDefault(require("yargs"));
const toolbox_1 = require("@cloudbase/toolbox");
const getArgs = () => {
    return yargs_1.default.alias('e', 'envId').alias('r', 'region').argv;
};
exports.getArgs = getArgs;
const getCloudBaseConfig = (configPath) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const args = exports.getArgs();
    let specificConfigPath = configPath || args.configPath;
    specificConfigPath = specificConfigPath ? path_1.default.resolve(specificConfigPath) : undefined;
    const parser = new toolbox_1.ConfigParser({
        configPath: specificConfigPath
    });
    const config = yield parser.get();
    if ((config === null || config === void 0 ? void 0 : config.functionDefaultConfig) && ((_a = config === null || config === void 0 ? void 0 : config.functions) === null || _a === void 0 ? void 0 : _a.length)) {
        config.functions = config.functions.map((rawConfig) => lodash_1.default.merge({}, config.functionDefaultConfig, rawConfig));
    }
    return config;
});
exports.getCloudBaseConfig = getCloudBaseConfig;
