"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TcbError extends Error {
    constructor(message, options = {}) {
        super();
        this.name = 'TcbError';
        this.message = message;
        this.original = options.original;
        this.code = options.code;
    }
}
exports.TcbError = TcbError;
