import fs from 'fs'
import os from 'os'
import _ from 'lodash'
import path from 'path'
import chalk from 'chalk'
import { prompt } from 'enquirer'
import { run } from '@cloudbase/framework-core'
import { ConfigParser, getRegion } from '@cloudbase/toolbox'
import {
    logger,
    getSelectedEnv,
    authSupevisor,
    loadingFactory,
    getSelectRegion,
    checkTcbService,
    getCloudBaseConfig,
    downloadTemplate,
    initProjectConfig
} from '../utils'
import * as Hosting from '../hosting'
import * as Function from '../function'
import { checkLogin } from '../auth'

/**
 * 智能命令
 */
export async function smartDeploy() {
    const loading = loadingFactory()
    loading.start('环境检测中')

    // 检查登录
    await checkLogin()

    // 检查是否开通 TCB 服务
    await checkTcbService()

    const files = fs.readdirSync(process.cwd())

    loading.stop()

    // 获取当前目录
    const home = os.homedir()
    const current = process.cwd()
    let relative = current
    if (current.indexOf(home) > -1) {
        relative = path.relative(home, current)
    }

    // 当期区域
    let region = await getRegion(true)

    // 当前目录为空，执行初始化项目操作
    if (!files.length) {
        logger.info('当前目录为空，初始化云开发项目\n')
        // 先选择 region，再选择环境
        region = await getSelectRegion()
        const envId = await getSelectedEnv()
        // 下载模板
        const projectPath = await downloadTemplate()
        await initProjectConfig(envId, region, projectPath)
        // 成功提示
        logger.success('初始化项目成功！\n')
    }

    // 初始化项目成功，或当前目录已经存在项目，继续使用 Framework 执行部署
    const { setup } = await prompt<any>({
        type: 'confirm',
        name: 'setup',
        message: `是否使用云开发部署当前项目 <${chalk.bold.cyan(relative)}> ？`,
        initial: true
    })

    if (!setup) {
        return
    }

    // 检测是否有 cloudbase 配置
    const config = await getCloudBaseConfig()
    let envId = config?.envId

    // 配置文件中不存在 region，选择 region
    if (!config?.region && !region) {
        region = await getSelectRegion()
    }

    // 配置文件不存在
    if (!envId) {
        envId = await getSelectedEnv()
        fs.writeFileSync(
            path.join(process.cwd(), 'cloudbaserc.json'),
            JSON.stringify({
                envId,
                region,
                version: '2.0',
                $schema: 'https://framework-1258016615.tcloudbaseapp.com/schema/latest.json'
            })
        )
    }

    // 把 region 写入到配置文件中
    const parser = new ConfigParser()
    parser.update('region', region)

    // 调用 Framework
    await callFramework(envId)
}

async function callFramework(envId: string) {
    const loginState = await authSupevisor.getLoginState()
    const { token, secretId, secretKey } = loginState
    const config = await getCloudBaseConfig()

    await run(
        {
            projectPath: process.cwd(),
            cloudbaseConfig: {
                secretId,
                secretKey,
                token,
                envId
            },
            config,
            logLevel: process.argv.includes('--verbose') ? 'debug' : 'info',
            resourceProviders: {
                hosting: Hosting,
                function: Function
            }
        },
        'deploy',
        ''
    )
}
