"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageCommonOptions = void 0;
const imageCommonOptions = (sub) => ({
    cmd: 'run',
    childCmd: {
        cmd: 'image',
        desc: '云托管镜像管理'
    },
    childSubCmd: sub
});
exports.imageCommonOptions = imageCommonOptions;
