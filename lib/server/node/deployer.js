"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builder_1 = __importDefault(require("./builder"));
const uploader_1 = __importDefault(require("./uploader"));
class NodeDeployer {
    constructor(config) {
        this.config = Object.assign({}, config);
        this.builder = new builder_1.default(this.config);
        this.uploader = new uploader_1.default(this.config);
    }
    async deploy() {
        await this.builder.clean();
        const buildResult = await this.builder.build();
        await this.uploader.upload();
        await this.builder.clean();
        return buildResult;
    }
}
exports.NodeDeployer = NodeDeployer;
