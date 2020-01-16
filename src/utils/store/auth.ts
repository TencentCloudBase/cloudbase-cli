import { getDB } from './db'

export function getAuthDB() {
    const db = getDB('auth')
    return db
}
