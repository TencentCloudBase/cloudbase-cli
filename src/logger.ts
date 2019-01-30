
import chalk from 'chalk'
export default class Logger {
    private moduleName: string
    constructor(moduleName) {
        this.moduleName = moduleName
    }
    log(msg) {
        if (!this.moduleName) {
            console.log(msg)
        } else {
            console.log(chalk.blue('[' + this.moduleName + ']') + ` ${msg}`)
        }
    }
    error(msg) {
        if (!this.moduleName) {
            console.log(msg)
        } else {
            console.log(chalk.red('[' + this.moduleName + ']') + ` ${msg}`)
        }
    }
}