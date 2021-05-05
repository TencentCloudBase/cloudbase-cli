"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionCommonOptions = void 0;
const versionCommonOptions = (sub) => ({
    cmd: 'run',
    childCmd: {
        cmd: 'version',
        desc: '云托管版本管理'
    },
    childSubCmd: sub
});
exports.versionCommonOptions = versionCommonOptions;
