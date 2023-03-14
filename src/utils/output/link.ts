import chalk from 'chalk'
import terminalLink from 'terminal-link'

export function genClickableLink(link: string) {
    if (terminalLink.isSupported) {
        const clickablelink = terminalLink(link, link)
        return chalk.bold.cyan(clickablelink)
    }
    return chalk.bold.underline.cyan(link)
}
