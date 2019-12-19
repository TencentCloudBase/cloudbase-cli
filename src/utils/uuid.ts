import crypto from 'crypto'

export function random(len = 8) {
    if (!Number.isInteger(len)) {
        throw new Error('len must be an integer')
    }
    return crypto
        .randomBytes(len)
        .toString('hex')
        .substring(0, len)
}

export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}
