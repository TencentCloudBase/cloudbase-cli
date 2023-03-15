/* eslint-disable */
const chalk = require('chalk')
const { execSync } = require('child_process')

const isWin32 = process.platform === 'win32'

const print = (color = null) => (str = '') => {
    const terminalCols = retrieveCols()
    const strLength = str.replace(/\u001B\[[0-9]{2}m/g, '').length
    const leftPaddingLength = Math.floor((terminalCols - strLength) / 2)
    const leftPadding = ' '.repeat(Math.max(leftPaddingLength, 0))
    if (color) {
        str = chalk[color](str)
    }

    console.log(leftPadding, str)
}

const retrieveCols = (() => {
    let result = false

    return () => {
        if (result) {
            return result
        }
        const defaultCols = 80

        try {
            const terminalCols = execSync('tput cols', { stdio: ['pipe', 'pipe', 'ignore'] })
            result = parseInt(terminalCols.toString()) || defaultCols
        } catch (e) {
            result = defaultCols
        }

        return result
    }
})()

// 只在 osx 系统上展示 emoji
const emoji = (emoji) => (process.stdout.isTTY && !isWin32 ? emoji : '')

function printFooter() {
    const yellow = print('yellow')
    // const yellow = str => console.log(chalk.yellow(str))
    const emptyLine = print()

    emptyLine()

    yellow('了解如何使用 CloudBase CLI')
    yellow('请查看使用文档')

    print()(
        ' '.repeat(15) +
            `${chalk.bold(emoji('👉'))} ${chalk.underline(
                'https://docs.cloudbase.net/cli-v1/quick-start.html'
            )}`
    )
    emptyLine()
}

printFooter()
