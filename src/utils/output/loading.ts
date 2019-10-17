import ora from 'ora'

/**
 * 一般场景，不会出现混乱的情况，直接使用 start 方法
 * 批量操作场景时，每个操作使用 init 返回 ora 实例，用于区分每个操作的结果
 */
class Loading {
    private spinner: ReturnType<typeof ora>

    constructor() {
        // @ts-ignore
        process.on('tcbExit', this.stop)
    }

    init(): ReturnType<typeof ora> {
        this.spinner = ora()
        return this.spinner
    }

    start(text: string) {
        this.init()
        this.spinner.start(text)
    }

    stop() {
        this.spinner && this.spinner.stop()
    }

    succeed(text: string) {
        this.spinner && this.spinner.succeed(text)
    }

    fail(text: string) {
        this.spinner && this.spinner.fail(text)
    }
}

export const loading = new Loading()
