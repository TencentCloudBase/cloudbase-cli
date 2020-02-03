import { cosmiconfig } from 'cosmiconfig'
import { CloudBaseError } from '../../error'

const MODULE_NAME = 'cloudbase'

export async function loadConfig(options: { moduleName?: string; configPath?: string } = {}) {
    const { moduleName = MODULE_NAME, configPath } = options

    const explorer = cosmiconfig(moduleName, {
        searchPlaces: [
            'package.json',
            `${moduleName}rc`,
            `${moduleName}rc.json`,
            `${moduleName}rc.yaml`,
            `${moduleName}rc.yml`,
            `${moduleName}rc.js`,
            `${moduleName}.config.js`
        ]
    })

    // 从指定路径加载配置文件
    if (configPath) {
        try {
            const result = await explorer.load(configPath)
            if (!result) return null
            const { config, filepath, isEmpty } = result
            return config
        } catch (e) {
            throw new CloudBaseError(e.message)
        }
    }

    // 搜索配置文件
    try {
        const result = await explorer.search(process.cwd())
        if (!result) return null
        const { config, filepath, isEmpty } = result
        return config
    } catch (e) {
        throw new CloudBaseError('配置文件解析失败！')
    }
}

export async function searchConfig(dest: string) {
    const moduleName = MODULE_NAME
    const explorer = cosmiconfig(moduleName, {
        searchPlaces: [
            'package.json',
            `${moduleName}rc`,
            `${moduleName}rc.json`,
            `${moduleName}rc.yaml`,
            `${moduleName}rc.yml`,
            `${moduleName}rc.js`,
            `${moduleName}.config.js`
        ]
    })

    // 搜索配置文件
    try {
        return explorer.search(dest || process.cwd())
    } catch (e) {
        return null
    }
}
