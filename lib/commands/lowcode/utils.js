"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promisifyProcess = void 0;
const toolbox_1 = require("@cloudbase/toolbox");
function promisifyProcess(p, pipe = false) {
    return new Promise((resolve, reject) => {
        let stdout = '';
        let stderr = '';
        p.stdout.on('data', (data => {
            stdout += String(data);
        }));
        p.stderr.on('data', (data => {
            stderr += String(data);
        }));
        p.on('error', reject);
        p.on('exit', exitCode => {
            exitCode === 0 ? resolve(stdout) : reject(new toolbox_1.CloudBaseError(stderr || String(exitCode)));
        });
        if (pipe) {
            p.stdout.pipe(process.stdout);
            p.stderr.pipe(process.stderr);
        }
    });
}
exports.promisifyProcess = promisifyProcess;
