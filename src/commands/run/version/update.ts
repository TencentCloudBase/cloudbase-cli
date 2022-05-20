import { prompt } from 'enquirer'
import { statSync, writeFileSync, unlinkSync } from 'fs'
import { zipDir } from '@cloudbase/toolbox'
import { Command, ICommand } from '../../common'
import { CloudBaseError } from '../../../error'
import {
    uploadZip,
    createBuild,
    updateVersion,
    listRepo,
    listImage,
    listBranch,
    basicOperate,
    logCreate,
    describeRunVersion
} from '../../../run'
import { checkTcbrEnv, loadingFactory, logEnvCheck, pagingSelectPromp, random } from '../../../utils'
import { InjectParams, EnvId, ArgsOptions } from '../../../decorators'
import { versionCommonOptions } from './common'
import { EnumEnvCheck } from '../../../constant'

const uploadTypeMap = {
    本地代码: 'package',
    代码库拉取: 'repository',
    镜像拉取: 'image'
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

const describeVersion = (base: any) => {
    console.log('目前的配置如下')
    console.log(`镜像名 ${base.ImageUrl.split(':')[1]}`)
    console.log(
        `上传方式 ${
            base.UploadType === 'image'
                ? '镜像拉取'
                : base.UploadType === 'package'
                ? '本地代码上传'
                : '代码仓库拉取'
        }`
    )
    console.log(`监听端口 ${base.VersionPort}`)
    console.log(`扩缩容条件 ${base.PolicyType}使用率 > ${base.PolicyThreshold}`)
    console.log(`规格 cpu ${base.Cpu}核 mem ${base.Mem}G`)
    console.log(`InitialDelaySeconds ${base.InitialDelaySeconds}`)
    console.log(`日志采集路径 ${base.InitialDelaySeconds}`)
    console.log(`环境变量 ${base.EnvParams}`)
}

/* eslint complexity: ["error", 40] */
@ICommand()
export class UpdateVersion extends Command {
    get options() {
        return {
            ...versionCommonOptions('update'),
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
                },
                {
                    flags: '-p, --path <path>',
                    desc: '本地代码路径，选择本地代码上传时使用'
                },
                {
                    flags: '--repo <repo>',
                    desc: '仓库信息，形如 channel|fullName|branch，channel为github、gitlab或gitee，选择代码库拉取时使用'
                },
                {
                    flags: '-i, --image <image>',
                    desc: '镜像url，选择镜像拉取时使用'
                },
                {
                    flags: '--port <port>',
                    desc: '监听端口，默认为80'
                },
                {
                    flags: '-f, --flow <flow>',
                    desc: '流量策略（%），0或100，默认为0'
                },
                {
                    flags: '-m, --remark <remark>',
                    desc: '备注信息，默认为空'
                },
                {
                    flags: '-c, --cpu <cpu>',
                    desc: 'cpu规格（核数），默认为0.5'
                },
                {
                    flags: '--mem <mem>',
                    desc: '内存规格（G），默认为1'
                },
                {
                    flags: '--copy <copy>',
                    desc: '副本个数，格式为最小个数~最大个数，默认为0~50'
                },
                {
                    flags: '--policy <policy>',
                    desc: '扩缩容条件，格式为条件类型|条件比例（%），cpu条件为cpu，内存为条件mem，默认为cpu|60'
                },
                {
                    flags: '--dockerFile <dockerFile>',
                    desc: 'dockerfile名称，非镜像拉取时使用，默认为Dockerfile'
                },
                {
                    flags: '-l, --log <log>',
                    desc: '日志采集路径，默认为stdout'
                },
                {
                    flags: '-d, --delay <delay>',
                    desc: '初始延迟时间（秒），默认为2'
                },
                {
                    flags: '--env <env>',
                    desc: '环境变量，格式为xx=a&yy=b，默认为空'
                }
            ],
            desc: '创建云开发环境下云托管服务的版本'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsOptions() options) {
        let envCheckType = await checkTcbrEnv(options.envId, false)
        if(envCheckType !== EnumEnvCheck.EnvFit) {
            logEnvCheck(envId, envCheckType)
            return
        }
        
        let {
            serviceName = '',
            versionName = '',
            path: _path = '',
            repo: _repo = '',
            image: _image = '',
            port: _port = '80',
            flow: _flow = '0',
            remark: _remark = '',
            cpu: _cpu = '0.5',
            mem: _mem = '1',
            copy: _copy = '0~50',
            policy: _policy = 'cpu|60',
            dockerfile: _dockerfile = 'Dockerfile',
            log: _log = 'stdout',
            delay: _delay = '2',
            env: _env = ''
        } = options

        if (!serviceName || !versionName) {
            throw new CloudBaseError('必须输入 serviceName 和 versionName')
        }
        let path: string
        let repositoryType: string
        let branch: string
        let codeDetail: { Name: { Name: string; FullName: string } }
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

        // 上传方式
        if (_path) {
            path = _path

            if (statSync(path).isDirectory()) {
                loading.start('正在压缩中')
                await zipDir(path, `./code${uid}.zip`)
                loading.succeed('压缩完成')
                path = `./code${uid}.zip`
            }
        } else if (_repo) {
            const repo = _repo.split('|')

            repositoryType = repo[0]

            codeDetail.Name.FullName = repo[1]
            codeDetail.Name.Name = repo[1].split('/')[1]

            branch = repo[2]
        } else if (_image) {
            imageInfo = {
                ImageUrl: _image
            }
        } else {
            throw new CloudBaseError('请至少选择一个上传方式')
        }

        // 端口号
        containerPort = Number(_port)
        if (isNaN(containerPort)) {
            throw new CloudBaseError('请输入合法的端口号')
        }

        // 流量策略
        flowRatio = Number(_flow)
        if (![100, 0].includes(flowRatio)) {
            throw new CloudBaseError('请输入合法的流量策略')
        }

        // 备注
        versionRemark = _remark

        // 规格
        cpu = Number(_cpu)
        mem = Number(_mem)
        if (isNaN(cpu) || isNaN(mem)) {
            throw new CloudBaseError('请输入合法的cpu和内存规格')
        }

        // 副本个数
        minNum = Number(_copy.split('~')[0])
        maxNum = Number(_copy.split('~')[1])
        if (isNaN(maxNum) || isNaN(minNum)) {
            throw new CloudBaseError('请输入合法的副本个数')
        }

        // 扩缩容条件
        policyType = _policy.split('|')[0]
        policyThreshold = Number(_policy.split('|')[1])
        if (!['cpu', 'mem'].includes(policyType) || isNaN(policyThreshold)) {
            throw new CloudBaseError('请输入合法的扩缩容条件')
        }

        // dockerfile 名称，在非镜像拉取时使用
        dockerfilePath = _dockerfile

        // 日志采集路径
        customLogs = _log

        // 初始延迟时间
        initialDelaySeconds = Number(_delay)
        if (isNaN(initialDelaySeconds)) {
            throw new CloudBaseError('请输入合法的延迟时间')
        }

        // 环境变量
        let _envParams = {}
        _env.split('&').forEach((item) => {
            _envParams[item.split('=')[0]] = item.split('=')[1]
        })
        envParams = JSON.stringify(_envParams)

        loading.start('加载中...')

        let res = ''
        let runId = ''
        if (_path) {
            loading.start('正在上传中')
            let { PackageName, PackageVersion, UploadHeaders, UploadUrl } = await createBuild({
                envId,
                serviceName
            })
            await uploadZip(path, UploadUrl, UploadHeaders[0])
            loading.succeed('上传成功')
            if (path === `./code${uid}.zip`) {
                loading.start('删除本地压缩包')
                unlinkSync(path)
                loading.succeed('成功删除本地压缩包')
            }

            let response = await updateVersion({
                envId,
                serverName: serviceName,
                versionName,
                containerPort,
                uploadType: 'package',
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
                initialDelaySeconds
            })
            res = response.Result
            runId = response.RunId
        } else if (_image) {
            let response = await updateVersion({
                envId,
                serverName: serviceName,
                versionName,
                containerPort,
                uploadType: 'image',
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
                initialDelaySeconds
            })
            res = response.Result
            runId = response.RunId
        } else {
            let response = await updateVersion({
                envId,
                serverName: serviceName,
                versionName,
                containerPort,
                uploadType: 'repository',
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
                initialDelaySeconds
            })
            res = response.Result
            runId = response.RunId
        }
        if (res !== 'succ') throw new CloudBaseError('提交构建任务失败')

        loading.start('正在部署中')

        while (true) {
            let { Percent, Status } = await basicOperate({ envId, runId })

            if (Status === 'build_fail') {
                let logs = await logCreate({ envId, runId })
                writeFileSync(
                    `./log${runId}`,
                    logs.reduce((res, item) => res + item + '\n', '')
                )
                throw new CloudBaseError(`构建失败，日志写入./log${runId}中`)
            } else if (Status !== 'updating') {
                break
            }

            loading.start(`目前构建进度${Percent}%`)

            await new Promise((resolve) => {
                setTimeout((_) => resolve('again'), 2000)
            })
        }

        loading.succeed('构建成功')
    }
}
