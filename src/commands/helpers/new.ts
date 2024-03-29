import _ from 'lodash'
import path from 'path'
import chalk from 'chalk'
import execa from 'execa'
import { getRegion } from '@cloudbase/toolbox'

import { Command, ICommand } from '../common'
import {
    getSelectedEnv,
    downloadTemplate,
    initProjectConfig,
    getSelectRegion,
    delSync
} from '../../utils'
import { InjectParams, Log, Logger, CmdContext } from '../../decorators'
import { checkLogin } from '../../auth'

@ICommand()
export class NewCommand extends Command {
    get options() {
        return {
            // templateUri 是 Git 地址或模板名
            cmd: 'new [appName] [templateUri]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '--clone',
                    desc: '从 Git 创建模板时是否 Clone 整个仓库'
                }
            ],
            desc: '创建一个新的云开发应用',
            requiredEnvId: false,
            withoutAuth: true
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @Log() log?: Logger) {
        const { params, options, envId } = ctx
        const { clone } = options

        let appName = params?.[0]
        const templateUri = params?.[1]

        // 检查登录
        await checkLogin()

        let region = await getRegion(true)

        // 配置文件中不存在 region，选择 region
        if (!region) {
            region = await getSelectRegion()
        }

        // 获取 envId
        let env = envId
        if (!env) {
            env = await getSelectedEnv(envId)
        }

        let projectPath

        if (templateUri && isGitUrl(templateUri)) {
            // git 仓库
            if (clone) {
                // clone 完整的仓库
                await execa('git', ['clone', templateUri, appName], {
                    stdio: 'inherit'
                })
            } else {
                await execa('git', ['clone', '--depth', 1, templateUri, appName], {
                    stdio: 'inherit'
                })
                // 删除 .git 文件夹
                await delSync([path.join(process.cwd(), appName, '.git')])
            }

            // 下载 Git 仓库文件，不包含完整的 Git 记录
            projectPath = path.join(process.cwd(), appName)
        } else {
            // 下载模板
            projectPath = await downloadTemplate({
                appName,
                projectPath,
                templateUri,
                newProject: true
            })
        }

        await initProjectConfig(env, region, projectPath)

        // 成功提示
        this.initSuccessOutput(appName)
    }

    // 项目初始化成功后打印提示语
    @InjectParams()
    initSuccessOutput(appName: string, @Log() log?: Logger) {
        log.success(appName ? `创建应用 ${appName} 成功！\n` : '创建应用成功！')

        if (appName) {
            const command = chalk.bold.cyan(`cd ${appName}`)
            log.info(`👉 执行命令 ${command} 进入文件夹`)
        }

        log.info(`👉 开发完成后，执行命令 ${chalk.bold.cyan('tcb')} 一键部署`)
    }
}

// 判断是否为 Git 仓库地址
export function isGitUrl(url: string) {
    const regex = /(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/
    return regex.test(url)
}
