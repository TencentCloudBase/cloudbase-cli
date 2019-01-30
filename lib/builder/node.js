"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ncc = require("@zeit/ncc");
const fs = require("fs");
const path = require("path");
const makeDir = require("make-dir");
const logger_1 = require("../logger");
const logger = new logger_1.default('NodeBuilder');
class NodeBuilder {
    constructor(options) {
        this._options = options;
    }
    /**
     * .js -> .js
     *        assets
     */
    async build() {
        const entry = path.resolve(process.cwd(), this._options.entry);
        const distPath = path.resolve(process.cwd(), this._options.distPath);
        logger.log(`Building ${entry} to ${distPath}`);
        const { code, map, assets } = await ncc(entry);
        const filename = path.basename(entry);
        await makeDir(distPath);
        fs.writeFileSync(`${distPath}/${filename}`, code);
        for (let asset in assets) {
            fs.writeFileSync(`${distPath}/${asset}`, assets[asset].source);
        }
        const finalAssets = [`${distPath}/${filename}`, ...Object.keys(assets).map(asset => `${distPath}/${asset}`)];
        logger.log('Building success!');
        finalAssets.forEach(asset => logger.log('=> ' + asset));
        return {
            success: true,
            assets: finalAssets
        };
    }
}
exports.default = NodeBuilder;
