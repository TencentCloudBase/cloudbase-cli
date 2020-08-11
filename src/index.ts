import 'reflect-metadata'
import { registerCommands } from './commands/common'
import './commands'

export { smartDeploy } from './commands'

registerCommands()
