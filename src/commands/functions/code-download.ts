import path from 'path'
import fse from 'fs-extra'
import inquirer from 'inquirer'
import { FunctionContext } from '../../types'
import { CloudBaseError } from '../../error'
import { downloadFunctionCode } from '../../function/code'
import { loadingFactory, checkPathExist, delSync } from '../../utils'

export async function codeDownload(
    ctx: FunctionContext,
    dest: string,
    options: any
) {
    const { name, envId, config } = ctx
    const { codeSecret } = options

    if (!name) {
        throw new CloudBaseError('请指定云函数名称！')
    }

    let destPath = dest

    // 没有指定下载路径时，使用函数名作为存储文件夹
    if (!destPath) {
        destPath = path.resolve(config.functionRoot, name)
        // 路径已存在，询问是否覆盖
        if (checkPathExist(destPath)) {
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
