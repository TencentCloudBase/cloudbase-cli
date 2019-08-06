import program from 'commander'
import { listEnvs } from '../env'
import { printCliTable } from '../utils'

program
    .command('list')
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
