import path from 'path'
import { Command, ICommand } from '../common'
import { CloudBaseError } from '../../error'
import { set } from 'lodash'
import { listModels, getModel, updateModel, createModel, publishModel } from '../../db'
import { listEnvs } from '../../env'
import { InjectParams, EnvId, ArgsParams, ArgsOptions, Log, Logger } from '../../decorators'
import { printHorizontalTable, loadingFactory, genClickableLink } from '../../utils'
import inquirer from 'inquirer'
import chalk from 'chalk'
import fs from 'fs-extra'
import { generateDataModelDTS } from '../../utils/dts'

@ICommand()
export class DbListCommand extends Command {
    get options() {
        return {
            cmd: 'db',
            childCmd: 'list',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
            ],
            requiredEnvId: false,
            autoRunLogin: true,
            desc: '列出云端所有数据模型',
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @Log() log: Logger) {
        const loading = loadingFactory()

        if (!envId) {
            envId = await selectEnv()
        } else {
            log.info(`当前环境 Id：${envId}`)
        }


        /**
        * 生成 cloudbaserc.json 文件（如果不存在的情况）
        */
        if (!(await fs.pathExists('cloudbaserc.json'))) {
            await fs.writeFile(
                'cloudbaserc.json',
                JSON.stringify(
                    {
                        version: '2.0',
                        envId
                    },
                    null,
                    2
                ),
                'utf8'
            )
        }

        loading.start('数据加载中...')
        const data = await listModels({ envId })
        loading.stop()
        const head = ['名称', '标识', '创建时间']

        const sortData = data.sort((prev, next) => {
            if (prev.Alias > next.Alias) {
                return 1
            }
            if (prev.Alias < next.Alias) {
                return -1
            }
            return 0
        })

        const tableData = sortData.map((item) => [
            item.Title,
            item.Name,
            item.CreatedAt
        ])

        printHorizontalTable(head, tableData)
    }
}

@ICommand()
export class DbPullCommand extends Command {
    get options() {
        return {
            cmd: 'db',
            childCmd: 'pull',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-d, --dir <dir>',
                    desc: '本地存储数据库模型定义的目录，默认为 database-schemas'
                },
                {
                    flags: '-n, --name <name>',
                    desc: '要拉取的模型英文标识列表，可指定多个,使用逗号分隔.不指定的情况下默认会拉取所有模型'
                }
            ],
            requiredEnvId: false,
            autoRunLogin: true,
            desc: '从云端拉取多个数据模型到本地',
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsParams() params, @Log() log: Logger) {
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


        if (!envId) {
            envId = await selectEnv()
        } else {
            log.info(`当前环境 Id：${envId}`)
        }


        /**
        * 生成 cloudbaserc.json 文件（如果不存在的情况）
        */
        if (!(await fs.pathExists('cloudbaserc.json'))) {
            await fs.writeFile(
                'cloudbaserc.json',
                JSON.stringify(
                    {
                        version: '2.0',
                        envId
                    },
                    null,
                    2
                ),
                'utf8'
            )
        }


        let {
            name = '',
            dir
        } = params

        name = name.split(',').map(item => item.trim()).filter(item => item)

        if (!name.length) {
            name = await selectModel(envId)
        }

        const data = await listModels({
            envId,
            name
        })

        const dataModelList = data.map((item) => {
            const schema = JSON.parse(item.Schema)
            schema.title = item.Title
            return {
                name: item.Name,
                schema,
                title: item.Title
            }

        })

        if (!dir) {
            dir = 'database-schemas'

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir)
            }

            dataModelList.forEach((item) => {
                const fileName = `${dir}/${item.name}.json`
                fs.writeFileSync(fileName, JSON.stringify(item.schema, null, 4))
                log.success(`同步数据模型成功。文件名称：${fileName}`)
            })
        }


        const dts = await generateDataModelDTS(dataModelList)
        const dtsFileName = 'cloud-models.d.ts'
        await fs.writeFile(dtsFileName, dts)
        log.success('同步数据模型类型定义文件成功，调用 SDK 时可支持智能字段提示。文件名称：' + dtsFileName)
    }
}

@ICommand()
export class DbPushCommand extends Command {
    get options() {
        return {
            cmd: 'db',
            childCmd: 'push',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-d, --dir <dir>',
                    desc: '本地存储数据库模型定义的目录，默认为 database-schemas'
                },
                {
                    flags: '-n, --name <name>',
                    desc: '要推送的模型名称列表，可指定多个,使用逗号分隔.不指定的情况下默认会推送本地目录下的所有数据模型'
                }
            ],
            requiredEnvId: false,
            autoRunLogin: true,
            desc: '将本地数据模型推送到云端',
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsParams() params, @Log() log: Logger) {

        if (!envId) {
            envId = await selectEnv()
        } else {
            log.info(`使用环境 Id：${envId}`)
        }

        let {
            name = '',
            dir
        } = params

        name = name.split(',').map(item => item.trim()).filter(item => item)

        if (!dir) {
            dir = 'database-schemas'

            if (!fs.existsSync(dir)) {
                throw new CloudBaseError(`目录 ${dir} 不存在，请指定正确的目录`)
            }
        }


        // 默认读取本地目录下的所有数据模型
        if (!name.length) {
            name = fs.readdirSync(dir).map(item => item.replace('.json', ''))
        }

        if (!name.length) {
            throw new CloudBaseError(`目录 ${dir} 中没有找到任何数据模型`)
        }

        // 检查数据模型是否存在
        // 不存在则会创建
        // 存在的则会更新
        // 都存在一个 confirm 的动作
        const ids = []
        for (const modelName of name) {
            log.info(`开始检查数据模型 ${modelName}`)
            const modelPath = path.join(process.cwd(), dir, `${modelName}.json`)
            const model = require(modelPath)
            const existModel = await getModel({
                envId,
                name: modelName
            })

            if (existModel) {
                const confirm = await inquirer.prompt([
                    {
                        type: 'confirm',
                        name: 'confirm',
                        message: `数据模型 ${modelName} 已存在，是否更新？`
                    }
                ])
                if (!confirm.confirm) {
                    log.info(`跳过更新数据模型 ${modelName}`)
                    continue
                }

                await updateModel({
                    envId,
                    id: existModel.Id,
                    title: model.title || existModel.Title,
                    schema: model
                })
                ids.push(existModel.Id)
                const link = genClickableLink(`https://tcb.cloud.tencent.com/cloud-admin/#/management/data-model/${existModel.Id}}`)
                log.success(`更新数据模型 ${modelName} 成功，点击查看 ${link}`)
            } else {
                // 如果不存在，确认是否创建
                const confirm = await inquirer.prompt([
                    {
                        type: 'confirm',
                        name: 'confirm',
                        message: `数据模型 ${modelName} 不存在，是否创建？`
                    }
                ])
                if (!confirm.confirm) {
                    log.info(`跳过创建数据模型 ${modelName}`)
                    continue
                }
                const createModelRes = await createModel({
                    envId,
                    name: modelName,
                    title: model.title || modelName,
                    schema: model
                })
                ids.push(createModelRes.Id)
                const link = genClickableLink(`https://tcb.cloud.tencent.com/cloud-admin/#/management/data-model/${createModelRes.Id}}`)
                log.success(`创建数据模型 ${modelName} 成功, 点击查看 ${link}`)
            }



        }

        // 确认是否发布
        const confirmPublish = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: `数据模型已经导入成功，是否发布？`
            }

        ])
        if (confirmPublish.confirm) {
            const publishRes = await publishModel({
                envId,
                ids
            })
        }
    }

}


async function selectEnv() {
    const data = await listEnvs()

    const sortData = data.sort((prev, next) => {
        if (prev.Alias > next.Alias) {
            return 1
        }
        if (prev.Alias < next.Alias) {
            return -1
        }
        return 0
    })

    const choices = sortData.map((item) => {
        return {
            name: `${item.Alias || item.EnvId}  (${item.EnvId}) ${item.Status === 'NORMAL' ? '正常' : '不可用'}`,
            value: item.EnvId,
            short: item.envId
        }
    })

    const questions = [
        {
            type: 'list',
            name: 'env',
            message: '请先选择一个云开发环境',
            choices: choices
        }
    ];

    const answers = await inquirer.prompt(questions)

    return answers.env
}


async function selectModel(envId) {
    const data = await listModels({
        envId
    })

    const sortData = data.sort((prev, next) => {
        if (prev.CreatedAt > next.CreatedAt) {
            return 1
        }
        if (prev.CreatedAt < next.CreatedAt) {
            return -1
        }
        return 0
    })

    const choices = sortData.map((item) => {
        return {
            name: `${item.Title}  (${item.Name})`,
            value: item.Name,
            short: item.Name
        }
    })

    const questions = [
        {
            type: 'checkbox',
            name: 'model',
            message: '请选择数据模型',
            choices: choices
        }
    ];

    const answers = await inquirer.prompt(questions)

    return answers.model
}