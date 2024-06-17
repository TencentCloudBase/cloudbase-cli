import _, { set } from 'lodash'
import { Command, ICommand } from '../common'
import { InjectParams, Log, Logger, CmdContext, ArgsOptions } from '../../decorators'
import { getLowcodeCli, getCmdConfig, getMergedOptions } from './utils'
import { ICommandContext } from '../../types'
import { authSupevisor, getPrivateSettings } from '../../utils'
import { CloudApiService } from '@cloudbase/cloud-api'
import { fetch, getProxy } from '@cloudbase/toolbox'
import fs from 'fs-extra'
import os from 'os'
import path from 'path'
import { generateDataModelDTS } from '../../utils/dts'

// use dynamic import for lowcode-cli to reduce setup time
type LowcodeCli = typeof import('@cloudbase/lowcode-cli')

let lowcodeCli: LowcodeCli | undefined

if (process.argv.includes('lowcode')) {
    // cannot use top-level await here
    getLowcodeCli().then((_) => (lowcodeCli = _))
}

@ICommand({
    supportPrivate: true
})
export class LowCodeWatch extends Command {
    get options() {
        return {
            cmd: 'lowcode',
            childCmd: 'watch',
            options: [
                {
                    flags: '--verbose',
                    desc: '是否打印详细日志'
                },
                {
                    flags: '--wx-devtool-path <wxDevtoolPath>',
                    desc: '微信开发者工具的安装路径'
                },
                {
                    flags: '--force-install',
                    desc: '是否忽略安装依赖包'
                },
                {
                    flags: '-p, --path <localProjectPath>',
                    desc: '本地开发的本地项目路径'
                }
            ],
            desc: '开启微搭低代码的本地构建模式',
            requiredEnvId: false
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsOptions() options) {
        const config = getCmdConfig(ctx.config, this.options)
        const mergesOptions = getMergedOptions(config, options)
        import('@cloudbase/lowcode-cli').then(async (res) => {
            await res.watchApp({
                watchPort: 8288,
                wxDevtoolPath: options?.wxDevtoolPath,
                forceInstall: options?.forceInstall,
                projectPath: options?.path
            } as any)
        })
    }
}

@ICommand({ supportPrivate: true })
export class LowCodeBuildApp extends Command {
    get options() {
        return {
            cmd: 'lowcode',
            childCmd: 'build:app',
            options: [
                {
                    flags: '--clean',
                    desc: '清理构建目录'
                },
                {
                    flags: '--out <out>',
                    desc: '输出目录'
                }
            ],
            desc: '构建应用',
            requiredEnvId: false
        }
    }

    @InjectParams()
    async execute(
        @CmdContext() ctx: ICommandContext,
        @Log() log: Logger,
        @ArgsOptions() options: any
    ) {
        const config = getCmdConfig(ctx.config, this.options)
        const mergesOptions = getMergedOptions(config, options)
        await lowcodeCli.buildApp(
            {
                envId: ctx.envId || ctx.config.envId,
                projectPath: process.cwd(),
                logger: log,
                privateSettings: getPrivateSettings(ctx.config, this.options.cmd)
            },
            mergesOptions
        )
    }
}

@ICommand({ supportPrivate: true })
export class LowCodePreviewApp extends Command {
    get options() {
        return {
            cmd: 'lowcode',
            childCmd: 'preview:app',
            options: [
                {
                    flags: '--wx-devtool-path <your-wx-dev-tool-path>',
                    desc: '指定微信开发者工具的安装路径'
                },
                {
                    flags: '--platform <mp|web>',
                    desc: '构建平台'
                }
            ],
            desc: '预览应用',
            requiredEnvId: false
        }
    }

    @InjectParams()
    async execute(
        @CmdContext() ctx: ICommandContext,
        @Log() log: Logger,
        @ArgsOptions() options: any
    ) {
        const config = getCmdConfig(ctx.config, this.options)
        const mergesOptions = getMergedOptions(config, options)
        await lowcodeCli.previewApp(
            {
                envId: ctx.envId || ctx.config.envId,
                projectPath: process.cwd(),
                logger: log,
                privateSettings: getPrivateSettings(ctx.config, this.options.cmd)
            },
            mergesOptions
        )
    }
}

@ICommand({ supportPrivate: true })
export class LowCodeBuildAppConfig extends Command {
    get options() {
        return {
            cmd: 'lowcode',
            childCmd: 'build:app-config',
            options: [
                {
                    flags: '--out <out>',
                    desc: '输出目录'
                },
                {
                    flags: '--build-type-list <type...>',
                    desc: '输出目录'
                },
                {
                    flags: '--domain <domain>',
                    desc: '托管域名'
                }
            ],
            desc: '构建应用配置',
            requiredEnvId: false
        }
    }
    @InjectParams()
    async execute(
        @CmdContext() ctx: ICommandContext,
        @Log() log: Logger,
        @ArgsOptions() options: any
    ) {
        const config = getCmdConfig(ctx.config, this.options)
        const mergesOptions = getMergedOptions(config, options)

        await lowcodeCli.buildAppConfig(
            {
                envId: ctx.envId || ctx.config.envId,
                projectPath: process.cwd(),
                logger: log,
                privateSettings: getPrivateSettings(ctx.config, this.options.cmd)
            },
            mergesOptions
        )
    }
}

@ICommand({ supportPrivate: true })
export class LowCodeDeployApp extends Command {
    get options() {
        return {
            cmd: 'lowcode',
            childCmd: 'publish:app',
            options: [
                {
                    flags: '--src <src>',
                    desc: '部署目录'
                },
                {
                    flags: '--sync-cloud',
                    desc: '是否同步云端部署记录'
                }
            ],
            desc: '发布应用',
            requiredEnvId: false
        }
    }

    @InjectParams()
    async execute(
        @CmdContext() ctx: ICommandContext,
        @Log() log: Logger,
        @ArgsOptions() options: any
    ) {
        let credential
        const privateSettings = getPrivateSettings(ctx.config, this.options.cmd)
        const config = getCmdConfig(ctx.config, this.options)
        const { src, ...restMergedOptions } = getMergedOptions(config, options)

        if (ctx.hasPrivateSettings) {
            process.env.IS_PRIVATE = 'true'
            credential = privateSettings.credential
        } else {
            credential = await authSupevisor.getLoginState()
        }

        await lowcodeCli.deployApp(
            {
                envId: ctx.envId || ctx.config.envId,
                projectPath: process.cwd(),
                logger: log,
                privateSettings
            },
            {
                credential,
                ...restMergedOptions,
                projectPath: src || restMergedOptions.projectPath
            }
        )
    }
}

/**
 * TODO: 数据模型类型同步命令，DEMO 时期，暂时放这里
 */
@ICommand({ supportPrivate: true })
export class ModelTypeSync extends Command {
    get options() {
        return {
            cmd: 'model',
            childCmd: 'sync-dts',
            options: [
                {
                    flags: '--envId <envId>',
                    desc: '环境 ID'
                }
            ],
            desc: '同步数据模型类型定义文件',
            requiredEnvId: true
        }
    }

    @InjectParams()
    async execute(
        @CmdContext() ctx: ICommandContext,
        @Log() log: Logger,
        @ArgsOptions() options: any
    ) {
        log.info('同步中...')

        /**
         * 生成 cloudbaserc.json 文件（如果不存在的情况）
         */
        if (!(await fs.pathExists('cloudbaserc.json'))) {
            await fs.writeFile(
                'cloudbaserc.json',
                JSON.stringify(
                    {
                        version: '2.0',
                        envId: ctx.envId
                    },
                    null,
                    2
                ),
                'utf8'
            )
        }

        /**
         * 生成 tsconfig.json 文件（如果不存在的情况）
         */
        if (!(await fs.pathExists('tsconfig.json'))) {
            await fs.writeFile(
                'tsconfig.json',
                JSON.stringify(
                    {
                        compilerOptions: {
                            allowJs: true
                        }
                    },
                    null,
                    2
                ),
                'utf8'
            )
        } else {
            const config = await fs.readJson('tsconfig.json', 'utf8')
            set(config, 'compilerOptions.allowJs', true)
            await fs.writeFile('tsconfig.json', JSON.stringify(config, null, 2), 'utf8')
        }

        /**
         * 获取数据模型列表
         * 接口文档: https://capi.woa.com/apidoc?product=lowcode&version=2021-01-08
         */
        const cloudService = await getCloudServiceInstance(ctx)
        const datasourceList = await cloudService.lowcode.request('DescribeDataSourceList', {
            EnvId: ctx.envId,
            PageIndex: 1,
            PageSize: 1000,
            QuerySystemModel: true, // 查询系统模型
            QueryConnector: 0 // 0 表示数据模型
        })
        // 下一行代码为调试阶段使用
        // const rows = datasourceList.Data.Rows.filter((item: any) => item.Name.startsWith('dx_'))
        // const rows = datasourceList.Data.Rows.filter(
        //     (item: any) => item.Name.toLowerCase() === 'Awtsjd_Gxngcnm'.toLowerCase()
        // )
        const rows = datasourceList.Data.Rows

        /**
         * 生成数据模型类型定义文件
         */
        const dataModelList = rows.map((item) => ({
            name: item.Name,
            schema: JSON.parse(item.Schema),
            title: item.Title
        }))
        const dts = await generateDataModelDTS(dataModelList)
        const dtsFileName = 'cloud-models.d.ts'
        await fs.writeFile(dtsFileName, dts)
        log.success('同步数据模型类型定义文件成功。文件名称：' + dtsFileName)
    }
}

@ICommand({ supportPrivate: true })
export class TemplateSync extends Command {
    get options() {
        return {
            cmd: 'template',
            childCmd: 'sync',
            options: [
                {
                    flags: '--envId <envId>',
                    desc: '环境 ID'
                }
            ],
            desc: '同步官方模板应用内容',
            requiredEnvId: true
        }
    }

    @InjectParams()
    async execute(
        @CmdContext() ctx: ICommandContext,
        @Log() log: Logger,
        @ArgsOptions() options: any
    ) {
        log.info('同步中...')

        const envId = 'lowcode-5g5llxbq5bc9299e'
        const fileDir = path.resolve(os.tmpdir(), 'templates')
        await fs.ensureDir(fileDir)
        await fs.rmdir(fileDir, { recursive: true })
        await fs.ensureDir(fileDir)

        /**
         * 获取数据模型列表
         * 接口文档: https://capi.woa.com/apidoc?product=lowcode&version=2021-01-08
         */
        const cloudService = await getCloudServiceInstance(ctx)

        let total = Infinity
        let currentTotal = 0
        const limit = 50

        const files = []
        let count = 1
        while (currentTotal < total) {
            const solutionListResult = await cloudService.lowcode.request('DescribeSolutionList', {
                Limit: limit,
                Offset: currentTotal,
                KeyWords: '',
                EnvId: envId,
                TypeList: ['SELFBUILD', 'TPLEXPORT']
            })

            // TODO: 调试只用一个
            // const solutionList = [solutionListResult.SolutionInfoList[0]]
            const solutionList = solutionListResult.SolutionInfoList

            const handledSolutionList = await Promise.all(
                solutionList.map(async (item) => {
                    const solution = await cloudService.lowcode.request('DescribeSolution', {
                        EnvId: envId,
                        SolutionId: item.SolutionId
                    })
                    if (solution.SolutionAppInfos.length > 0) {
                        const appIds: string[] = solution.SolutionAppInfos.map((item) => item.AppId)

                        const apps = await Promise.all(
                            appIds.map(async (appId) => {
                                try {
                                    // 获取最后一条历史记录
                                    let result = await cloudService.lowcode.request(
                                        'DescribeHistoryListByAppId',
                                        {
                                            WeAppId: appId,
                                            PageNum: 1,
                                            PageSize: 1
                                        }
                                    )
                                    // 获取下载链接
                                    result = await cloudService.lowcode.request(
                                        'DescribeAppHistoryPreSignUrl',
                                        {
                                            HisIds: [result?.Data?.List?.[0]?.Id],
                                            HttpMethod: 'get',
                                            WeAppsId: appId
                                        }
                                    )
                                    // 获取应用内容
                                    result = await fetch(result?.Data?.[0]?.UploadUrl)

                                    return { appId, content: result }
                                } catch (e) {
                                    return { appId, error: e.message }
                                }
                            })
                        )

                        return {
                            name: item.Name,
                            solutionId: item.SolutionId,
                            version: item.Version,
                            apps
                        }
                    } else {
                        return null
                    }
                })
            )

            const filePath = path.resolve(fileDir, `templates_${count}.json`)
            await fs.writeFile(filePath, JSON.stringify(handledSolutionList, null, 2), 'utf8')
            files.push(filePath)

            total = solutionListResult.TotalCount
            currentTotal += limit
            count += 1
        }

        log.success(`同步官方模板应用内容已完成. 文件路径:`)
        log.success(files.join('\n'))
    }
}

async function getCloudServiceInstance(
    ctx: any
): Promise<{ lowcode: CloudApiService; tcb: CloudApiService }> {
    let credential
    if (ctx.hasPrivateSettings) {
        process.env.IS_PRIVATE = 'true'
        const privateSettings = getPrivateSettings(ctx.config, this.options.cmd)
        credential = privateSettings.credential
    } else {
        credential = await authSupevisor.getLoginState()
    }

    return {
        lowcode: CloudApiService.getInstance({
            service: 'lowcode',
            proxy: getProxy(),
            credential,
            version: '2021-01-08'
        }),
        tcb: CloudApiService.getInstance({ service: 'tcb', proxy: getProxy(), credential })
    }
}
