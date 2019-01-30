"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const makeDir = require("make-dir");
const logger_1 = require("../logger");
const utils_1 = require("../utils");
const del = require("del");
const logger = new logger_1.default('FunctionBuilder');
class FunctionBuilder {
    constructor(options) {
        this._options = options;
    }
    /**
     * .js -> .js
     *        assets
     */
    async build() {
        const entry = path.resolve(process.cwd(), this._options.path);
        const distPath = path.resolve(process.cwd(), this._options.distPath);
        await makeDir(distPath);
        const zipPath = distPath + '/dist.zip';
        logger.log(`Building ${entry} to ${zipPath}`);
        await utils_1.zipDir(entry, zipPath);
        logger.log('Building success!');
        return {
            success: true,
            assets: [zipPath]
        };
    }
    async clean() {
        const distPath = path.resolve(process.cwd(), this._options.distPath);
        del.sync([distPath]);
        return;
    }
}
exports.default = FunctionBuilder;
