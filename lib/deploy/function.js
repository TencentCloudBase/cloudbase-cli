"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const function_1 = require("../builder/function");
const function_2 = require("../uploader/function");
const base_1 = require("./base");
const logger_1 = require("../logger");
const logger = new logger_1.default('FunctionDeploy');
class FunctionDeploy extends base_1.default {
    constructor(config) {
        if (!config.distPath) {
            config.distPath = './dist';
        }
        super(config);
        this.builder = new function_1.default(config);
        this.uploader = new function_2.default(config);
    }
    async deploy(start = false) {
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
        logger.log(`Depoly serverless function "${this._config.name}" success!`);
    }
}
exports.default = FunctionDeploy;
