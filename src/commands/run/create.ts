import { prompt } from 'enquirer'
import { Command, ICommand } from '../common'
import { CloudBaseError } from '../../error'
import { getVpcs, getSubnets, getImageRepo, createRun } from '../../run'
import { loadingFactory } from '../../utils'
import { InjectParams, EnvId, ArgsOptions } from '../../decorators'
import { validateIp } from '../../utils/validator'

const ZoneMap = {
    'shanghai': '上海',
    'guangzhou': '广州'
}

@ICommand()
export class CreateRun extends Command {
    get options() {
        return {
            cmd: 'run',
            childCmd: 'create',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-n, --name <name>',
                    desc: '服务名称'
                }
            ],
            desc: '创建云托管服务'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsOptions() options) {
        let { name = '' } = options
        let remark: string
        let vpcInfo = { VpcId: '', SubnetIds: [], CreateType: 1 }
        let logType = 'cls'
        let esInfo = { Ip: '', Port: 65535, Index: '', Account: '', Password: '' }
        let publicAccess = 1
        let imageRepo: string

        if (name.length === 0) throw new CloudBaseError('请输入服务名')

        const loading = loadingFactory()

        if (!remark) {
            remark = (await prompt<any>({
                type: 'input',
                name: 'remark',
                message: '请输入服务的备注',
            })).remark
        }

        // 如果选择私有网络，那么需要填写配置
        if ((await prompt<any>({
            type: 'select',
            name: 'createType',
            message: '请选择云托管网络',
            choices: ['系统创建', '选择已有私有网络']
        })).createType === '选择已有私有网络') {

            vpcInfo.CreateType = 2

            // 选择私有网络
            const vpcs = await getVpcs()
            const { vpc } = (await prompt<any>({
                type: 'select',
                name: 'vpc',
                message: '请选择私有网络',
                choices: vpcs.map(item => `${item.VpcId}|${item.VpcName}|${item.CidrBlock}`)
            }))
            vpcInfo.VpcId = vpc.split('|')[0]

            // 选择子网
            const subnets = await getSubnets(vpcInfo.VpcId)
            const { subnet } = (await prompt<any>({
                type: 'multiselect',
                name: 'subnet',
                message: '请选择子网（空格选择）',
                choices: subnets.map(item => `${item.SubnetId}|${item.SubnetName}|${item.CidrBlock}|${ZoneMap[item.Zone.split('-')[1]]}|${item.TotalIpAddressCount}剩余IP`)
            }))
            if (subnet.length === 0) throw new CloudBaseError('请至少选择一个子网')
            vpcInfo.SubnetIds = subnet.map(item => item.split('|')[0])

        }

        // 如果选择已有镜像仓库，那么选择镜像仓库
        if ((await prompt<any>({
            type: 'select',
            name: 'imageRepoType',
            message: '请选择镜像仓库类型',
            choices: ['使用系统默认', '绑定腾讯云已有镜像仓库']
        })).imageRepoType === '绑定腾讯云已有镜像仓库') {

            const imageRepos = await getImageRepo()
            if (imageRepos.length === 0) throw new CloudBaseError('没有可以绑定的镜像仓库')
            imageRepo = (await prompt<any>({
                type: 'select',
                name: 'imageInfo',
                message: '请选择镜像仓库',
                choices: imageRepos.map(item => `${item.RepoName}|${item.RepoType}|${item.Description}`)
            })).imageInfo.split('|')[0]

        }

        // 如果选择 ES 作为日志管理，则填写 ES 配置
        if ((await prompt<any>({
            type: 'select',
            name: 'logType',
            message: '选择日志管理方式',
            choices: ['系统默认', '自定义ElasticSearch']
        })).logType === '自定义ElasticSearch') {

            logType = 'es'

            let { esIp } = (await prompt<any>({
                type: 'input',
                name: 'esIp',
                message: '请输入ES-IP',
            }))
            if (!validateIp(esIp))
                throw new CloudBaseError('请输入合法有效的IP')
            esInfo.Ip = esIp

            let { port } = (await prompt<any>({
                type: 'input',
                name: 'port',
                message: '请输入ES-端口',
            }))
            if (isNaN(Number(port)) || Number(port) < 0 || Number(port) > 65535)
                throw new CloudBaseError('请输入合法有效的端口号')
            esInfo.Port = Number(port)

            let { index } = (await prompt<any>({
                type: 'input',
                name: 'index',
                message: '请输入ES-索引',
            }))
            if (index.length === 0)
                throw new CloudBaseError('请输入合法有效的索引')
            esInfo.Index = index

            let { account } = (await prompt<any>({
                type: 'input',
                name: 'account',
                message: '请输入ES-账号',
            }))
            if (account.length === 0)
                throw new CloudBaseError('请输入合法有效的账号')
            esInfo.Account = account

            let { pw } = (await prompt<any>({
                type: 'input',
                name: 'pw',
                message: '请输入ES-密码',
            }))
            if (pw.length === 0) throw new CloudBaseError('请输入合法有效的密码')
            esInfo.Password = pw
        }

        if ((await prompt<any>({
            type: 'select',
            name: 'publicAccess',
            message: '请选择是否开启公网访问服务',
            choices: ['是', '否']
        })).publicAccess === '否') publicAccess = 2

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