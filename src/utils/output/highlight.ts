import chalk from 'chalk'

export function highlightCommand(command: string) {
    return chalk.bold.cyan(command)
}
