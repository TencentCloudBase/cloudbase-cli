/**
 * 历史遗留命令，暂时隐藏
 */
import * as program from 'commander'
import * as fs from 'fs'
import * as path from 'path'
import * as fse from 'fs-extra'
import { NodeController } from '../controller'
import { FunctionDeploy, NodeDeploy } from '../deploy'
import { TcbError } from '../error'
import { Credential } from '../types'
import { getCredential } from '../utils'

function checkDeploys(deploys) {
    const names = {}
    deploys.forEach(d => {
        if (names[d.name]) {
            throw new TcbError(`Duplicated deploy name: "${d.name}"`)
        }
        names[d.name] = true
    })
}

async function getDeploys(name) {
    const configPath = path.join(process.cwd(), 'tcb.json')
    if (!fs.existsSync(configPath)) {
        throw new TcbError('未找到 TCB 配置文件：[tcb.json]')
    }

    const tcbConfig: any = await import(configPath)
    console.log(tcbConfig)
    let deploys = tcbConfig.deploys
    checkDeploys(deploys)
    if (name) {
        deploys = deploys.filter(d => d.name === name)
    }
    return {
        deploys
    }
}

export function commandRegister() {
    program
        .command('deploy [name]')
        .description('执行完整的发布')
        .action(async function(name) {
            const { deploys } = await getDeploys(name)
            const credential: Credential = await getCredential()
            if (!credential.secretId || !credential.secretKey) {
                throw new TcbError('你还没有登录，请登录后执行此操作！')
            }

            deploys.forEach(async deploy => {
                if (deploy.type === 'node') {
                    if (!deploy.path) {
                        throw new TcbError('未指定发布目录')
                    }
                    await new NodeDeploy({
                        ...credential,
                        ...deploy
                    }).deploy()
                    return
                }

                if (deploy.type === 'function') {
                    await new FunctionDeploy({
                        ...credential,
                        ...deploy
                    }).deploy()
                    return
                }
                throw new TcbError(`Unsupported deploy type: "${deploy.type}"`)
            })
        })

    program
        .command('logs <name>')
        .description('查看日志')
        .option('-n <n>', '输出日志的行数')
        .action(async function(name, options) {
            const {
                deploys: [deploy]
            } = await getDeploys(name)
            const credential: Credential = await getCredential()
            if (deploy.type === 'node') {
                await new NodeController({
                    ...credential,
                    ...deploy
                }).logs({
                    lines: options.n || 20
                })
            }
        })

    program
        .command('stop <name>')
        .description('停止应用')
        .action(async function(name) {
            const {
                deploys: [deploy]
            } = await getDeploys(name)
            const credential: Credential = await getCredential()
            if (deploy.type === 'node') {
                await new NodeController({
                    ...credential,
                    ...deploy
                }).delete()
            }
        })

    program
        .command('show')
        .description('查看状态')
        .action(async function() {
            const credential: any = await getCredential()
            await new NodeController({
                ...credential
            }).show()
        })

    program
        .command('create <name>')
        .description('创建项目')
        .action(async function(name) {
            fse.copySync(
                path.resolve(__dirname, '../assets/helloworld'),
                path.resolve(process.cwd(), name)
            )
        })
}
