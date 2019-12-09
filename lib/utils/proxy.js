"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getProxy() {
    const httpProxy = process.env.http_proxy || process.env.HTTP_PROXY;
    const isTestMode = process.env.TCB_TEST_MODE;
    return isTestMode ? process.env.TCB_TEST_PROXY || httpProxy : httpProxy;
}
exports.getProxy = getProxy;
