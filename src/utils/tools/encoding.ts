import crypto from 'crypto'

// MD5
export function md5(str = ''): string {
    const hash = crypto.createHash('md5')
    hash.update(str)
    return hash.digest('hex')
}
