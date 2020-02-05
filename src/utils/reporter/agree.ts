import { postFetch } from '../http-request'
import { getMacAddressMd5, getOSInfo } from '../platform'
import { getUin } from '../store'

const url = 'https://tcli.service.tcloudbase.com/agree-collect'

export async function collectAgree(agree) {
    const uin = await getUin()
    const macMd5 = await getMacAddressMd5()
    const os = await getOSInfo()
    const data = {
        macMd5,
        agree,
        uin,
        os
    }

    return postFetch(url, data)
}

