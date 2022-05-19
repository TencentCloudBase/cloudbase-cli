import chalk from "chalk"
import { CloudBaseError } from "../error"
import { CloudApiService } from "./net"
import { EnumEnvCheck } from "../types"
const tcbService = CloudApiService.getInstance('tcb')

const oldCmdSet =
    `
服务列表：tcb run:deprecated list --envId <envId>
创建服务：tcb run:deprecated create --envId <envId> --name <name>
删除服务：tcb run:deprecated delete --envId <envId> --serviceName <serviceName>

版本列表：tcb run:deprecated version list --envId <envId> --serviceName <serviceName>
创建版本：tcb run:deprecated version create --envId <envId> --serviceName <serviceName>
分配流量：tcb run:deprecated version modify --envId <envId> --serviceName <serviceName>
滚动更新：tcb run:deprecated version update --envId <envId> --serviceName <serviceName> --versionName <versionName>
删除版本：tcb run:deprecated version delete --envId <envId> --serviceName <serviceName> --versionName <versionName>

查看镜像：tcb run:deprecated image list --envId <envId> --serviceName <serviceName>
上传镜像：tcb run:deprecated image upload --envId <envId> --serviceName <serviceName> --imageId <imageId> --imageTag <imageTag>
下载镜像：tcb run:deprecated image download --envId <envId> --serviceName <serviceName> --imageTag <imageTag>
删除镜像：tcb run:deprecated image delete --envId <envId> --serviceName <serviceName> --imageTag <imageTag>
`
const newCmdSet =
    `
查看环境下服务：tcb run service:list --envId <envId>
创建云托管服务：tcb run service:create --envId <envId> --serviceName <serviceName> --containerPort <containerPort>
更新云托管服务：tcb run service:update --envId <envId> --serviceName <serviceName> --containerPort <containerPort>
部署云托管服务：tcb run deploy --envId <envId> --serviceName <serviceName> --containerPort <containerPort>
更新服务基础配置：tcb run service:config --envId <envId> --serviceName <serviceName>
`
/**
 * 
 * @param envId 环境 Id
 * @param isTcbr 使用的命令是否是 tcbr 新操作集
 * @returns 
 */
export async function checkTcbrEnv(envId: string | undefined, isTcbr: boolean): Promise<EnumEnvCheck> | never {
    if(envId === void 0) {
        throw new CloudBaseError('请使用 -e 或 --envId 指定环境 ID')
    }
    const { EnvList: [envInfo] } = await tcbService.request('DescribeEnvs', {
        EnvId: envId
    })

    if(envInfo === void 0) {
        throw new CloudBaseError('无法读取到有效的环境信息，请检查环境 ID 是否正确')
    }

    if ((envInfo.EnvType === 'tcbr' && isTcbr) || (envInfo.EnvType !== 'tcbr' && !isTcbr)) {
        return EnumEnvCheck.EnvFit
    } else if (envInfo.EnvType === 'tcbr' && !isTcbr) {
        return EnumEnvCheck.EnvNewCmdOld
    } else if (envInfo.EnvType !== 'tcbr' && isTcbr) {
        return EnumEnvCheck.EnvOldCmdNew
    }
}

export function logEnvCheck(envId: string, warningType: EnumEnvCheck) {
    if(warningType === EnumEnvCheck.EnvNewCmdOld) {
        // 当前环境是 tcbr 环境且使用的不是 tcbr 新操作集
        throw new CloudBaseError(`当前能力不支持 ${envId} 环境，请使用如下操作集：${chalk.grey(newCmdSet)}`)
    } else if (warningType === EnumEnvCheck.EnvOldCmdNew) {
        // 当前环境不是 tcbr 环境但使用 tcbr 操作集
        throw new CloudBaseError(`当前能力不支持 ${envId} 环境，请使用如下操作集：${chalk.grey(oldCmdSet)}`)
    }
}