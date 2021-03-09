import _ from 'lodash'
import path from 'path'
import { Command, ICommand } from '../common'
import { InjectParams, Log, Logger, ArgsParams, ArgsOptions, CmdContext } from '../../decorators'
import { CloudApiService, execWithLoading, fetchStream } from '../../utils'
import { CloudBaseError } from '../../error'
import { unzipStream } from '@cloudbase/toolbox'
import chalk from 'chalk'
import { 
    build as buildComps, 
    debug as debugComps, 
    publishComps,  
    graceBuildComps,
    graceDebugComps,
    gracePublishComps,
    IPublishCompsInfo,
} from '@cloudbase/lowcode-cli'
import { spawn } from 'child_process'
import { prompt } from 'enquirer'
import fse from 'fs-extra'
import { promisifyProcess } from './utils'

const cloudService = CloudApiService.getInstance('lowcode')
const DEFAULE_TEMPLATE_PATH = 'https://hole-2ggmiaj108259587-1303199938.tcloudbaseapp.com/comps2.zip'

@ICommand()
export class LowCodeCreateComps extends Command {
    get options() {
        return {
            cmd: 'lowcode',
            childCmd: 'create [name]',
            options: [
                {
                    flags: '--verbose',
                    desc: '是否打印详细日志'
                }
            ],
            desc: '创建组件库',
            requiredEnvId: false
        }
    }

    @InjectParams()
    async execute(@ArgsParams() params, @Log() log?: Logger) {
        const res = await cloudService.request('ListUserCompositeGroups')
        const comps = res?.data
        if (!comps?.count) {
            throw new CloudBaseError('没有可关联的云端组件库，请到低码控制台新建组件库！')
        }

        let compsName = params?.[0]
        if (!compsName) {
            const { selectCompsName } = await prompt<any>({
                type: 'select',
                name: 'selectCompsName',
                message: '关联云端组件库:',
                choices: comps.rows.map((row) => row.groupName)
            })
            compsName = selectCompsName
        } else {
            // 自己输入的组件库名称，校验是否在云端也有
            const comp = comps.rows.find((row) => row.groupName === compsName)
            if (!comp) {
                throw new CloudBaseError(`云端不存在组件库 ${compsName}，请到低码控制台新建该组件库！`)
            }
        }

        // 拼接模板路径
        const compsPath = path.resolve(process.cwd(), compsName)
        if (fse.pathExistsSync(compsPath)) {
            throw new CloudBaseError(`当前目录下已存在组件库 ${compsName} ！`)
        }

        // 下载模板
        await _download(compsPath, compsName)
        // 安装依赖
        const installed = await _install(compsPath)
        // 用户提示
        if (installed) {
            log.success('组件库 - 创建成功\n')
            log.info(`👉 执行命令 ${chalk.bold.cyan(`cd ${compsName}`)} 进入文件夹`)
        } else {
            log.error('组件库 - 安装依赖失败\n')
            log.info(`👉 执行命令 ${chalk.bold.cyan(`cd ${compsName}`)} 进入文件夹`)
            log.info(`👉 执行命令 ${chalk.bold.cyan('npm install')} 手动安装依赖`)
        }
        log.info(`👉 执行命令 ${chalk.bold.cyan('tcb lowcode debug')} 调试组件库`)
        log.info(`👉 执行命令 ${chalk.bold.cyan('tcb lowcode publish')} 发布组件库`)
    }
}

@ICommand()
export class LowCodeBuildComps extends Command {
    get options() {
        return {
            cmd: 'lowcode',
            childCmd: 'build',
            options: [
                {
                    flags: '--verbose',
                    desc: '是否打印详细日志'
                }
            ],
            desc: '构建组件库',
            requiredEnvId: false
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @Log() log) {
        // 有RC配置, 使用新接口
        const config = ctx.config.lowcodeCustomComponents
        if (config) {
            await graceBuildComps({
                ...config,
                context: config.context || process.cwd(),
                logger: log
            })
            return
        }
        // 没有RC配置, 使用旧接口
        const compsPath = path.resolve(process.cwd())
        await _build(compsPath)
    }
}

@ICommand()
export class LowCodeDebugComps extends Command {
    get options() {
        return {
            cmd: 'lowcode',
            childCmd: 'debug',
            options: [
                {
                    flags: '--verbose',
                    desc: '是否打印详细日志'
                },
                {
                    flags: '--debug-port <debugPort>',
                    desc: '调试端口，默认是8388'
                },
                {
                    flags: '--wx-devtool-path <wxDevtoolPath>',
                    desc: '微信开发者工具的安装路径'
                }
            ],
            desc: '调试组件库',
            requiredEnvId: false
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsOptions() options, @Log() log) {
        // 有RC配置, 使用新接口
        const config = ctx.config.lowcodeCustomComponents
        if (config) {
            await graceDebugComps({
                ...config,
                context: config.context || process.cwd(),
                debugPort: options?.debugPort || 8388,
                logger: log,
                wxDevtoolPath: options?.wxDevtoolPath
            })
            return
        }
        // 没有RC配置, 使用旧接口
        const compsPath = path.resolve(process.cwd())
        await debugComps(compsPath, options?.debugPort || 8388)
    }
}

@ICommand()
export class LowCodePublishComps extends Command {
    get options() {
        return {
            cmd: 'lowcode',
            childCmd: 'publish',
            options: [
                {
                    flags: '--verbose',
                    desc: '是否打印详细日志'
                }
            ],
            desc: '发布组件库',
            requiredEnvId: false
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @Log() log?: Logger) {
        // 有RC配置, 使用新接口
        const config = ctx.config.lowcodeCustomComponents
        if (config) {
            await gracePublishComps({
                ...config,
                context: config.context || process.cwd(),
                logger: log
            })
            log.success('组件库 - 已同步到云端，请到低码控制台发布该组件库！')
            return
        }
        // 没有RC配置, 使用旧接口
        // 读取本地组件库信息
        const compsPath = path.resolve(process.cwd())
        const compsName = fse.readJSONSync(path.resolve(compsPath, 'package.json')).name
        // 读取云端组件库列表
        const res = await cloudService.request('ListUserCompositeGroups')
        const comps = res?.data
        if (!comps?.count) {
            throw new CloudBaseError(`云端不存在组件库 ${compsName}，请到低码控制台新建该组件库！`)
        }
        // 校验组件库信息
        const comp = comps.rows.find((row) => row.groupName === compsName)
        if (!comp) {
            throw new CloudBaseError(`云端不存在组件库 ${compsName}，请到低码控制台新建该组件库！`)
        }
        // 上传组件库
        await _build(compsPath)
        await _publish({
            id: comp.id,
            name: compsName,
            path: compsPath,
            log,
        })

        log.info('\n👉 组件库已经同步到云端，请到低码控制台发布该组件库！')
    }
}

async function _download(compsPath, compsName) {
    await execWithLoading(
        async () => {
            await fetchStream(DEFAULE_TEMPLATE_PATH).then(async (res) => {
                if (!res) {
                    throw new CloudBaseError('请求异常')
                }
        
                if (res.status !== 200) {
                    throw new CloudBaseError('未找到组件库模板')
                }
        
                // 解压缩文件
                await unzipStream(res.body, compsPath)
                
                // 修改cloudbaserc.json
                _renamePackage(path.resolve(compsPath, 'cloudbaserc.json'), compsName)
            })
        },
        {
            startTip: '组件库 - 下载模板中',
            successTip: '组件库 - 下载模板成功'
        }
    )
}

async function _renamePackage(configPath, name) {
    if (!fse.existsSync(configPath)) {
        throw new CloudBaseError(`组件库缺少配置文件: ${configPath}`)
    }
    const rcJson = fse.readJSONSync(configPath)
    const newPackageJson = _.merge({}, rcJson, {
        lowcodeCustomComponents: {
            name
        }
    })
    fse.writeJSONSync(configPath, newPackageJson, { spaces: 2 })
}

async function _install(compsPath): Promise<boolean> {
    const res = await execWithLoading(
        async () => {
            const npmOptions = [
                '--prefer-offline',
                '--no-audit',
                '--progress=false',
                '--registry=https://mirrors.tencent.com/npm/',
            ]
            const childProcess = spawn('npm', ['install', ...npmOptions], {
                cwd: compsPath,
                env: process.env,
                stdio: ['inherit', 'pipe', 'pipe'],
            })
            await promisifyProcess(childProcess)
        },
        {
            startTip: '组件库 - 依赖安装中',
            successTip: '组件库 - 依赖安装成功'
        }
    ).then(() => {
        return true
    }).catch(() => {
        return false
    })

    return res
}

async function _build(compsPath) {
    await execWithLoading(
        async () => { 
            await buildComps(compsPath)
        },
        {
            startTip: '组件库 - 构建中',
            successTip: '组件库 - 构建成功'
        }
    )
}

async function _publish(info: IPublishCompsInfo) {
    await execWithLoading(
        async () => {
            await publishComps(info)
        },
        {
            startTip: '组件库 - 发布中',
            successTip: '组件库 - 发布成功'
        }
    )
}
