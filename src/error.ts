interface Options {
    exit?: number
    original?: Error | undefined
    code?: string | number
}

export class TcbError extends Error {
    readonly exit: number
    readonly message: string
    readonly name = 'TcbError'
    readonly original: Error | undefined
    readonly code: string | number

    constructor(message: string, options: Options = {}) {
        super()
        this.message = message
        this.original = options.original
        this.code = options.code
    }
}
