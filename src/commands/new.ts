import fs from 'fs'
import fse from 'fs-extra'
import path from 'path'
import inquirer from 'inquirer'
import program from 'commander'
import { TcbError } from '../error'
import { successLog } from '../logger'

// 创建一个新的 tcb 项目
program
    .command('new')
    .description('创建一个新的项目')
    .action(async function() {
        const { name } = await inquirer.prompt({
            type: 'input',
            name: 'name',
            message: '请输入项目名称',
            default: 'tcb-demo'
        })
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

        // 拷贝模板项目
        fse.copySync(templatePath, projectPath)
        // 重命名 _gitignore 文件
        fs.renameSync(
            path.join(projectPath, '_gitignore'),
            path.join(projectPath, '.gitignore')
        )

        successLog(`创建项目 ${name} 成功`)
    })
