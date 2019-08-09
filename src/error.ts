interface Options {
    exit?: number
    original?: Error | undefined
}

export class TcbError extends Error {
    readonly exit: number
    readonly message: string
    readonly name = 'TcbError'
    readonly original: Error | undefined

    constructor(message: string, options: Options = {}) {
        super()
        this.message = message
        this.original = options.original
    }
}
