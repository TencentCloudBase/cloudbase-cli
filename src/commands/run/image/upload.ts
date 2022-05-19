import { exec } from 'child_process'
import * as util from 'util'
import { prompt } from 'enquirer'
import { Command, ICommand } from '../../common'
import { CloudBaseError } from '../../../error'
import { describeImageRepo, getAuthFlag } from '../../../run'
import { loadingFactory, getUin, checkTcbrEnv, logEnvCheck } from '../../../utils'
import { InjectParams, EnvId, ArgsOptions } from '../../../decorators'
import { imageCommonOptions } from './common'
import { EnumEnvCheck } from '../../../types'

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

        let envCheckType = await checkTcbrEnv(options.envId, false)
        if(envCheckType !== EnumEnvCheck.EnvFit) {
            logEnvCheck(envId, envCheckType)
            return
        }
        
        const { serviceName = '', imageId = '', imageTag = '' } = options

        if (serviceName.length === 0 || imageId.length === 0 || imageTag.length === 0) {
            throw new CloudBaseError('必须输入 serviceName 和 imageId 和 imageTag')
        }

        const loading = loadingFactory()

        if (!(await getAuthFlag())) {
            throw new CloudBaseError('无法找到~/.docker/config.json或未登录，需要执行docker login')
        }

        const imageRepo = await describeImageRepo({ envId, serverName: serviceName })

        await util.promisify(exec)(`docker tag ${imageId} ccr.ccs.tencentyun.com/${imageRepo}:${imageTag}`)

        let sh = new Promise<{ code: number, info: string }>(
            (resolve, reject) => {
                exec(
                    `docker push ccr.ccs.tencentyun.com/${imageRepo}:${imageTag}`,
                    (stderr, stdout) => stderr ? reject(stderr) : resolve({ code: 0, info: stdout })
                ).stdout.pipe(process.stdout)
            })

        await sh

        loading.succeed('上传成功')
    }
}