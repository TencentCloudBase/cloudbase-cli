export declare type AsyncTask = () => Promise<any>;
export declare class AsyncTaskParallelController {
    maxParallel: number;
    tasks: AsyncTask[];
    checkInterval: number;
    totalTasks: number;
    constructor(maxParallel: number, checkInterval?: number);
    loadTasks(tasks: AsyncTask[]): void;
    push(task: AsyncTask): void;
    run(): Promise<any[]>;
}
