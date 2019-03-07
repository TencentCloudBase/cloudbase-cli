"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const websocket_1 = require("../builder/websocket");
const node_zip_1 = require("../uploader/node-zip");
const node_1 = require("../controller/node");
const base_1 = require("./base");
class NodeDeploy extends base_1.default {
    constructor(config) {
        config = Object.assign({ username: 'root', port: 22, distPath: './dist', remotePath: '/root/' }, config);
        super(config);
        this.builder = new websocket_1.default(config);
        this.uploader = new node_zip_1.default(config);
        this.controller = new node_1.default(config);
    }
    async deploy(start = false) {
        await this.builder.clean();
        await this.builder.build();
        await this.uploader.upload();
        await this.controller.npmInstall();
        if (start) {
            await this.controller.start({ isSingle: true });
        }
        else {
            await this.controller.reload({ isSingle: true });
        }
        await this.builder.clean();
    }
}
exports.default = NodeDeploy;
