import os from 'os'
import fs from 'fs'
import path from 'path'
import dotProp from 'dot-prop'
import xdgBasedir from 'xdg-basedir'
import writeFileAtomic from 'write-file-atomic'
import makeDir from 'make-dir'
import { random } from '../uuid'

const configDirectory = xdgBasedir.config || path.join(os.tmpdir(), random(32))
const permissionError = '你没有权限操作此文件'
const makeDirOptions = { mode: 0o0700 }
const writeFileOptions = { mode: 0o0600 }

// 文件存储形式：$Home/.config/.cloudbase/config-name.js
export class LocalStore {
    path: string

    /**
     * 本地存储文件
     * @param {string} name 文件名
     * @param {*} defaults
     */
    constructor(name: string, defaults) {
        const pathPrefix = path.join('.cloudbase', `${name}.json`)

        this.path = path.join(configDirectory, pathPrefix)

        if (defaults) {
            this.all = {
                ...defaults,
                ...this.all
            }
        }
    }

    get all() {
        try {
            return JSON.parse(fs.readFileSync(this.path, 'utf8'))
        } catch (error) {
            // 如果文件夹不存在，则创建文件
            if (error.code === 'ENOENT') {
                return {}
            }

            // 权限异常
            if (error.code === 'EACCES') {
                error.message = `${error.message}\n${permissionError}\n`
            }

            // 异常的 JSON 文件，清空文件
            if (error.name === 'SyntaxError') {
                writeFileAtomic.sync(this.path, '', writeFileOptions)
                return {}
            }

            throw error
        }
    }

    set all(value) {
        try {
            // 确保文件夹存在
            makeDir.sync(path.dirname(this.path), makeDirOptions)

            writeFileAtomic.sync(
                this.path,
                JSON.stringify(value, undefined, '\t'),
                writeFileOptions
            )
        } catch (error) {
            // 权限错误
            if (error.code === 'EACCES') {
                error.message = `${error.message}\n${permissionError}\n`
            }

            throw error
        }
    }

    get size() {
        return Object.keys(this.all || {}).length
    }

    get(key) {
        return dotProp.get(this.all, key)
    }

    set(key, value) {
        const config = this.all

        if (arguments.length === 1) {
            for (const k of Object.keys(key)) {
                dotProp.set(config, k, key[k])
            }
        } else {
            dotProp.set(config, key, value)
        }

        this.all = config
    }

    has(key) {
        return dotProp.has(this.all, key)
    }

    delete(key) {
        const config = this.all
        dotProp.delete(config, key)
        this.all = config
    }

    clear() {
        this.all = {}
    }
}
