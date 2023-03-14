import 'reflect-metadata'
import './commands'

export { smartDeploy } from './commands'

// HACK: 部分依赖使用了 globalThis，会在 Node12 以下的版本报错
if (typeof globalThis === undefined) {
    // eslint-disable-next-line no-undef
    ;(globalThis as any) = global
}

export { registerCommands } from './commands/common'