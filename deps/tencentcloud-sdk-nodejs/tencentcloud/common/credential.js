/**
 * 认证信息类
 * @class
 */
class Credential {
    /**
     * @param {string} secretId
     * @param {string} secretKey
     * @param {string=} token
     */
    constructor(secretId, secretKey, token) {
        /**
         * secretId,可在控制台获取
         * @type {string || null}
         */
        this.secretId = secretId || '';

        /**
         * secretKey,可在控制台获取
         * @type {string || null}
         */
        this.secretKey = secretKey || '';

        /**
         * token
         * @type {string || null}
         */
        this.token = token || ''
    }
}
module.exports = Credential;

