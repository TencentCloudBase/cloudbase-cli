import { exec } from 'child_process'
import { watch as fswatch, FSWatcher } from 'chokidar'
import { parse as parseFilePath, resolve as resolvePath, join as joinPath } from 'path'
import { writeFileSync, readFileSync, unlinkSync, readdirSync, mkdirSync } from 'fs'
import { Context } from 'koa'
import { format as urlFormat } from 'url'
import { CloudApiService, zipDir, checkFullAccess, checkAndGetCredential } from '../../../utils'
import { getHostingInfo } from '../../../hosting'
import chalk from 'chalk'
import { isDirectorySync } from '@cloudbase/toolbox'
import _ from 'lodash'

interface IBuildParams {
  /**
   * 低码应用 ID
   */
  appId: string
  /**
   * 构建产物类型 mp/web
   */
  buildTypeList: string[]
  /**
   * 小程序构建类型
   */
  generateMpType?: 'app' | 'subpackage'
  /**
   * 小程序部署参数
   */
  deployOptions: {
    mode: 'preview' | 'upload'
    version: string
    description: string
    appHistoryId?: number
  }
  /**
   * 插件
   */
  plugins: any[]
  /**
   * 低码应用模板
   */
  mainAppSerializeData: string
  /**
   * 低码子应用模板
   */
  subAppSerializeDataStrList: any[]
  /**
   * 依赖, 如 kone
   */
  dependencies: any[]
  /**
   * 低码应用 环境ID
   */
  envId: string
  /**
   * 数据源
   */
  datasources: any
}

type DistType = 'web' | 'qrcode' | 'dist'
interface ICheckStatusParams {
  buildId: string
  distType: DistType[]
  appId: string
}
interface IDeployHistoryParams {
  appId: string
  pageSize?: number
  pageIndex?: number
}
interface IDeployDetailParams {
  appId: string
  idx: string
}

const DEFAULT_FRAMEWORK_COMMAND = 'cloudbase framework deploy'
export const DEFAULT_RC_CONTENT = {
  version: '2.0',
  envId: '{{env.ENV_ID}}',
  $schema: 'https://framework-1258016615.tcloudbaseapp.com/schema/latest.json',
  framework: {
    name: '{{env.APP_NAME}}',
    plugins: {
      lowcode: {
        use: '@cloudbase/framework-plugin-low-code@release',
        inputs: {
          debug: true,
        },
      },
    },
  },
}
const DEFAULT_FILENAME = {
  RC: 'cloudbaserc.json',
  INPUT: 'input.json',
  STATUS: 'buildstatus.json',
  ENV: '.env',
  QRCODE: 'qrcode.jpg'
}
const BUILD_STATUE = {
  // 构建中
  BUILDING: 'building',
  // 构建失败
  BUILD_FAILED: 'buildFail',
  // 构建成功
  BUILD_SUCCESS: 'success',
  // 安装失败
  INSTALL_FAILED: 'fail'
}
const BUILD_TAG = {
  'building': '构建中',
  'buildFail': '构建失败',
  'success': '构建成功'
}
const BUILD_TIME_OUT = 600000
const tcbService = CloudApiService.getInstance('tcb')
const getFileUrl = (path) => urlFormat({ protocol: 'file:', host: path })
const getDotenvStr = (env) => {
  return Object.keys(env).reduce((content, key) => {
    return `${key}=${env[key]}\n${content}`
  }, '')
}

export class Builder {
  protected _workspace: string

  constructor(workspace) {
    this._workspace = workspace
  }

  async build(ctx: Context, params: IBuildParams) {
    // 0. 初始化
    const { envId, appId } = params
    const fixedParams = {
      ...params,
      mainAppSerializeData: {
        ...JSON.parse(params?.mainAppSerializeData),
        dataSources: params?.datasources || []
      },
      datasources: null,
    }
    const buildId = Date.now().toString()
    const env = {
      ENV_ID: envId,
      APP_NAME: `lcap-localbuild-${appId}`,
    }

    // 1. 写入文件，触发构建
    await this._writeFiles(appId, buildId, [
      [DEFAULT_FILENAME.INPUT ,JSON.stringify(fixedParams, null, 4)],
      [DEFAULT_FILENAME.ENV, getDotenvStr(env)],
      // rc文件会触发构建, 所以必须最后写入
      [DEFAULT_FILENAME.RC, JSON.stringify(DEFAULT_RC_CONTENT, null, 4)]
    ])
    
    // 2. 回包，启动成功
    return {
      buildId
    }
  }

  async _writeFiles(appId, buildId, contents) {
    const buildPath = resolvePath(this._workspace, appId, buildId)
    mkdirSync(buildPath, { recursive: true })
    contents.forEach(content => {
      writeFileSync(resolvePath(buildPath, content[0]), content[1])
    })
  }


  async checkStatusInLocal(ctx: Context, params:ICheckStatusParams) {
    // 初始化
    const { buildId, appId } = params
    const buildPath = resolvePath(this._workspace, appId, buildId)
    const statusPath = resolvePath(buildPath, DEFAULT_FILENAME.STATUS)
    const inputsPath = resolvePath(buildPath, DEFAULT_FILENAME.INPUT)
    const isTimeOut = (Date.now() - parseInt(buildId, 10) >= BUILD_TIME_OUT)
    
    // 找不到构建目录，安装失败
    if (!checkFullAccess(buildPath)) {
      return {
        status: BUILD_STATUE.INSTALL_FAILED
      }
    }

    // 找不到status, 构建中
    if(!checkFullAccess(statusPath)) {
      return {
        status: isTimeOut ? 
          BUILD_STATUE.INSTALL_FAILED : 
          BUILD_STATUE.BUILDING
      }
    }

    const status = getContent(statusPath)?.status
    const inputs = getContent(inputsPath)
    if (!status || !inputs) {
      // 构建中, 如果读不到status和inputs，则应该报错
      return {
        status: BUILD_STATUE.INSTALL_FAILED
      }
    }

    // 根据status回包
    switch(status) {
      case BUILD_STATUE.BUILDING: {
        return {
          status: isTimeOut ? 
            BUILD_STATUE.INSTALL_FAILED : 
            BUILD_STATUE.BUILDING
        }
      }
      case BUILD_STATUE.BUILD_FAILED: {
        return { status }
      } 
      case BUILD_STATUE.BUILD_SUCCESS: {
        const allDist = await this._getAllDist(params, inputs)
        return {
          status,
          ...allDist
        }
      }
      default: {
        return {
          status: BUILD_STATUE.INSTALL_FAILED
        }
      }
    }
  }

  // async checkStatusInCloud(ctx: Context, params:ICheckStatusParams) {
  //   // 初始化
  //   const { buildId, envId } = params
    
  //   // 通过云API查询状态
  //   const res = await tcbService.request('DescribeCloudBaseProjectVersion', {
  //     EnvId: envId,
  //     CIId: buildId
  //   })

  //   const status = res.Project?.Status
  //   if (!status) {
  //     return {
  //       status: BUILD_STATUE.INSTALL_FAILED
  //     }
  //   }

  //   // 根据status回包
  //   switch(status) {
  //     case BUILD_STATUE.BUILDING:
  //     case BUILD_STATUE.BUILD_FAILED: {
  //       return { status }
  //     } 
  //     case BUILD_STATUE.BUILD_SUCCESS: {
  //       const allDist = await this._getAllDist(params)
  //       return { status, ...allDist }
  //     }
  //     default: {
  //       return {
  //         status: BUILD_STATUE.INSTALL_FAILED
  //       }
  //     }
  //   }

  // }

  // 获取构建产物
  async _getAllDist(params:ICheckStatusParams, inputs: IBuildParams) {
    const allDist = {}
    const { buildId, distType, appId } = params
    const { envId, deployOptions : { mode } } = inputs

    // 获取入口二维码
    if (distType.includes('qrcode')) {
      const qrcodePath = resolvePath(this._workspace, appId, buildId, DEFAULT_FILENAME.QRCODE)
      if (checkFullAccess(qrcodePath)) {
        const base64 = readFileSync(qrcodePath, { encoding: 'base64' })
        allDist['qrcode'] = `data:image/jpg;base64,${base64}`
      }
    }

    // 获取静态网站地址
    if (distType.includes('web')) {
      await checkAndGetCredential()
      const hostings = await getHostingInfo({ envId })
      const website = hostings?.data?.[0]
      if (website) {
        const rootPath = getWebRootPath(appId, mode)
        allDist['web'] = `https://${joinPath(website.cdnDomain, rootPath)}`
      }
    }

    // 获取代码包
    if (distType.includes('dist')) {
      const distPath = resolvePath(this._workspace, appId, buildId, 'dist')
      const distZipPath = resolvePath(this._workspace, appId, buildId, 'dist.zip')
      
      if (checkFullAccess(distZipPath)) {
        allDist['dist'] = getFileUrl(distZipPath)
      } else if (checkFullAccess(distPath)) {
        await zipDir(distPath, distZipPath)
        allDist['dist'] = getFileUrl(distZipPath)
      }
    }

    return allDist
  }

  async deployHistory(ctx: Context, params: IDeployHistoryParams) {
    const { appId, pageIndex = 1, pageSize = 10 } = params
    const appPath = resolvePath(this._workspace, appId)
    
    if (!checkFullAccess(appPath)) {
      ctx.throw(404, `unknown appId: ${appId}`)
    }

    const historyPaths = readdirSync(appPath).filter(path => {
      if (!isDirectorySync(resolvePath(appPath, path))) {
        return false
      }
      if (!checkFullAccess(resolvePath(appPath, path, DEFAULT_FILENAME.STATUS))) {
        return false
      }
      if (!/[0-9]{13}/.test(path)) {
        return false
      }
      return true
    }).reverse()

    const startIndex = pageSize * (pageIndex - 1)
    const endIndex = pageSize * pageIndex - 1

    const history = await Promise.all(historyPaths.slice(startIndex, endIndex + 1).map(async path => {
      const result = await this.checkStatusInLocal(ctx, {
        appId, 
        buildId: path,
        distType: ['qrcode', 'web', 'dist'],
      }).catch(e => {
        return { status: BUILD_STATUE.BUILDING }
      })

      return {
        appId,
        idx: path,
        ciId: path,
        createdAt: path,
        status: result.status,
        preview: _.pick(result, 'web', 'qrcode', 'dist')
      }
    }))

    return {
      count: history.length,
      rows: history
    }
  }

  async deployDetail(ctx: Context, params: IDeployDetailParams) {
    const { idx, appId } = params

    const result = await this.checkStatusInLocal(ctx, {
      buildId: idx,
      distType: ['web', 'qrcode', 'dist'],
      appId
    })

    return {
      appId,
      idx,
      ciId: idx,
      createdAt: idx,
      status: result.status,
      preview: _.pick(result, 'web', 'qrcode', 'dist')
    }
  }
}

export class Watcher {
  protected _workspace: string
  protected _watcher?: FSWatcher

  constructor(workspace) {
    this._workspace = workspace
  }

  start() {
    if (this._watcher) {
      return
    }
    
    if (!checkFullAccess(this._workspace)) {
      mkdirSync(this._workspace, { recursive: true })
    }
    this._watcher = fswatch(this._workspace, { ignoreInitial: true }).on('all', async (eventName, path) => {
      switch(eventName) {
        case 'add':
        case 'change': {
          const parse = parseFilePath(path)
          if (
            parse.base === 'cloudbaserc.json' &&
            // 防止重复构建
            !checkFullAccess(resolvePath(parse.dir, DEFAULT_FILENAME.STATUS))
          ) {
            this._setStatus(parse.dir, BUILD_STATUE.BUILDING)
            await this._callFramework(parse.dir).then(() => {
              this._setStatus(parse.dir, BUILD_STATUE.BUILD_SUCCESS)
            }).catch(() => {
              this._setStatus(parse.dir, BUILD_STATUE.BUILD_FAILED)
            })
            // this._clean(parse.dir)
          }
          break
        }
        default: {
          break
        }
      }
    })
  }

  async _callFramework(projectPath, command = DEFAULT_FRAMEWORK_COMMAND) {
    return new Promise((resolve, reject) => {
      const cmd = exec(command, {
        cwd: projectPath,
        env: { ...{CI: 'true'}, ...process.env }
      })
      cmd.stdout?.pipe(process.stdout)
      cmd.stderr?.pipe(process.stderr)
      cmd.on('exit', (code) => {
        if (code === 0) {
          resolve(code)
        } else {
          reject(code)
        }
      })
    })
  }

  /**
   * 设置构建状态
   */
  _setStatus(path, status) {
    const statusPath = resolvePath(path, DEFAULT_FILENAME.STATUS)
    const content = JSON.stringify({ status }, null, 4)
    writeFileSync(statusPath, content, { encoding: 'utf8' })

    const buildId = parseFilePath(path).name
    const appId = parseFilePath(resolvePath(path, '..')).name
    console.log(chalk.green(`\n[云开发低码] 低码应用${BUILD_TAG[status]} [ appId:${appId}, buildId:${buildId} ]\n`))
  }

  /**
   * 清除源码
   */
  _clean(path) {
    unlinkSync(resolvePath(path, DEFAULT_FILENAME.INPUT))
    unlinkSync(resolvePath(path, DEFAULT_FILENAME.ENV))
    unlinkSync(resolvePath(path, DEFAULT_FILENAME.RC))
  }

  end() {
    this._watcher?.close()
  }
}

function getWebRootPath(appId, mode) {
  return mode === 'preview'
    ? `/${appId}/preview/`
    : `/${appId}/production/`
}

function getContent(path) {
  try {
    checkFullAccess(path, true)
    const rawData = readFileSync(path, 'utf8')
    return JSON.parse(rawData)
  } catch (e) {
    return
  }
}