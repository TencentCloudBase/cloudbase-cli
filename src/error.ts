interface Options {
    exit?: number;
}

export function TcbError(msg: string, options: Options = {}) {
    const { exit = 1 } = options
    this.name = 'TcbError'
    this.message = `TcbError: ${msg}`
    this.exit = exit
}
