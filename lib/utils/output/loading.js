"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ora_1 = __importDefault(require("ora"));
class Loading {
    constructor() {
        process.on('tcbExit', this.stop.bind(this));
        process.on('tcbError', this.stop.bind(this));
        this.spinner = ora_1.default({
            discardStdin: false
        });
    }
    set text(text) {
        this.spinner.text = text;
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
exports.execWithLoading = (task, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const { startTip, successTip, failTip } = options;
    const loading = exports.loadingFactory();
    const flush = (text) => {
        loading.text = text;
    };
    try {
        loading.start(startTip);
        const res = yield task(flush);
        successTip ? loading.succeed(successTip) : loading.stop();
        return res;
    }
    catch (e) {
        failTip ? loading.fail(failTip) : loading.stop();
        throw e;
    }
});
