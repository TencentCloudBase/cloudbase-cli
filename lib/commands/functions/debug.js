"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const bootstrapFilePath = path_1.default.join(__dirname, '../../utils/runtime/nodejs/bootstrap.js');
child_process_1.execFile('node', [bootstrapFilePath], {
    cwd: path_1.default.dirname(bootstrapFilePath),
    maxBuffer: 1024 * 1024,
    timeout: 20,
    env: Object.assign(Object.assign({}, process.env), { SCF_FUNCTION_HANDLER: 'index:main', SCF_FUNCTION_NAME: 'main', GLOBAL_USER_FILE_PATH: '/Users/hengechang/Desktop/cloudbase-demo/functions/test/' })
}, (error, stdout, stderr) => {
    if (error) {
        console.log(error);
    }
    console.log(stdout);
    console.log(stderr);
});
