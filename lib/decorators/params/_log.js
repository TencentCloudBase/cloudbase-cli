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
const chalk_1 = __importDefault(require("chalk"));
const log_symbols_1 = __importDefault(require("log-symbols"));
const util_1 = require("util");
const console_1 = require("console");
const terminal_link_1 = __importDefault(require("terminal-link"));
class Logger {
    constructor(options = {}) {
        this.c = {
            _times: new Map(),
            log(a, ...args) {
                this.debug(util_1.format(a, ...args));
            }
        };
        const { verbose } = options;
        this.verboseEnabled = verbose;
    }
    breakLine() {
        console.log();
    }
    log(...args) {
        console.log(...args);
    }
    info(msg) {
        console.log(`${log_symbols_1.default.info} ${msg}`);
    }
    success(msg) {
        console.log(`${log_symbols_1.default.success} ${msg}`);
    }
    warn(msg) {
        console.log(`${log_symbols_1.default.warning} ${msg}`);
    }
    error(msg) {
        console.log(`${log_symbols_1.default.error} ${msg}`);
    }
    verbose(...args) {
        if (this.verboseEnabled) {
            const msg = args.join(' ▶️ ');
            console.log(`${chalk_1.default.bold('[debug]')} ${chalk_1.default.gray(`[${new Date().toISOString()}]`)} ${msg}`);
        }
    }
    genClickableLink(link) {
        if (terminal_link_1.default.isSupported) {
            const clickablelink = terminal_link_1.default(link, link);
            return chalk_1.default.bold.cyan(clickablelink);
        }
        return chalk_1.default.bold.underline.cyan(link);
    }
    printClickableLink(link) {
        const clickLink = this.genClickableLink(link);
        this.info(clickLink);
    }
    time(label, fn) {
        return __awaiter(this, void 0, void 0, function* () {
            const promise = typeof fn === 'function' ? fn() : fn;
            if (this.verboseEnabled) {
                this.c.log(label);
                console_1.Console.prototype.time.call(this.c, label);
                const r = yield promise;
                console_1.Console.prototype.timeEnd.call(this.c, label);
                return r;
            }
            return promise;
        });
    }
}
exports.Logger = Logger;
