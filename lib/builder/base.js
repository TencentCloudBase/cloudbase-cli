"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Builder {
    constructor(options) {
        this._options = options;
    }
    async build() {
        throw new Error('Builder.build() is not implemented.');
    }
    watch() {
        throw new Error('Builder.watch() is not implemented.');
    }
    log() {
    }
}
exports.default = Builder;
