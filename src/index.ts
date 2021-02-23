import 'reflect-metadata'
import { registerCommands } from './commands/common'
import './commands'

export { smartDeploy } from './commands'

registerCommands()

if (typeof globalThis === undefined) {
  // eslint-disable-next-line no-undef
  (globalThis as any) = global
}