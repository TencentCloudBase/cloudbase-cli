"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const ncc = require("@zeit/ncc");
class NodeBuilder extends base_1.default {
    constructor(options) {
        super(options);
    }
    /**
     * .js -> .js
     *        assets
     */
    async build() {
        const { entry, dest } = this._options;
        const { code, map, assets } = await ncc(entry);
        fs.writeFileSync(dest, code);
        for (let asset in assets) {
            fs.writeFileSync(`${dest}/${asset}`, assets[asset].source);
        }
        return;
    }
}
exports.default = NodeBuilder;
