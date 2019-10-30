"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ora_1 = __importDefault(require("ora"));
class Loading {
    constructor() {
        process.on('tcbExit', this.stop.bind(this));
        this.spinner = ora_1.default({
            discardStdin: false
        });
    }
    start(text) {
        this.spinner = this.spinner.start(text);
    }
    stop() {
        if (this.spinner) {
            this.spinner = this.spinner.stop();
        }
    }
    succeed(text) {
        if (this.spinner) {
            this.spinner = this.spinner.succeed(text);
        }
    }
    fail(text) {
        if (this.spinner) {
            this.spinner = this.spinner.fail(text);
        }
    }
}
exports.loadingFactory = () => {
    return new Loading();
};
