"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const path = require("path");
exports.TCBRC = path.resolve(os.homedir(), '.tcbrc.json');
