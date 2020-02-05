import { postFetch } from '../http-request'
import { getMacAddressMd5, getOSInfo } from '../platform'
import { getUin } from '../store'

const url = 'https://tcli.service.tcloudbase.com/usage'

export async function collectUsage(command: string) {
    const uin = await getUin()
    const macMd5 = await getMacAddressMd5()
    const os = await getOSInfo()
    const data = {
        command,
        macMd5,
        uin,
        os
    }

    return postFetch(url, data)
}
