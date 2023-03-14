import { access, constants, readFileSync } from 'fs'
import { join } from 'path'
import { CloudBaseError } from '../../error'

// 查看本地是否已经登录腾讯云docker仓库
export const getAuthFlag = async () => {
    const USER_HOME = process.env.HOME || process.env.USERPROFILE

    try {
        await (new Promise(
            (resolve, reject) => {
                access(
                    join(USER_HOME, '.docker/config.json'),
                    constants.F_OK,
                    err => err ? reject(err) : resolve(true))
            }))
    } catch (e) {
        return false
    }


    const data = JSON.parse(readFileSync(join(USER_HOME, '.docker/config.json')).toString())

    console.log()

    return Boolean(data['auths']['ccr.ccs.tencentyun.com'])
}