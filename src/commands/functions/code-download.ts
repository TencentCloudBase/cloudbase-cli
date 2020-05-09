import path from 'path'
import fse from 'fs-extra'
import inquirer from 'inquirer'
import { Command, ICommand } from '../common'
import { CloudBaseError } from '../../error'
import { InjectParams, CmdContext, ArgsParams } from '../../decorators'
import { downloadFunctionCode, getFunctionDetail } from '../../function'
import { loadingFactory, checkFullAccess, delSync, highlightCommand } from '../../utils'

@ICommand()
export class CodeDownload extends Command {
    get options() {
        return {
            cmd: 'functions:download <name> [dest]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                { flags: '-l, --limit <limit>', desc: '返回数据长度，默认值为 20' },
                {
                    flags: '--code-secret <codeSecret>',
                    desc: '代码加密的函数的 CodeSecret'
                }
            ],
            desc: '下载云函数代码'
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsParams() params) {
        const { envId, config, options } = ctx
        const { codeSecret } = options

        const name = params?.[0]
        const dest = params?.[1]

        if (!name) {
            throw new CloudBaseError('请指定云函数名称！')
        }

        // 检查函数是否存在
        try {
            await getFunctionDetail({
                envId,
                codeSecret,
                functionName: name
            })
        } catch (e) {
            if (e.code === 'ResourceNotFound.FunctionName') {
                throw new CloudBaseError(
                    `云函数 [${name}] 不存在！\n\n使用 ${highlightCommand(
                        'cloudbase functions:list'
                    )} 命令查看已部署云函数`
                )
            }
            return
        }

        let destPath = dest

        // 没有指定下载路径时，使用函数名作为存储文件夹
        if (!destPath) {
            destPath = path.resolve(config.functionRoot, name)
            // 路径已存在，询问是否覆盖
            if (checkFullAccess(destPath)) {
                const { override } = await inquirer.prompt({
                    type: 'confirm',
                    name: 'override',
                    message: '函数已经存在，是否覆盖原文件？',
                    default: false
                })

                if (!override) {
                    throw new CloudBaseError('下载终止！')
                }
                // 删除原文件
                delSync([destPath])
            }
            await fse.ensureDir(destPath)
        }

        const loading = loadingFactory()
        loading.start('文件下载中...')
        await downloadFunctionCode({
            envId,
            functionName: name,
            destPath: destPath,
            codeSecret: codeSecret,
            unzip: true
        })
        loading.succeed(`[${name}] 云函数代码下载成功！`)
    }
}
