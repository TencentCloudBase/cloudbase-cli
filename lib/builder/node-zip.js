"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const fs = require("fs");
const path = require("path");
const makeDir = require("make-dir");
const logger_1 = require("../logger");
const archiver = require("archiver");
const logger = new logger_1.default('NodeZipBuilder');
class NodeZipBuilder extends base_1.default {
    constructor(options) {
        super(options);
    }
    /**
     * .js -> .js
     *        assets
     */
    async build() {
        const entry = path.resolve(process.cwd());
        const distPath = path.resolve(process.cwd(), this._options.distPath);
        await makeDir(distPath);
        const zipPath = distPath + '/dist.zip';
        logger.log(`Building ${entry} to ${zipPath}`);
        await zipDir(entry, zipPath);
        logger.log('Building success!');
        return {
            success: true,
            assets: [zipPath]
        };
    }
}
exports.default = NodeZipBuilder;
async function zipDir(dirPath, outputPath) {
    return new Promise((resolve, reject) => {
        var output = fs.createWriteStream(outputPath);
        var archive = archiver('zip');
        output.on('close', function () {
            // console.log(archive.pointer() + ' total bytes');
            // console.log('archiver has been finalized and the output file descriptor has closed.');
            resolve();
        });
        archive.on('error', function (err) {
            reject(err);
        });
        archive.pipe(output);
        archive.directory(dirPath, '');
        archive.finalize();
    });
}
