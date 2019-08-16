import program from 'commander'
import ora from 'ora'
import inquirer from 'inquirer'
import { printCliTable, getEnvId } from '../utils'
import { TcbError } from '../error'
import { successLog } from '../logger'
import { getEnvAuthDomains, createEnvDomain, deleteEnvDomain } from '../env'

program
    .command('env:domain:list [envId]')
    .description('列出环境的安全域名列表')
    .action(async function(envId?: string) {
        const assignEnvId = await getEnvId(envId)
        const domains = await getEnvAuthDomains({
            envId: assignEnvId
        })
        if (domains.length === 0) {
            console.log('安全域名为空！')
            return
        }

        const head = ['Domain Id', 'Domain', 'CreateTime', 'Status']
        const tableData = domains.map(item => [
            item.Id,
            item.Domain,
            item.CreateTime,
            item.Status === 'ENABLE' ? '启用中' : '禁用中'
        ])
        printCliTable(head, tableData)
    })

program
    .command('env:domain:create <domain> [envId]')
    .description('添加环境安全域名，多个以斜杠 / 分隔')
    .action(async function(domain: string, envId?: string) {
        const assignEnvId = await getEnvId(envId)

        const domains = domain.split('/')

        const { confirm } = await inquirer.prompt({
            type: 'confirm',
            name: 'confirm',
            message: `确认添加以下安全域名： ${domains} ？`,
            default: true
        })

        if (!confirm) {
            throw new TcbError('操作终止！')
        }

        // 检查域名是否已经添加，重复添加会报错
        let envDomains = await getEnvAuthDomains({
            envId: assignEnvId
        })
        envDomains = envDomains.map(item => item.Domain)
        const exitDomains = []
        domains.forEach(item => {
            if (envDomains.includes(item)) {
                exitDomains.push(item)
            }
        })
        if (exitDomains.length) {
            throw new TcbError(`域名 [${exitDomains.join(', ')}] 已存在！`)
        }

        await createEnvDomain({
            envId: assignEnvId,
            domains: domains
        })

        successLog('添加安全域名成功！')
    })

program
    .command('env:domain:delete [envId]')
    .description('删除环境的安全域名')
    .action(async function(envId?: string) {
        const assignEnvId = await getEnvId(envId)

        const loadSpinner = ora('拉取环境安全域名中...').start()

        const domains = await getEnvAuthDomains({
            envId: assignEnvId
        })

        if (domains.length === 0) {
            loadSpinner.fail('域名安全为空！')
            return
        }

        loadSpinner.succeed('拉取环境安全域名成功！')

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
            throw new TcbError('操作终止！')
        }

        const domainIds = domains
            .filter(item => selectDomains.includes(item.Domain))
            .map(item => item.Id)

        const deleted = await deleteEnvDomain({
            domainIds,
            envId: assignEnvId,
        })

        successLog(`成功删除了 ${deleted} 个域名！`)
    })
