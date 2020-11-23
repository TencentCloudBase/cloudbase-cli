"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deprecate = void 0;
const _log_1 = require("./params/_log");
const Deprecate = (options) => (target, key, descriptor) => {
    const { tip, allowExecute } = options;
    const rawFunc = descriptor.value;
    descriptor.value = function (...args) {
        const log = new _log_1.Logger();
        log.error(tip || '此命令已废弃！');
        if (allowExecute) {
            rawFunc.apply(this, args);
        }
    };
    return descriptor;
};
exports.Deprecate = Deprecate;
