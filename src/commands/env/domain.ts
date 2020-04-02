import inquirer from 'inquirer'
import { printHorizontalTable, loadingFactory } from '../../utils'
import { CloudBaseError } from '../../error'
import { successLog } from '../../logger'
import { getEnvAuthDomains, createEnvDomain, deleteEnvDomain } from '../../env'
import { ICommandContext } from '../command'

export async function listAuthDoamin(ctx: ICommandContext) {
    const domains = await getEnvAuthDomains({
        envId: ctx.envId
    })
    if (domains.length === 0) {
        console.log('安全域名为空！')
        return
    }

    const head = ['域名 Id', '域名', '创建时间', '状态']
    const tableData = domains.map(item => [
        item.Id,
        item.Domain,
        item.CreateTime,
        item.Status === 'ENABLE' ? '启用中' : '禁用中'
    ])
    printHorizontalTable(head, tableData)
}

export async function createAuthDomain(ctx: ICommandContext, domain: string) {
    const { envId } = ctx
    const domains = domain.split('/')

    const { confirm } = await inquirer.prompt({
        type: 'confirm',
        name: 'confirm',
        message: `确认添加以下安全域名： ${domains} ？`,
        default: true
    })

    if (!confirm) {
        throw new CloudBaseError('操作终止！')
    }

    // 检查域名是否已经添加，重复添加会报错
    let envDomains = await getEnvAuthDomains({
        envId
    })
    envDomains = envDomains.map(item => item.Domain)
    const exitDomains = []
    domains.forEach(item => {
        if (envDomains.includes(item)) {
            exitDomains.push(item)
        }
    })
    if (exitDomains.length) {
        throw new CloudBaseError(`域名 [${exitDomains.join(', ')}] 已存在！`)
    }

    await createEnvDomain({
        envId,
        domains: domains
    })
    successLog('添加安全域名成功！')
}

export async function deleteAuthDomain(ctx: ICommandContext) {
    const { envId } = ctx
    const loading = loadingFactory()

    loading.start('拉取环境安全域名中')

    const domains = await getEnvAuthDomains({
        envId
    })

    if (domains.length === 0) {
        loading.fail('域名安全为空，不能执行删除操作！')
        return
    }

    loading.succeed('拉取环境安全域名成功！')

    const domainList = domains.map(item => item.Domain)

    const { selectDomains } = await inquirer.prompt({
        type: 'checkbox',
        name: 'selectDomains',
        message: '请选择需要删除的域名（可多选）>',
        choices: domainList,
        default: true
    })

    const { confirm } = await inquirer.prompt({
        type: 'confirm',
        name: 'confirm',
        message: `确认删除以下安全域名： ${selectDomains} ？`,
        default: true
    })

    if (!confirm) {
        throw new CloudBaseError('操作终止！')
    }

    const domainIds = domains
        .filter(item => selectDomains.includes(item.Domain))
        .map(item => item.Id)

    const deleted = await deleteEnvDomain({
        domainIds,
        envId
    })

    successLog(`成功删除了 ${deleted} 个域名！`)
}
