import 'reflect-metadata'
import { registerCommands } from './commands/common'
import './commands'

export { smartDeploy } from './commands'

registerCommands()

// HACK: 部分依赖使用了 globalThis，会在 Node12 以下的版本报错
if (typeof globalThis === undefined) {
    // eslint-disable-next-line no-undef
    ;(globalThis as any) = global
}
