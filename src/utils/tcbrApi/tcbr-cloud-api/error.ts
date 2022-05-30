interface Options {
    exit?: number;
    original?: Error | undefined;
    code?: string | number;
    requestId?: string;
    action?: string;
    type?: string;
}

export class CloudBaseError extends Error {
    readonly exit: number;
    readonly message: string;
    readonly name = 'CloudBaseError';
    readonly original: Error | undefined;
    readonly code: string | number;
    readonly requestId: string;
    readonly action: string;
    readonly type: string;

    constructor(message: string, options: Options = {}) {
      super()
      const { code = '', action = '', original = null, requestId = '', type } = options
      this.message = `[${action}]\nRequestId：${requestId}\n${message}`
      this.original = original
      this.code = code
      this.requestId = requestId
      this.action = action
      this.type = type
    }
}
