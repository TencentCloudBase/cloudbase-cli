import { exec } from 'child_process'
import * as util from 'util'
import { prompt } from 'enquirer'
import { Command, ICommand } from '../../common'
import { CloudBaseError } from '../../../error'
import { describeImageRepo, getAuthFlag } from '../../../run'
import { loadingFactory, getUin } from '../../../utils'
import { InjectParams, EnvId, ArgsOptions } from '../../../decorators'
import { imageCommonOptions } from './common'

@ICommand()
export class DownLoadImage extends Command {
    get options() {
        return {
            ...imageCommonOptions('download'),
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
                    flags: '-t, --imageTag <imageTag>',
                    desc: '镜像 tag'
                }
            ],
            desc: '删除云开发环境下云托管服务的版本'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsOptions() options) {

        let { serviceName = '', imageTag = '' } = options

        if (serviceName.length === 0 || imageTag.length === 0) {
            throw new CloudBaseError('必须输入 serviceName 和 imageTag')
        }

        const loading = loadingFactory()

        // loading.start('数据加载中...')

        const imageRepo = await describeImageRepo({ envId, serverName: serviceName })

        const imageUrl = `ccr.ccs.tencentyun.com/${imageRepo}:${imageTag}`

        let uin = await getUin()

        if (uin === '无') {
            uin = (await prompt<any>({
                type: 'input',
                message: '请输入账号ID（或采用web登录）',
                name: 'uin'
            })).uin
        }

        if (!(await getAuthFlag())) {
            console.log('无法找到~/.docker/config.json或未登录，需要执行docker login')
            const { pw } = await prompt<any>({
                type: 'password',
                message: '请输入镜像仓库密码',
                name: 'pw'
            })

            loading.start('登陆中')
            let { stdout, stderr } = await util.promisify(exec)(`docker login --username=${uin} ccr.ccs.tencentyun.com -p ${pw}`)
            if (stdout.search('Login Succeeded') === -1) throw new CloudBaseError(stderr)
            loading.succeed('登录成功')
        }

        // loading.start('正在拉取中')
        let sh = new Promise<{ code: number, info: string }>(
            (resolve, reject) => {
                exec(
                    `docker pull ${imageUrl}`,
                    (err, stdout) => err ? reject(err) : resolve({ code: 0, info: stdout })
                ).stdout.pipe(process.stdout)
            })

        await sh

        loading.succeed('拉取成功')
    }
}