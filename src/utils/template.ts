import fs from 'fs'
import _ from 'lodash'
import path from 'path'
import fse from 'fs-extra'
import { prompt } from 'enquirer'
import { searchConfig, unzipStream, ConfigParser } from '@cloudbase/toolbox'
import { CloudBaseError } from '../error'
import { fetch, fetchStream } from './net'

import { logger } from './log'
import { checkFullAccess } from './fs'
import { execWithLoading } from './output'
import { templateDownloadReport } from './reporter'

const listUrl = 'https://tcli.service.tcloudbase.com/templates'

const getTemplateAddress = (templatePath: string) =>
    `https://7463-tcli-1258016615.tcb.qcloud.la/cloudbase-templates/${templatePath}.zip`

/**
 * 将初始化项目的过程拆成多步，以在 new 命令和 tcb 命令中复用
 */

// 获取并下载模板，返回项目地址
export async function downloadTemplate(
    options: {
        appName?: string
        newProject?: boolean
        templateUri?: string
        projectPath?: string
    } = {}
) {
    let { templateUri, appName, newProject, projectPath = process.cwd() } = options
    // 拉取模板
    const templates = await execWithLoading(() => fetch(listUrl), {
        startTip: '获取应用模板列表中'
    })

    let templateName
    let tempateId

    if (templateUri) {
        tempateId = templateUri
    } else {
        // 确定模板名称
        const { selectTemplateName } = await prompt<any>({
            type: 'select',
            name: 'selectTemplateName',
            message: '请选择应用模板',
            choices: templates.map((item) => item.name)
        })
        templateName = selectTemplateName
    }

    const selectedTemplate = templateName
        ? templates.find((item) => item.name === templateName)
        : templates.find((item) => item.path === tempateId)

    if (!selectedTemplate) {
        logger.info(`模板 \`${templateName || tempateId}\` 不存在`)
        return
    }

    /**
     * 新建项目
     */
    if (newProject) {
        // appName 不存在时，输入应用
        if (!appName) {
            const { projectName } = await prompt<any>({
                type: 'input',
                name: 'projectName',
                message: '请输入项目名称',
                initial: selectedTemplate.path
            })
            appName = projectName
        }

        // 确定项目权限
        projectPath = path.join(process.cwd(), appName)

        if (checkFullAccess(projectPath)) {
            const { cover } = await prompt<any>({
                type: 'confirm',
                name: 'cover',
                message: `已存在同名文件夹：${appName}，是否覆盖？`,
                initial: false
            })
            // 不覆盖，操作终止
            if (!cover) {
                throw new CloudBaseError('操作终止！')
            } else {
                // 覆盖操作不会删除不冲突的文件夹或文件
                // 删除原有文件夹，防止生成的项目包含用户原有文件
                fse.removeSync(projectPath)
            }
        }
    }

    // 下载并解压文件
    await execWithLoading(
        async () => {
            await templateDownloadReport(selectedTemplate.path, selectedTemplate.name)
            await extractTemplate(projectPath, selectedTemplate.path, selectedTemplate.url)
        },
        {
            startTip: '下载文件中'
        }
    )

    return projectPath
}

// 下载并解压
export async function extractTemplate(
    projectPath: string,
    templatePath: string,
    remoteUrl?: string
) {
    // 文件下载链接
    const url = remoteUrl || getTemplateAddress(templatePath)

    return fetchStream(url).then(async (res) => {
        if (!res) {
            throw new CloudBaseError('请求异常')
        }

        if (res.status !== 200) {
            throw new CloudBaseError('未找到文件')
        }

        // 解压缩文件
        await unzipStream(res.body, projectPath)
    })
}

// 初始化项目配置
export async function initProjectConfig(
    envId: string,
    region: string,
    projectPath: string = process.cwd()
) {
    // 配置文件初始化，写入环境id
    let filepath = (await searchConfig(projectPath))?.filepath

    // 配置文件不存在
    if (!filepath) {
        fs.writeFileSync(
            path.join(projectPath, 'cloudbaserc.json'),
            JSON.stringify({
                envId,
                region,
                version: '2.0',
                $schema: 'https://framework-1258016615.tcloudbaseapp.com/schema/latest.json'
            })
        )
    } else {
        // 设置环境 Id
        const configContent = fs.readFileSync(filepath).toString()
        fs.writeFileSync(filepath, configContent.replace('{{envId}}', envId))

        // 设置 region
        const configPath = filepath || path.join(projectPath, 'cloudbaserc.json')
        const parser = new ConfigParser({
            configPath
        })
        // 把 region 写入到配置文件中
        parser.update('region', region)
    }
}
