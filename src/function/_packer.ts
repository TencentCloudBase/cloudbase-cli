import fs from 'fs'
import path from 'path'
import del from 'del'
import makeDir from 'make-dir'
import { zipDir } from '../utils'
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

    constructor(root: string, name: string) {
        this.name = name
        this.root = root
        this.funcPath = path.join(root, name)
    }

    validPath(path: string) {
        if (!fs.existsSync(path)) {
            throw new CloudBaseError('file not exist')
        }
    }

    async getFileCode() {
        this.validPath(this.funcPath)
        this.tmpPath = path.join(this.root, '.cloudbase_tmp')
        // 临时构建文件
        this.funcDistPath = path.join(this.tmpPath, this.name)
        // 清除原打包文件
        this.clean()
        // 生成 zip 文件
        await makeDir(this.funcDistPath)
        const zipPath = path.resolve(this.funcDistPath, 'dist.zip')
        await zipDir(this.funcPath, zipPath)
        // 将 zip 文件转换成 base64
        const base64 = fs.readFileSync(zipPath).toString('base64')
        // 清除打包文件
        await this.clean()
        return base64
    }

    // 获取 Java 代码
    getJavaFileCode() {
        const { funcPath } = this
        // Java 代码为 jar 或 zip 包
        const jarExist = fs.existsSync(`${funcPath}.jar`)
        const zipExist = fs.existsSync(`${funcPath}.zip`)
        if (!jarExist && !zipExist) {
            return null
        }
        const packagePath = jarExist ? `${funcPath}.jar` : `${funcPath}.zip`
        return fs.readFileSync(packagePath).toString('base64')
    }

    async build(type: CodeType) {
        if (type === CodeType.JavaFile) {
            return this.getJavaFileCode()
        }

        if (type === CodeType.File) {
            return await this.getFileCode()
        }
    }

    async clean(): Promise<void> {
        del.sync([this.funcDistPath, this.tmpPath])
        return
    }
}
