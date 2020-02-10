import { ALL_COMMANDS } from '../constant'

export function handleCompletion({ reply, line }) {
    // 命令
    const cmd = line.replace(/^cloudbase\s|^tcb\s/, '')

    const commands = ALL_COMMANDS.filter(item => item.indexOf(cmd) > -1)
    if (commands.length > 0) {
        reply(commands)
    } else {
        reply(['-h', '-v'])
    }
}
