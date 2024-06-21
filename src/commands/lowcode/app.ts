import { set } from 'lodash'
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
import { calsToCode } from '@cloudbase/cals'

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
            cmd: 'sync-model-dts',
            options: [
                {
                    flags: '--envId <envId>',
                    desc: '环境 ID'
                }
            ],
            desc: '同步数据模型类型定义文件',
            requiredEnvId: true,
            autoRunLogin: true
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

// export class TemplateSync extends Command {
//     get options() {
//         return {
//             cmd: 'template',
//             childCmd: 'sync',
//             options: [
//                 {
//                     flags: '--source <source>',
//                     desc: '来源: 1-野鹤 2-自建模板'
//                 }
//             ],
//             desc: '同步官方模板应用内容',
//             requiredEnvId: false
//         }
//     }

//     @InjectParams()
//     async execute(
//         @CmdContext() ctx: ICommandContext,
//         @Log() log: Logger,
//         @ArgsOptions() options: any
//     ) {
//         log.info('同步中...')

//         const SourceType = {
//             YEHE: '1',
//             CUSTOM_MODULE: '2'
//         }
//         const source = Object.values(SourceType).includes(options.source)
//             ? options.source
//             : SourceType.YEHE
//         const envId = 'lowcode-5g5llxbq5bc9299e'
//         const cloudService = await getCloudServiceInstance(ctx)
//         const files = []
//         const limit = 50
//         let count = 1

//         const fileDir = path.resolve(os.tmpdir(), 'templates')
//         await fs.ensureDir(fileDir)
//         await fs.rmdir(fileDir, { recursive: true })
//         await fs.ensureDir(fileDir)

//         if (source === SourceType.YEHE) {
//             // 以野鹤为准来获取模板相关的应用

//             const templates = await fs.readJSON('data.json', 'utf8')
//             console.log('模板总数：', templates.length)
//             while (templates.length > 0) {
//                 const handledSolutionList = await Promise.all(
//                     templates.splice(0, limit).map(async (item) => {
//                         if (item.appIds.length > 0) {
//                             const apps = await getAppsContent(item.appIds)
//                             return {
//                                 name: item.templateName,
//                                 templateId: item.templateId,
//                                 status: item.status,
//                                 apps
//                             }
//                         } else {
//                             return null
//                         }
//                     })
//                 )

//                 const filePath = path.resolve(fileDir, `templates_${count}.json`)
//                 await fs.writeFile(filePath, JSON.stringify(handledSolutionList, null, 2), 'utf8')
//                 files.push(filePath)
//                 count += 1
//             }
//         } else if (source === SourceType.CUSTOM_MODULE) {
//             // 以自定义模板为准来获取模板相关的应用

//             let total = Infinity
//             let currentTotal = 0

//             while (currentTotal < total) {
//                 const solutionListResult = await cloudService.lowcode.request(
//                     'DescribeSolutionList',
//                     {
//                         Limit: limit,
//                         Offset: currentTotal,
//                         KeyWords: '',
//                         EnvId: envId,
//                         TypeList: ['SELFBUILD', 'TPLEXPORT']
//                     }
//                 )

//                 // TODO: 调试只用一个
//                 // const solutionList = [solutionListResult.SolutionInfoList[0]]
//                 const solutionList = solutionListResult.SolutionInfoList

//                 const handledSolutionList = await Promise.all(
//                     solutionList.map(async (item) => {
//                         const solution = await cloudService.lowcode.request('DescribeSolution', {
//                             EnvId: envId,
//                             SolutionId: item.SolutionId
//                         })
//                         if (solution.SolutionAppInfos.length > 0) {
//                             const appIds: string[] = solution.SolutionAppInfos.map(
//                                 (item) => item.AppId
//                             )

//                             const apps = await getAppsContent(appIds)

//                             return {
//                                 name: item.Name,
//                                 solutionId: item.SolutionId,
//                                 version: item.Version,
//                                 apps
//                             }
//                         } else {
//                             return null
//                         }
//                     })
//                 )

//                 const filePath = path.resolve(fileDir, `templates_${count}.json`)
//                 await fs.writeFile(filePath, JSON.stringify(handledSolutionList, null, 2), 'utf8')
//                 files.push(filePath)

//                 total = solutionListResult.TotalCount
//                 currentTotal += limit
//                 count += 1
//             }
//         }

//         log.success(`同步官方模板应用内容已完成. 文件路径:`)
//         log.success(files.join('\n'))

//         /**
//          * 在 https://git.woa.com/QBase/lcap/app-template 本地仓库（main 分支最新代码），获取 apps 下各个应用的目录名
//          */
//         const appIdNameMap = {} // 示例数据：{'app-t1pjwra6': 'ai_bot_management'}
//         const appsPath = path.resolve(process.cwd(), 'apps')
//         try {
//             const items = await fs.readdir(appsPath)
//             const directories = []

//             for (const item of items) {
//                 const itemPath = path.join(appsPath, item)
//                 const stats = await fs.stat(itemPath)

//                 if (stats.isDirectory()) {
//                     directories.push(item)
//                     const appConfig = await fs.readJSON(
//                         path.resolve(itemPath, 'src', 'app-config.json')
//                     )
//                     const appId = appConfig.id
//                     appIdNameMap[appId] = item
//                 }
//             }
//         } catch (error) {
//             console.error('Error reading directory:', error)
//         }

//         for (let fileUrl of files) {
//             const items = await fs.readJSON(fileUrl)
//             for (let item of items) {
//                 if (!item) continue
//                 let done = false
//                 if (item?.apps?.length > 0) {
//                     try {
//                         await Promise.all(
//                             item?.apps.map(async (app) => {
//                                 if (app?.error) {
//                                     return null
//                                 } else {
//                                     /**
//                                      * 为每个应用生成一个目录名
//                                      */
//                                     if (appIdNameMap[app.appId]) {
//                                         app.name = appIdNameMap[app.appId]
//                                     } else {
//                                         const result = await fetch(
//                                             'http://localhost:1234/v1/chat/completions',
//                                             {
//                                                 method: 'POST',
//                                                 headers: {
//                                                     'Content-Type': 'application/json'
//                                                 },
//                                                 body: JSON.stringify({
//                                                     model: 'TheBloke/Mistral-7B-Instruct-v0.2-GGUF',
//                                                     messages: [
//                                                         {
//                                                             role: 'system',
//                                                             content:
//                                                                 '你是一个目录命名专家。目录名只包括小写字母，数字和下划线, 不能包含其它符号。\n正确的示例: community_deals_platform\n错误的示例: restaurant_company_website'
//                                                         },
//                                                         {
//                                                             role: 'user',
//                                                             content: `请为“${app?.content?.label}”起一个目录名。请始终只返回一个目录名，其它不用返回`
//                                                         }
//                                                     ],
//                                                     temperature: 1,
//                                                     stream: false
//                                                 }),
//                                                 timeout: 30 * 60 * 1000
//                                             }
//                                         )
//                                         app.name = result.choices[0].message.content
//                                             .replace(/[\s\\]+/g, '')
//                                             .replace(/-/g, '_')
//                                     }

//                                     /**
//                                      * 写入本地代码
//                                      */
//                                     if (app.content) {
//                                         const calsAppData = app.content
//                                         calsAppData.id = app.appId
//                                         const { clientId, originHistoryId, mpAppId, uin } =
//                                             app.extra
//                                         calsAppData.extra.clientId = clientId
//                                         calsAppData.extra.originHistoryId = `${originHistoryId}`
//                                         calsAppData.extra.mpAppId = mpAppId
//                                         calsAppData.extra.envId = envId
//                                         calsAppData.extra.uin = uin
//                                         // 以下使用与模板开发账号一致的固定数据
//                                         calsAppData.extra.domain =
//                                             'lowcode-5g5llxbq5bc9299e-1300677802.tcloudbaseapp.com'
//                                         calsAppData.extra.resourceAppId = ''
//                                         calsAppData.extra.endpointType = ''
//                                         const codeItems = calsToCode(app.content, 'v0')
//                                         await Promise.all(
//                                             codeItems.map(async (codeItem) => {
//                                                 const codePath = path.resolve(
//                                                     appsPath,
//                                                     app.name,
//                                                     codeItem.path
//                                                 )
//                                                 await fs.ensureFile(codePath)
//                                                 await fs.writeFile(
//                                                     codePath,
//                                                     codeItem.code || '',
//                                                     'utf8'
//                                                 )
//                                             })
//                                         )
//                                         console.log(
//                                             '写入成功:',
//                                             app.appId,
//                                             app?.content?.label,
//                                             app.name
//                                         )
//                                     } else {
//                                         console.error('写入异常:', app.appId, app.error)
//                                     }
//                                 }
//                             })
//                         )
//                     } catch (e) {
//                         console.error('异常:', item.templateId, e.message)
//                     }
//                     done = true
//                 } else {
//                     done = true
//                 }
//                 if (done) {
//                     if (source === SourceType.YEHE) {
//                         // 删除 data.json 对应的值，避免重复执行
//                         let templates = await fs.readJSON('data.json', 'utf8')
//                         templates = templates.filter(
//                             (tItem) => tItem.templateId !== item.templateId
//                         )
//                         await fs.writeFile('data.json', JSON.stringify(templates, null, 2), 'utf8')
//                     }
//                 }
//             }
//             await fs.writeFile(fileUrl, JSON.stringify(items, null, 2), 'utf8')
//         }

//         async function getAppsContent(appIds: string[]) {
//             return await Promise.all(
//                 appIds.map(async (appId) => {
//                     try {
//                         // 获取应用详细数据
//                         let result = await cloudService.lowcode.request('DescribeAppDetail', {
//                             WeAppId: appId
//                         })
//                         const { Title, LatestHistory, OwnerInfo, MpAppId, ClientId } = result.Data
//                         const label = Title
//                         const historyId = JSON.parse(LatestHistory)?.id
//                         const extra = {
//                             originHistoryId: historyId,
//                             uin: OwnerInfo.Uin,
//                             mpAppId: MpAppId,
//                             clientId: ClientId
//                         }
//                         // 获取下载链接

//                         result = await cloudService.lowcode.request(
//                             'DescribeAppHistoryPreSignUrl',
//                             {
//                                 HisIds: [historyId],
//                                 HttpMethod: 'get',
//                                 WeAppsId: appId
//                             }
//                         )
//                         // 获取应用内容
//                         result = await fetch(result?.Data?.[0]?.UploadUrl)
//                         result.label = label

//                         return { appId, content: result, extra }
//                     } catch (e) {
//                         return { appId, error: e.message }
//                     }
//                 })
//             )
//         }
//     }
// }

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
