"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const makeDir = require("make-dir");
const logger_1 = require("../logger");
const utils_1 = require("../utils");
const del = require("del");
const logger = new logger_1.default('WebsocketBuilder');
class WebsocketBuilder {
    constructor(options) {
        options = Object.assign({ username: 'root', port: 22, distPath: './dist', remotePath: '/root/' }, options);
        this._options = options;
    }
    /**
     * .js -> .js
     *        assets
     */
    async build() {
        console.log(this);
        await this.clean();
        const { distPath, entry } = this._options;
        const tmpPath = './.tmp';
        await makeDir(distPath);
        await makeDir(tmpPath);
        const templateRoot = `${__dirname}/../../assets/websocket-template`;
        // 注入 secret
        let indexContent = fs.readFileSync(`${templateRoot}/index.js`, 'utf-8');
        indexContent = indexContent.replace(/SECRET_ID_PLACEHOLDER/, this._options.secretId);
        indexContent = indexContent.replace(/SECRET_KEY_PLACEHOLDER/, this._options.secretKey);
        fs.writeFileSync(path.resolve(process.cwd(), `${tmpPath}/index.js`), indexContent);
        // 复制其它文件
        fs.copyFileSync(`${templateRoot}/package.json`, path.resolve(process.cwd(), `${tmpPath}/package.json`));
        fs.copyFileSync(path.resolve(process.cwd(), entry), path.resolve(process.cwd(), `${tmpPath}/app.js`));
        await utils_1.zipDir(path.resolve(process.cwd(), tmpPath), path.resolve(process.cwd(), `${distPath}/dist.zip`));
        return;
    }
    async clean() {
        const distPath = path.resolve(process.cwd(), this._options.distPath);
        const tmpPath = './.tmp';
        del.sync([distPath, tmpPath]);
    }
}
exports.default = WebsocketBuilder;
