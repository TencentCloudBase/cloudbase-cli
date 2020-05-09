"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _log_1 = require("./params/_log");
exports.Deprecate = (options) => (target, key, descriptor) => {
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
