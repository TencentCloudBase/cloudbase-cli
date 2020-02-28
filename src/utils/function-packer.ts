import fs from 'fs'
import del from 'del'
import path from 'path'
import makeDir from 'make-dir'
import { random } from './tools'
import { zipDir, checkFullAccess } from './fs'
import { CloudBaseError } from '../error'

export enum CodeType {
    File,
    JavaFile
}

/**
 * 将函数代码转换成 Base64 编码
 * 普通文件：Node，PHP
 * Java 文件：Jar，ZIP
 */
export class FunctionPacker {
    // 项目根目录
    root: string
    // 函数名
    name: string
    // 代码文件类型
    type: CodeType
    funcPath: string
    funcDistPath: string
    // 临时目录
    tmpPath: string
    // 忽略文件模式
    ignore: string | string[]

    constructor(root: string, name: string, ignore: string | string[]) {
        this.name = name
        this.root = root
        this.ignore = ignore
        this.funcPath = path.join(root, name)
    }

    async getFileCode() {
        checkFullAccess(this.funcPath, true)
        // 构建临时文件夹存放函数打包结果
        this.tmpPath = path.join(this.root, `.cloudbase_tmp_${random()}`)
        this.funcDistPath = path.join(this.tmpPath, this.name)
        // 生成存放 zip 文件的文件夹
        await makeDir(this.funcDistPath)
        const zipPath = path.resolve(this.funcDistPath, 'dist.zip')
        // 生成 zip 文件

        await zipDir(this.funcPath, zipPath, this.ignore)
        // 将 zip 文件转换成 base64
        const base64 = fs.readFileSync(zipPath).toString('base64')
        // 清除打包文件
        this.clean()
        return base64
    }

    // 获取 Java 代码
    getJavaFileCode() {
        const { funcPath } = this
        // Java 代码为 jar 或 zip 包
        const jarExist = checkFullAccess(`${funcPath}.jar`)
        const zipExist = checkFullAccess(`${funcPath}.zip`)
        if (!jarExist && !zipExist) {
            return null
        }
        const packagePath = jarExist ? `${funcPath}.jar` : `${funcPath}.zip`
        return fs.readFileSync(packagePath).toString('base64')
    }

    async build(type: CodeType) {
        if (type === CodeType.JavaFile) {
            try {
                const code = await this.getJavaFileCode()
                return code
            } catch (error) {
                this.clean()
                throw new CloudBaseError(`函数代码打包失败：\n ${error.message}`)
            }
        }

        if (type === CodeType.File) {
            try {
                const code = await this.getFileCode()
                return code
            } catch (error) {
                this.clean()
                throw new CloudBaseError(`函数代码打包失败：\n ${error.message}`)
            }
        }
    }

    clean() {
        // allow deleting the current working directory and outside
        this.funcDistPath && del.sync([this.funcDistPath], { force: true })
        this.tmpPath && del.sync([this.tmpPath], { force: true })
    }
}
