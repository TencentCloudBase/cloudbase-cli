interface Options {
    exit?: number
    original?: Error | undefined
    code?: string | number
    requestId?: string
    action?: string
    meta?: Record<string, any>
}

export class CloudBaseError extends Error {
    readonly exit: number
    readonly message: string
    readonly name = 'CloudBaseError'
    readonly original: Error | undefined
    readonly code: string | number
    readonly requestId: string
    readonly action: string
    readonly meta: any

    constructor(message: string, options: Options = {}) {
        super()
        this.message = message
        const {
            code = '',
            action = '',
            original = null,
            requestId = '',
            meta = {}
        } = options
        this.original = original
        this.code = code
        this.requestId = requestId
        this.action = action
        this.meta = meta
    }
}
