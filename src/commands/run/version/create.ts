import { prompt } from 'enquirer'
import { statSync, writeFileSync, unlinkSync } from 'fs'
import { zipDir } from '@cloudbase/toolbox'
import { Command, ICommand } from '../../common'
import { CloudBaseError } from '../../../error'
import {
    uploadZip,
    createBuild,
    createVersion,
    listRepo,
    listImage,
    listBranch,
    basicOperate,
    logCreate
} from '../../../run'
import { loadingFactory, pagingSelectPromp, random } from '../../../utils'
import { InjectParams, EnvId, ArgsOptions } from '../../../decorators'
import { versionCommonOptions } from './common'

const uploadTypeMap = {
    '本地代码': 'package',
    '代码库拉取': 'repository',
    '镜像拉取': 'image'
}

const memMap = {
    0.25: [2, 8],
    0.5: [2, 8],
    1: [1, 8],
    2: [2, 8],
    4: [2, 8],
    8: [2, 4],
    16: [2, 4]
}

@ICommand()
export class CreateVersion extends Command {
    get options() {
        return {
            ...versionCommonOptions('create'),
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-s, --serviceName <serviceName>',
                    desc: '托管服务 name'
                },
                {
                    flags: '-v, --versionName <versionName>',
                    desc: '版本名称 Name'
                }
            ],
            desc: '创建云开发环境下云托管服务的版本'
        }
    }

    /* eslint complexity: ["error", 40] */
    @InjectParams()
    async execute(@EnvId() envId, @ArgsOptions() options) {

        let { serviceName = '' } = options

        if (serviceName.length === 0) {
            throw new CloudBaseError('必须输入 serviceName')
        }
        let path: string
        let repositoryType: string
        let branch: string
        let codeDetail: { Name: { Name: string, FullName: string } }
        let imageInfo: { ImageUrl: string }
        let containerPort: number
        let flowRatio: number
        let versionRemark: string
        let cpu: number
        let mem: number
        let minNum: number
        let maxNum: number
        let policyType: string
        let policyThreshold: number
        let customLogs = 'stdout'
        let dockerfilePath = 'Dockerfile'
        let initialDelaySeconds = 2
        let envParams = '{}'

        const uid = random(4)

        const loading = loadingFactory()

        let { uploadType } = await prompt<any>({
            type: 'select',
            name: 'uploadType',
            choices: ['本地代码', '代码库拉取', '镜像拉取'],
            message: '请选择上传方式',
        })

        if (uploadType === '本地代码') {
            path = (await prompt<any>({
                type: 'input',
                name: 'path',
                message: '请输入文件的路径'
            })).path

            if (statSync(path).isDirectory()) {
                loading.start('正在压缩中')
                await zipDir(path, `./code${uid}.zip`)
                loading.succeed('压缩完成')
                path = `./code${uid}.zip`
            }
        } else if (uploadType === '代码库拉取') {
            let { repoType } = await prompt<any>({
                type: 'select',
                name: 'repoType',
                choices: ['GitHub', 'Gitee', 'GitLab'],
                message: '请选择代码库',
            })

            repositoryType = repoType.toLowerCase()

            let pageNumber = 1
            while (true) {
                const { IsFinished, RepoList, Error } = await listRepo({ channel: repoType.toLowerCase(), pageNumber, pageSize: 50 })

                if (Error) throw new CloudBaseError('请检查是否授权')
                if (!RepoList || RepoList.length === 0) throw new CloudBaseError('没有可供选择的仓库')

                const { repoName } = await prompt<any>({
                    type: 'select',
                    name: 'repoName',
                    message: '选择仓库',
                    choices: IsFinished ? RepoList.map(item => item.FullName) : [...RepoList.map(item => item.FullName), '下一页']
                })

                if (repoName !== '下一页') {
                    codeDetail = { Name: { Name: repoName.split('/')[1], FullName: repoName } }
                    break
                }

                pageNumber++
            }

            pageNumber = 1
            while (true) {
                const { IsFinished, BranchList } = await listBranch({
                    channel: repoType.toLowerCase(),
                    pageNumber,
                    pageSize: 50,
                    repoName: codeDetail['Name']
                })

                if (!BranchList || BranchList.length === 0) throw new CloudBaseError('没有可供选择的分支')

                const { branchName } = await prompt<any>({
                    type: 'select',
                    name: 'branchName',
                    message: '选择分支',
                    choices: IsFinished ? BranchList.map(item => item.Name) : [...BranchList.map(item => item.Name), '下一页']
                })

                if (branchName !== '下一页') {
                    break
                }

                pageNumber++
            }
        } else {
            let ImageUrl = await pagingSelectPromp(
                'select',
                listImage,
                { envId, serviceName, limit: 0, offset: 0 },
                '请选择镜像',
                item => true,
                item => item.ImageUrl)

            imageInfo = {
                ImageUrl: ImageUrl as string,
            }
        }

        containerPort = Number((await prompt<any>({
            type: 'input',
            name: 'port',
            message: '请输入监听端口号'
        })).port)

        flowRatio = (await prompt<any>({
            type: 'select',
            name: 'flow',
            message: '请选择流量策略',
            choices: ['保持流量为0， 稍后设置', '直接开启100%流量']
        })).flow === '直接开启100%流量' ? 100 : 0

        versionRemark = (await prompt<any>({
            type: 'input',
            name: 'versionRemark',
            message: '请输入备注',
        })).versionRemark

        cpu = Number((await prompt<any>({
            type: 'select',
            name: 'cpu',
            message: '请输入cpu规格（核数）',
            choices: ['0.25', '0.5', '1', '2', '4', '8', '16']
        })).cpu)

        const memList =
            new Array(memMap[cpu][1] * cpu - Math.floor(memMap[cpu][0] * cpu) + 1)
                .fill(memMap[cpu][1] * cpu)
                .map((item, index, array) => String(item - (array.length - 1 - index)))

        memList[0] = String(Number(memList[0]) <= 0 ? 0.5 : memList[0])

        mem = Number((await prompt<any>({
            type: 'select',
            name: 'mem',
            message: '请输入内存规格（G）',
            choices: memList
        })).mem)

        minNum = Number((await prompt<any>({
            type: 'input',
            name: 'num',
            message: '请输入最小副本个数',
        })).num)

        if (Number.isNaN(minNum) || minNum - Math.floor(minNum) !== 0)
            throw new CloudBaseError('请输入大于等于0的整数')

        maxNum = Number((await prompt<any>({
            type: 'input',
            name: 'num',
            message: '请输入最大副本个数',
        })).num)

        if (Number.isNaN(maxNum) || maxNum - Math.floor(maxNum) !== 0)
            throw new CloudBaseError('请输入大于等于0的整数')

        policyType = (await prompt<any>({
            type: 'select',
            name: 'type',
            message: '扩容条件是',
            choices: ['cpu使用率', '内存使用率']
        })).type === 'cpu使用率' ? 'cpu' : 'mem'

        policyThreshold = Number((await prompt<any>({
            type: 'input',
            name: 'threshold',
            message: '边界条件值是（%）',
        })).threshold)

        if (Number.isNaN(policyThreshold) || policyThreshold <= 0 || policyThreshold > 100)
            throw new CloudBaseError('请输入合理的数字')

        if ((await prompt<any>({
            type: 'select',
            name: 'type',
            message: '请问是否进行高级设置',
            choices: ['是', '否']
        })).type === '是') {
            if (uploadType !== '镜像拉取') {
                customLogs = (await prompt<any>({
                    type: 'input',
                    name: 'logs',
                    message: '请输入日志采集路径',
                })).logs
            }

            dockerfilePath = (await prompt<any>({
                type: 'input',
                name: 'dockerfile',
                message: '请输入dockerfile名称',
            })).dockerfile

            initialDelaySeconds = Number((await prompt<any>({
                type: 'input',
                name: 'seconds',
                message: '请输入initialDelaySeconds',
            })).seconds)

            if (Number.isNaN(initialDelaySeconds))
                throw new CloudBaseError('请输入正常数字')

            let _envParams = {}
            while (true) {
                if ((await prompt<any>({
                    type: 'select',
                    name: 'flag',
                    message: '请问是否要继续填入环境变量',
                    choices: ['是', '否']
                })).flag === '否') break

                let { key } = await prompt<any>({
                    type: 'input',
                    name: 'key',
                    message: '请填入环境变量name',
                })

                let { value } = await prompt<any>({
                    type: 'input',
                    name: 'value',
                    message: '请填入环境变量value',
                })

                _envParams[key] = value
            }

            envParams = JSON.stringify(_envParams)
        }

        loading.start('加载中...')


        let res = ''
        let runId = ''
        if (uploadType === '本地代码') {
            loading.start('正在上传中')
            let { PackageName, PackageVersion, UploadHeaders, UploadUrl } = await createBuild({ envId, serviceName })
            await uploadZip(path, UploadUrl, UploadHeaders[0])
            loading.succeed('上传成功')
            if (path === `./code${uid}.zip`) {
                loading.start('删除本地压缩包')
                unlinkSync(path)
                loading.succeed('成功删除本地压缩包')
            }

            let response = await createVersion({
                envId,
                serverName: serviceName,
                containerPort,
                uploadType: uploadTypeMap[uploadType],
                packageName: PackageName,
                packageVersion: PackageVersion,
                flowRatio,
                versionRemark,

                enableUnion: true,
                cpu,
                mem,
                minNum,
                maxNum,
                policyType,
                policyThreshold,

                customLogs,
                dockerfilePath,
                envParams,
                initialDelaySeconds,
            })
            res = response.Result
            runId = response.RunId
        } else if (uploadType === '镜像拉取') {
            let response = await createVersion({
                envId,
                serverName: serviceName,
                containerPort,
                uploadType: uploadTypeMap[uploadType],
                imageInfo,
                flowRatio,
                versionRemark,

                enableUnion: true,
                cpu,
                mem,
                minNum,
                maxNum,
                policyType,
                policyThreshold,

                customLogs,
                envParams,
                initialDelaySeconds,
            })
            res = response.Result
            runId = response.RunId
        } else {
            let response = await createVersion({
                envId,
                serverName: serviceName,
                containerPort,
                uploadType: uploadTypeMap[uploadType],
                repositoryType,
                branch,
                codeDetail,
                flowRatio,
                versionRemark,

                enableUnion: true,
                cpu,
                mem,
                minNum,
                maxNum,
                policyType,
                policyThreshold,

                customLogs,
                dockerfilePath,
                envParams,
                initialDelaySeconds,
            })
            res = response.Result
            runId = response.RunId
        }
        if (res !== 'succ')
            throw new CloudBaseError('提交构建任务失败')

        loading.start('正在部署中')

        while (true) {
            let { Percent, Status } = await basicOperate({ envId, runId })

            if (Status === 'build_fail') {
                let logs = await logCreate({ envId, runId })
                writeFileSync(`./log${runId}`, logs.reduce((res, item) => res + item + '\n', ''))
                throw new CloudBaseError(`构建失败，日志写入./log${runId}中`)
            } else if (Status !== 'creating') {
                break
            }


            loading.start(`目前构建进度${Percent}%`)

            await new Promise(resolve => { setTimeout(_ => resolve('again'), 2000) })
        }

        loading.succeed('构建成功')
    }
}
