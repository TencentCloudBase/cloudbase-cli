import ora from 'ora'

class Loading {
    private spinner: ReturnType<typeof ora>

    constructor() {
        // @ts-ignore
        process.on('tcbExit', this.stop.bind(this))
        // @ts-ignore
        process.on('tcbError', this.stop.bind(this))
        this.spinner = ora({
            discardStdin: false
        })
    }

    set text(text: string) {
        this.spinner.text = text
    }

    start(text: string) {
        this.spinner = this.spinner.start(text)
    }

    stop() {
        if (this.spinner) {
            this.spinner = this.spinner.stop()
        }
    }

    succeed(text: string) {
        if (this.spinner) {
            this.spinner = this.spinner.succeed(text)
        }
    }

    fail(text: string) {
        if (this.spinner) {
            this.spinner = this.spinner.fail(text)
        }
    }
}

export const loadingFactory = (): Loading => {
    return new Loading()
}

type Task<T> = (flush: (text: string) => void, ...args: any[]) => Promise<T>

export interface ILoadingOptions {
    startTip?: string
    successTip?: string
    failTip?: string
}

/**
 * 执行异步任务，显示 loading 动画
 * @param task
 * @param options
 */
export const execWithLoading = async <T>(
    task: Task<T>,
    options: ILoadingOptions = {}
): Promise<T> => {
    const { startTip, successTip, failTip } = options
    const loading = loadingFactory()

    // 刷新 loading 提示
    const flush = (text: string) => {
        loading.text = text
    }

    try {
        loading.start(startTip)
        const res = await task(flush)
        successTip ? loading.succeed(successTip) : loading.stop()
        return res
    } catch (e) {
        failTip ? loading.fail(failTip) : loading.stop()
        throw e
    }
}
