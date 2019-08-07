"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const function_1 = __importDefault(require("../builder/function"));
const function_2 = __importDefault(require("../uploader/function"));
const base_1 = __importDefault(require("./base"));
const logger_1 = __importDefault(require("../logger"));
const path_1 = __importDefault(require("path"));
const logger = new logger_1.default('FunctionDeploy');
class FunctionDeploy extends base_1.default {
    constructor(config) {
        if (!config.distPath) {
            config.distPath = path_1.default.resolve(process.cwd(), 'dist');
        }
        super(config);
        this.builder = new function_1.default(config);
        this.uploader = new function_2.default(config);
    }
    async deploy() {
        await this.builder.clean();
        await this.builder.build();
        try {
            await this.uploader.upload();
        }
        catch (e) {
            if (e.message) {
                logger.error(e.message);
                await this.builder.clean();
                return;
            }
        }
        await this.builder.clean();
        logger.success(`Depoly serverless function "${this._config.name}" success!`);
    }
}
exports.FunctionDeploy = FunctionDeploy;
