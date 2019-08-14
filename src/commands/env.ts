import program from 'commander'
import { listEnvs, createEnv } from '../env'
import { printCliTable } from '../utils'
import { TcbError } from '../error'
import { successLog } from '../logger'

program
    .command('env:list')
    .description('列出云开发所有环境')
    .action(async function() {
        const data = await listEnvs()
        const head = ['EnvId', 'PackageName', 'Source', 'CreateTime']
        const tableData = data.map(item => [
            item.envId,
            item.packageName,
            item.source,
            item.createTime
        ])
        printCliTable(head, tableData)
    })

program
    .command('env:create <alias>')
    .description('创建新的云环境')
    .action(async function(alias: string) {
        if (!alias) {
            throw new TcbError('环境名称不能为空！')
        }
        await createEnv({
            alias
        })
        successLog('创建环境成功！')
    })
