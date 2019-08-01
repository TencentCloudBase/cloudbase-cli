import * as program from 'commander'
import { listEnvs } from '../env'

program
    .command('list')
    .description('列出云开发所有环境')
    .action(async function() {
        await listEnvs()
    })
