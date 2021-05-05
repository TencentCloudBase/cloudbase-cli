import { exec } from 'child_process'
import * as util from 'util'
import { prompt } from 'enquirer'
import { Command, ICommand } from '../../common'
import { CloudBaseError } from '../../../error'
import { listImage, describeImageRepo } from '../../../run'
import { loadingFactory, pagingSelectPromp, getUin } from '../../../utils'
import { InjectParams, EnvId, ArgsOptions } from '../../../decorators'
import { imageCommonOptions } from './common'
import { cloneDeep } from 'lodash'

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

        const uin = await getUin()

        if (uin === '无')
            throw new CloudBaseError('请确认是否登录cloudbase')

        const { pw } = await prompt<any>({
            type: 'password',
            message: '请输入镜像仓库密码',
            name: 'pw'
        })

        const imageRepo = await describeImageRepo({ envId, serverName: serviceName })

        const { imageId } = await prompt<any>({
            type: 'input',
            message: '请输入上传镜像id（ImageId）',
            name: 'imageId'
        })

        const { tag } = await prompt<any>({
            type: 'input',
            message: '请输入镜像tag',
            name: 'tag'
        })


        loading.start('登陆中')
        let { stdout, stderr } = await util.promisify(exec)(`${process.platform.search('win') === -1 ? 'sudo ' : ''}docker login --username=${uin} ccr.ccs.tencentyun.com -p ${pw}`);
        if (stdout.search('Login Succeeded') === -1) throw new CloudBaseError(stderr)
        loading.succeed('登录成功')

        if (stderr = (await util.promisify(exec)(`${process.platform.search('win') === -1 ? 'sudo ' : ''}docker tag ${imageId} ccr.ccs.tencentyun.com/tcb-100017846734-ljoc/hello-tcb-9glo12vd5bd3bd0d_dartapp:${tag}`)).stderr)
            throw new CloudBaseError(stdout)

        loading.start('正在上传中')
        let sh = new Promise<{ code: number, info: string }>(
            (resolve, reject) =>
                exec(
                    `${process.platform.search('win') === -1 ? 'sudo ' : ''}docker push ccr.ccs.tencentyun.com/${imageRepo}:${tag}`,
                    (err, stdout) => err ? reject({ code: -1, info: err }) : resolve({ code: 0, info: stdout })
                ).stdout.pipe(process.stdout))

        let res = await sh
        if (res.code === -1) throw new CloudBaseError(res.info)
        loading.succeed('上传成功')
    }
}