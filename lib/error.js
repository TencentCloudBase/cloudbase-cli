"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CloudBaseError extends Error {
    constructor(message, options = {}) {
        super();
        this.name = 'CloudBaseError';
        this.message = message;
        this.original = options.original;
        this.code = options.code;
        this.requestId = options.requestId;
    }
}
exports.CloudBaseError = CloudBaseError;
