import chalk from 'chalk'
import logSymbols from 'log-symbols'
import { format } from 'util'
import { Console } from 'console'
import terminalLink from 'terminal-link'

export class Logger {
    c = {
        _times: new Map(),
        log(a: string, ...args: string[]) {
            this.debug(format(a, ...args))
        }
    }

    verboseEnabled: boolean

    constructor(options: { verbose?: boolean } = {}) {
        const { verbose } = options
        this.verboseEnabled = verbose
    }

    breakLine() {
        console.log()
    }

    log(...args) {
        console.log(...args)
    }

    info(msg: string) {
        console.log(`${logSymbols.info} ${msg}`)
    }

    success(msg: string) {
        console.log(`${logSymbols.success} ${msg}`)
    }

    warn(msg: string) {
        console.log(`${logSymbols.warning} ${msg}`)
    }

    error(msg: string) {
        console.log(`${logSymbols.error} ${msg}`)
    }

    verbose(...args: any) {
        if (this.verboseEnabled) {
            const msg = args.join(' ▶️ ')
            console.log(
                `${chalk.bold('[debug]')} ${chalk.gray(`[${new Date().toISOString()}]`)} ${msg}`
            )
        }
    }

    genClickableLink(link: string) {
        if (terminalLink.isSupported) {
            const clickablelink = terminalLink(link, link)
            return chalk.bold.cyan(clickablelink)
        }
        return chalk.bold.underline.cyan(link)
    }

    printClickableLink(link: string) {
        const clickLink = this.genClickableLink(link)
        this.info(clickLink)
    }

    async time(label: string, fn: Promise<any> | (() => Promise<any>)) {
        const promise = typeof fn === 'function' ? fn() : fn
        if (this.verboseEnabled) {
            this.c.log(label)
            Console.prototype.time.call(this.c, label)
            const r = await promise
            Console.prototype.timeEnd.call(this.c, label)
            return r
        }

        return promise
    }
}
