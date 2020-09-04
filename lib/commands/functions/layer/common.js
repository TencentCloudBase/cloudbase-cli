"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.layerCommonOptions = void 0;
exports.layerCommonOptions = (sub) => ({
    cmd: 'fn',
    childCmd: {
        cmd: 'layer',
        desc: '云函数层管理'
    },
    childSubCmd: sub
});
