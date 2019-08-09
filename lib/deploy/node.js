"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_zip_1 = __importDefault(require("../builder/node-zip"));
const node_zip_2 = __importDefault(require("../uploader/node-zip"));
const controller_1 = require("../controller");
const base_1 = __importDefault(require("./base"));
const path_1 = __importDefault(require("path"));
const del_1 = __importDefault(require("del"));
class NodeDeploy extends base_1.default {
    constructor(config) {
        config = Object.assign({ username: 'root', port: '22', distPath: './.tcb-dist', remotePath: `/data/tcb-service/${config.name}` }, config);
        super(config);
        this.builder = new node_zip_1.default(config);
        this.uploader = new node_zip_2.default(config);
        this.controller = new controller_1.NodeController(config);
    }
    clear() {
        const distPath = path_1.default.resolve(__dirname, this._config.distPath);
        del_1.default.sync([distPath]);
    }
    async deploy() {
        await this.builder.clean();
        const buildResult = await this.builder.build();
        await this.uploader.upload();
        await this.builder.clean();
        await this.controller.start({ vemo: buildResult.vemo });
    }
}
exports.NodeDeploy = NodeDeploy;
