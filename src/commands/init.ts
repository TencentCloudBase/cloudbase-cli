import fs from 'fs'
import ora from 'ora'
import fse from 'fs-extra'
import path from 'path'
import inquirer from 'inquirer'
import program from 'commander'
import { TcbError } from '../error'
import { successLog } from '../logger'
import { listEnvs } from '../env'

program
    .command('init')
    .option('--server', '创建 node 项目')
    .description('创建并初始化一个新的项目')
    .action(async function(cmd) {
        const load = ora('拉取环境列表').start()
        const envData = (await listEnvs()) || []
        load.succeed('获取环境列表成功')
        const envs: string[] = envData.map(
            item => `${item.EnvId}:${item.PackageName}`
        )

        if (!envs.length) {
            throw new TcbError(
                '没有可以使用的环境，请先开通云开发环境（https://console.cloud.tencent.com/tcb）'
            )
        }

        const { env } = await inquirer.prompt({
            type: 'list',
            name: 'env',
            message: '选择关联环境',
            choices: envs
        })

        const { name } = await inquirer.prompt({
            type: 'input',
            name: 'name',
            message: '请输入项目名称',
            default: 'tcb-demo'
        })

        // 模板目录
        const templatePath = path.resolve(
            __dirname,
            '../../templates',
            cmd.server ? 'server/node' : 'faas'
        )
        // 项目目录
        const projectPath = path.join(process.cwd(), name)

        if (fs.existsSync(projectPath)) {
            const { cover } = await inquirer.prompt({
                type: 'confirm',
                name: 'cover',
                message: `已存在同名文件夹：${name}，是否覆盖？`,
                default: false
            })
            // 不覆盖，操作终止
            if (!cover) {
                throw new TcbError('操作终止！')
            } else {
                // 覆盖操作不会删除不冲突的文件夹或文件
                // 删除原有文件夹，防止生成的项目包含用户原有文件
                fse.removeSync(projectPath)
            }
        }

        // 拷贝模板
        fse.copySync(templatePath, projectPath)

        // 重命名 _gitignore 文件
        fs.renameSync(
            path.join(projectPath, '_gitignore'),
            path.join(projectPath, '.gitignore')
        )

        // 写入 envId
        const configFilePath = path.join(projectPath, 'tcbrc.json')
        const configContent = fs.readFileSync(configFilePath).toString()

        fs.writeFileSync(
            configFilePath,
            configContent.replace('{{envId}}', env.split(':')[0])
        )

        successLog(`创建项目 ${name} 成功`)
    })
