interface Options {
    exit?: number
    original?: Error | undefined
    code?: string | number
    requestId?: string
}

export class TcbError extends Error {
    readonly exit: number
    readonly message: string
    readonly name = 'TcbError'
    readonly original: Error | undefined
    readonly code: string | number
    readonly requestId: string

    constructor(message: string, options: Options = {}) {
        super()
        this.message = message
        this.original = options.original
        this.code = options.code
        this.requestId = options.requestId
    }
}
