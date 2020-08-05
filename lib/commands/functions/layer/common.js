"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.layerCommonOptions = void 0;
exports.layerCommonOptions = (sub) => ({
    cmd: 'fn',
    childCmd: {
        cmd: 'layer',
        desc: '函数层管理'
    },
    childSubCmd: sub
});
