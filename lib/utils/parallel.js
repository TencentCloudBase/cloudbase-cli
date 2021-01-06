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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncTaskParallelController = void 0;
class AsyncTaskParallelController {
    constructor(maxParallel, checkInterval = 20) {
        this.tasks = [];
        this.maxParallel = Number(maxParallel) || 20;
        this.checkInterval = checkInterval;
    }
    loadTasks(tasks) {
        this.tasks.push(...tasks);
        this.totalTasks = this.tasks.length;
    }
    push(task) {
        this.tasks.push(task);
        this.totalTasks = this.tasks.length;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            const taskHasRun = [];
            const taskDone = [];
            let runningTask = 0;
            return new Promise((resolve) => {
                const timer = setInterval(() => {
                    const taskDoneLength = taskDone.filter((item) => item).length;
                    if (runningTask === 0 && taskDoneLength === this.totalTasks) {
                        clearInterval(timer);
                        resolve(results);
                    }
                    if (runningTask >= this.maxParallel) {
                        return;
                    }
                    this.tasks.forEach((task, index) => {
                        if (!taskHasRun[index] && runningTask < this.maxParallel) {
                            runningTask++;
                            taskHasRun[index] = 1;
                            task()
                                .then((res) => {
                                results[index] = res;
                            })
                                .catch((err) => {
                                results[index] = err;
                            })
                                .then(() => {
                                runningTask--;
                                taskDone[index] = 1;
                            });
                        }
                    });
                }, this.checkInterval);
            });
        });
    }
}
exports.AsyncTaskParallelController = AsyncTaskParallelController;
