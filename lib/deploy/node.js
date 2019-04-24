"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_zip_1 = require("../builder/node-zip");
const node_zip_2 = require("../uploader/node-zip");
const node_1 = require("../controller/node");
const base_1 = require("./base");
const path = require("path");
const del = require("del");
class NodeDeploy extends base_1.default {
    constructor(config) {
        config = Object.assign({ username: 'root', port: 22, distPath: './.tcb-dist', remotePath: `/data/tcb-service/${config.name}` }, config);
        super(config);
        this.builder = new node_zip_1.default(config);
        this.uploader = new node_zip_2.default(config);
        this.controller = new node_1.default(config);
    }
    clear() {
        const distPath = path.resolve(__dirname, this._config.distPath);
        del.sync([distPath]);
    }
    async deploy() {
        await this.builder.clean();
        const buildResult = await this.builder.build();
        await this.uploader.upload();
        await this.builder.clean();
        await this.controller.start({ vemo: buildResult.vemo });
    }
}
exports.default = NodeDeploy;
