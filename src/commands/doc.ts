import program from 'commander'
import open from 'open'

// 登出
program
    .command('logout')
    .description('查看 CLI 文档')
    .action(() => {
        open('')
    })
