import { prompt } from 'enquirer'
import { Command, ICommand } from '../common'
import { CloudBaseError } from '../../error'
import { getImageRepo, createRun } from '../../run'
import { getVpcs, getSubnets } from '../../function'
import { checkTcbrEnv, loadingFactory, logEnvCheck } from '../../utils'
import { InjectParams, EnvId, ArgsOptions } from '../../decorators'
import { validateIp } from '../../utils/validator'
import { EnumEnvCheck } from '../../types'

const ZoneMap = {
    shanghai: '上海',
    guangzhou: '广州'
}

@ICommand()
export class CreateRun extends Command {
    get options() {
        return {
            cmd: 'run:deprecated',
            childCmd: 'create',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-n, --name <name>',
                    desc: '服务名称，必填'
                },
                {
                    flags: '-c, --vpc <vpc>',
                    desc: '云托管网络设置，默认系统创建，选择已有私有网络则填入格式为私有网络Id|子网Id1,...,子网Idn'
                },
                {
                    flags: '-p, --repo <repo>',
                    desc: '镜像仓库名，默认系统创建'
                },
                // {
                //     flags: '-l, --log <log>',
                //     desc: '日志管理设置，默认为系统默认cls，自定义ES则填入格式为Ip=xx&Port=xx&Index=xx&Account=xx&Password=xx'
                // },
                {
                    flags: '-m, --remark <remark>',
                    desc: '备注，默认为空'
                },
                {
                    flags: '-a, --publicAccess <publicAccess>',
                    desc: '是否允许公网访问(Y/N)，默认为允许'
                }
            ],
            desc: '创建云托管服务'
        }
    }

    @InjectParams()
    /* eslint complexity: ["error", 40] */
    async execute(@EnvId() envId, @ArgsOptions() options) {
        let envCheckType = await checkTcbrEnv(options.envId, false)
        if(envCheckType !== EnumEnvCheck.EnvFit) {
            logEnvCheck(envId, envCheckType)
            return
        }
        
        let {
            name: _name = '',
            vpc: _vpc = '',
            repo: _repo = '',
            log: _log = '',
            remark: _remark = '',
            publicAccess: _publicAccess = ''
        } = options
        let name: string
        let remark: string
        let vpcInfo: { VpcId: string; SubnetIds: string[]; CreateType: number }
        let imageRepo: string
        let logType: string
        let esInfo: { Ip: string; Port: number; Index: string; Account: string; Password: string }
        let publicAccess: number

        const loading = loadingFactory()

        // 服务名称
        if (!_name) {
            throw new CloudBaseError('请填入服务名')
        } else {
            name = _name
        }

        // 备注
        remark = _remark

        // 云托管网络配置
        if (!_vpc) {
            vpcInfo = {
                VpcId: '',
                SubnetIds: [],
                CreateType: 1
            }
        } else {
            vpcInfo = {
                VpcId: _vpc.split('|')[0],
                SubnetIds: _vpc.split('|')[1].split(','),
                CreateType: 2
            }
        }

        // 镜像仓库设置
        if (!_repo) {
            imageRepo = undefined
        } else {
            imageRepo = _repo
        }

        // 日志配置
        if (!_log) {
            logType = 'cls'
        } else {
            logType = 'es'

            esInfo = _log.split('&').reduce((pre, item) => {
                pre[item.split('=')[0]] = item.split('=')[0] === 'Port' ? Number(item.split('=')[1]) : item.split('=')[1]
                return pre
            }, {})
        }

        // 公网访问服务
        if (!_publicAccess) {
            publicAccess = 1
        } else if (/[^nNyY]/.test(_publicAccess) || _publicAccess.length !== 1) {
            throw new CloudBaseError('请输入符合规范的公网访问服务设置')
        } else if (_publicAccess === 'N' || _publicAccess === 'n') {
            publicAccess = 2
        } else {
            publicAccess = 1
        }

        const res = await createRun({
            envId,
            name,
            remark,
            vpcInfo,
            imageRepo,
            logType,
            esInfo,
            publicAccess,
            isPublic: true
        })

        if (res === 'succ') loading.succeed(`云托管服务 ${name} 创建成功！`)
        else throw new CloudBaseError('创建失败，请查看是否已经有同名服务')
    }
}
