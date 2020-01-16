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

export const loadingFactory = () => {
    return new Loading()
}
