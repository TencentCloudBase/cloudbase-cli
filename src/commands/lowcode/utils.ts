import { get, merge } from 'lodash'
import { CloudBaseError } from '@cloudbase/toolbox'
import { ChildProcess } from 'child_process'

export function promisifyProcess(p: ChildProcess, pipe = false) {
    return new Promise((resolve, reject) => {
        let stdout = ''
        let stderr = ''

        p.stdout.on('data', (data) => {
            stdout += String(data)
        })
        p.stderr.on('data', (data) => {
            stderr += String(data)
        })
        p.on('error', reject)
        p.on('exit', (exitCode) => {
            exitCode === 0
                ? resolve(stdout)
                : reject(new CloudBaseError(stderr || String(exitCode)))
        })

        if (pipe) {
            p.stdout.pipe(process.stdout)
            p.stderr.pipe(process.stderr)
        }
    })
}

export async function getLowcodeCli(): Promise<typeof import('@cloudbase/lowcode-cli')> {
    const key = '@cloudbase/lowcode-cli'
    const cache = new Map()
    let result: typeof import('@cloudbase/lowcode-cli')
    if (!cache.get(key)) {
        const module = await import(key)
        cache.set(key, module)
    }
    result = cache.get(key)
    return result
}

export function getCmdConfig(config, options: { cmd: string; childCmd: string }) {
    return get(config, `${options.cmd}["${options.childCmd}"]`)
}

export function getMergedOptions(config = {}, argOptions = {}) {
    return merge({}, (config as any).inputs || {}, argOptions)
}
