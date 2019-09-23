import ora from 'ora'

export function loading(msg: string, timeout: number = 300) {
    let spinner: ReturnType<typeof ora>
    let running = false
    let stopped = false

    // 300ms 后执行
    setTimeout(() => {
        if (stopped) {
            return null
        }

        spinner = ora(msg)
        spinner.start()
        running = true
    }, timeout)

    const cancel = () => {
        stopped = true
        if (running) {
            spinner.stop()
            running = false
        }
        process.removeListener('tcbExit', cancel)
    }

    // @ts-ignore
    process.on('tcbExit', cancel)
    return cancel
}
