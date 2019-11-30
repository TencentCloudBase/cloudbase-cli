"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CloudBaseError extends Error {
    constructor(message, options = {}) {
        super();
        this.name = 'CloudBaseError';
        this.message = message;
        const { code = '', action = '', original = null, requestId = '', meta = {} } = options;
        this.original = original;
        this.code = code;
        this.requestId = requestId;
        this.action = action;
        this.meta = meta;
    }
}
exports.CloudBaseError = CloudBaseError;
