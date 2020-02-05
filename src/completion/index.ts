import tabtab from 'tabtab'
import { ALL_COMMANDS } from '../constant'

const completion = env => {
    if (!env.complete) return

    // 命令
    const args = process.argv.slice(5)
    const cmd = args[0]

    const commands = ALL_COMMANDS.filter(item => item.indexOf(cmd) > -1)
    if (commands.length > 0) {
        return tabtab.log(commands)
    } else {
        return tabtab.log(['-h', '-v'])
    }
}

export function handleCompletion() {
    const env = tabtab.parseEnv(process.env)
    completion(env)
}
