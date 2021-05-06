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
export class UploadImage extends Command {
    get options() {
        return {
            ...imageCommonOptions('upload'),
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
                    flags: '-i, --imageId <imageId>',
                    desc: '本地镜像 id'
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

        const { serviceName = '', imageId = '', imageTag = '' } = options

        if (serviceName.length === 0 || imageId.length === 0 || imageTag.length === 0) {
            throw new CloudBaseError('必须输入 serviceName 和 imageId 和 imageTag')
        }

        const loading = loadingFactory()

        // loading.start('数据加载中...')

        const uin = await getUin()

        if (uin === '无')
            throw new CloudBaseError('请确认是否登录cloudbase')

        if (!(await getAuthFlag())) {
            console.log('操作会自动执行docker login')
            const { pw } = await prompt<any>({
                type: 'password',
                message: '请输入镜像仓库密码',
                name: 'pw'
            })

            loading.start('登陆中')
            let { stdout, stderr } = await util.promisify(exec)(`${process.platform.search('win') === -1 ? 'sudo ' : ''}docker login --username=${uin} ccr.ccs.tencentyun.com -p ${pw}`);
            if (stdout.search('Login Succeeded') === -1) throw new CloudBaseError(stderr)
            loading.succeed('登录成功')
        }

        const imageRepo = await describeImageRepo({ envId, serverName: serviceName })

        let stderr
        if (stderr = (await util.promisify(exec)(`${process.platform.search('win') === -1 ? 'sudo ' : ''}docker tag ${imageId} ccr.ccs.tencentyun.com/${imageRepo}:${imageTag}`)).stderr)
            throw new CloudBaseError(stderr)

        // loading.start('正在上传中')
        let sh = new Promise<{ code: number, info: string }>(
            (resolve, reject) =>
                exec(
                    `${process.platform.search('win') === -1 ? 'sudo ' : ''}docker push ccr.ccs.tencentyun.com/${imageRepo}:${imageTag}`,
                    (stderr, stdout) => stderr ? reject({ code: -1, info: stderr }) : resolve({ code: 0, info: stdout })
                ).stdout.pipe(process.stdout))

        try {
            let res = await sh
            if (res.code === -1) throw new CloudBaseError(res.info)
        } catch (e) {
            throw e
        }

        loading.succeed('上传成功')
    }
}