import del from 'del'

export function delSync(patterns: string | readonly string[]) {
    del.sync(patterns, { force: true })
}
