"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_zip_1 = require("./builder/node-zip");
const node_zip_2 = require("./uploader/node-zip");
const node_1 = require("./controller/node");
const path = require("path");
const del = require("del");
class Deploy {
    constructor(config) {
        this._config = config;
    }
    deploy() {
    }
}
exports.default = Deploy;
class NodeDeploy extends Deploy {
    constructor(config = {
        host: '',
        username: 'root',
        port: 22,
        password: '',
        entry: '',
        distPath: './dist',
        remotePath: '/root/'
    }) {
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
        this.clear();
        await this.builder.build();
        await this.uploader.upload();
        await this.controller.reload();
    }
}
exports.NodeDeploy = NodeDeploy;
new NodeDeploy({
    host: '10.85.27.207',
    username: 'root',
    port: 36000,
    password: 'tpcloud@123',
    entry: './test/server.js',
    distPath: './dist',
    remotePath: '/root/dist'
}).deploy();
