import { exec } from 'child_process'
import * as util from 'util'
import { prompt } from 'enquirer'
import { Command, ICommand } from '../../common'
import { CloudBaseError } from '../../../error'
import { listImage } from '../../../run'
import { loadingFactory, pagingSelectPromp, getUin } from '../../../utils'
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
            ],
            desc: '删除云开发环境下云托管服务的版本'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsOptions() options) {

        let { serviceName = '' } = options

        if (serviceName.length === 0) {
            throw new CloudBaseError('必须输入 serviceName')
        }

        const loading = loadingFactory()

        console.log('操作会自动执行docker login')

        // loading.start('数据加载中...')

        let imageUrl = await pagingSelectPromp(
            'select',
            listImage,
            { envId, serviceName, limit: 0, offset: 0 },
            '请选择下载的镜像',
            _ => true,
            item => item.ImageUrl)

        const uin = await getUin()

        if (uin === '无')
            throw new CloudBaseError('请确认是否登录cloudbase')

        const { pw } = await prompt<any>({
            type: 'password',
            message: '请输入镜像仓库密码',
            name: 'pw'
        })

        loading.start('登陆中')
        let { stdout, stderr } = await util.promisify(exec)(`${process.platform.search('win') === -1 ? 'sudo ' : ''}docker login --username=${uin} ccr.ccs.tencentyun.com -p ${pw}`);
        if (stdout.search('Login Succeeded') === -1) throw new CloudBaseError(stderr)
        loading.succeed('登录成功')

        loading.start('正在拉取中')
        let sh = new Promise<{ code: number, info: string }>(
            (resolve, reject) =>
                exec(
                    `${process.platform.search('win') === -1 ? 'sudo ' : ''}docker pull ${imageUrl}`,
                    (err, stdout) => err ? reject({ code: -1, info: err }) : resolve({ code: 0, info: stdout })
                ).stdout.pipe(process.stdout));

        let res = await sh
        if (res.code === -1) throw new CloudBaseError(res.info)
        loading.succeed('拉取成功')
    }
}