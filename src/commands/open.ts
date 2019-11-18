import open from 'open'
import chalk from 'chalk'
import inquirer from 'inquirer'
import program from 'commander'
import { CloudBaseError } from '../error'

interface Link {
    name: string
    value: string
    consolePath?: string
    url?: string
}

const links: Link[] = [
    {
        name: 'CLI 文档',
        value: 'cli-doc',
        url: 'https://tencentcloudbase.github.io/2019-09-03-cli/'
    }
]

program
    .command('open [link]')
    .description('在浏览器中打开云开发相关连接')
    .action(async (link: string) => {
        let openLink: Link = null
        // 如果指定了 link，直接打开链接
        if (link) {
            openLink = links.find(item => item.value === link)

            if (!openLink) {
                throw new CloudBaseError(`${link} 链接不存在！`)
            }
        } else {
            const { selectLink } = await inquirer.prompt({
                type: 'list',
                name: 'selectLink',
                message: '请选择需要打开的链接',
                choices: links
            })

            openLink = links.find(item => item.value === selectLink)
        }

        if (!openLink) {
            throw new CloudBaseError('请指定需要打开的链接！')
        }

        console.log(`在您的默认浏览器中打开 ${openLink.name} 链接：`)
        console.log(chalk.underline.bold(openLink.url))

        open(openLink.url)
    })
