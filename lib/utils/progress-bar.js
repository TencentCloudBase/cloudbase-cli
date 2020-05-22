"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const progress_1 = __importDefault(require("progress"));
function createUploadProgressBar(onFinished, onStart) {
    let bar;
    let lastLoaded = 0;
    let finished = false;
    return function (data) {
        const { total, loaded, percent } = data;
        if (lastLoaded === 0 && onStart) {
            onStart();
        }
        if (+percent === 1) {
            if (finished)
                return;
            finished = true;
            setTimeout(() => {
                onFinished();
            }, 500);
            bar.tick(total - lastLoaded);
            return;
        }
        const tick = loaded - lastLoaded;
        lastLoaded = loaded;
        if (bar) {
            bar.tick(tick);
        }
        else {
            bar = new progress_1.default('文件传输中 [:bar] :percent :etas', {
                total,
                complete: '=',
                incomplete: ' ',
                width: 50
            });
            bar.tick(tick);
        }
    };
}
exports.createUploadProgressBar = createUploadProgressBar;
