import fs from 'fs'
import fse from 'fs-extra'
import path from 'path'
import inquirer from 'inquirer'
import program from 'commander'
import { TcbError } from '../error'
import { successLog } from '../logger'
import { listEnvs } from '../env'

// 创建一个新的 tcb 项目
program
    .command('init')
    .description('创建并初始化一个新的项目')
    .action(async function() {
        const envData = (await listEnvs()) || []
        const envs = envData.map(item => `${item.envId}:${item.packageName}`)

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

        const { template } = await inquirer.prompt({
            type: 'confirm',
            name: 'template',
            message: '是否生成函数模板文件',
            default: 'y'
        })

        let selectLangs: string[] = []
        // 选择模板语言
        if (template) {
            const { langs } = await inquirer.prompt({
                type: 'checkbox',
                name: 'langs',
                message: '选择模板函数语言类型（可多选）',
                choices: ['Node', 'Java', 'PHP'],
                default: 'node'
            })
            selectLangs = langs
        }

        // 模板目录
        const templatePath = path.resolve(__dirname, '../../templates')
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
        fse.copySync(templatePath, projectPath, {
            // 过滤没有选择的语言
            filter(src) {
                if (
                    src.indexOf('functions') === -1 ||
                    src === path.join(templatePath, 'functions')
                ) {
                    return true
                }
                return selectLangs.some(lang => {
                    const selectPath = path.join(
                        templatePath,
                        'functions',
                        lang.toLocaleLowerCase()
                    )
                    return src.indexOf(selectPath) > -1
                })
            }
        })

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
