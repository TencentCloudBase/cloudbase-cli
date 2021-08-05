"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.standalonegatewayCommonOptions = void 0;
const standalonegatewayCommonOptions = (sub) => ({
    cmd: 'run',
    childCmd: {
        cmd: 'standalonegateway',
        desc: '云托管小租户网关管理'
    },
    childSubCmd: sub
});
exports.standalonegatewayCommonOptions = standalonegatewayCommonOptions;
