/**
 * @inner
 */
class TencentCloudSDKHttpException extends Error {
    constructor(error, requestId = '', code = '') {
        super(error)
        this.requestId = requestId || ''
        this.name = 'TencentCloudSDKHttpException'
        this.code = code
        this.message =
            'API 请求异常' +
            `\nCode: ${code}` +
            '\nMessage: ' +
            error +
            '\nRequestId: ' +
            requestId
    }

    getMessage() {
        return this.message
    }

    getRequestId() {
        return this.requestId
    }

    toString() {
        return (
            'API 请求异常' +
            `\nCode: ${this.code}` +
            '\nMessage: ' +
            this.getMessage() +
            '\nRequestId: ' +
            this.getRequestId()
        )
    }

    toLocaleString() {
        return (
            'API 请求异常' +
            'message:' +
            this.getMessage() +
            '  requestId:' +
            this.getRequestId()
        )
    }
}
module.exports = TencentCloudSDKHttpException
