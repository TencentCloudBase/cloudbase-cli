import { postFetch } from '../net'
import { getMacAddressMd5, getOSInfo } from '../platform'
import { getUin } from '../store'

const url = 'https://tcli.service.tcloudbase.com/download'

export async function templateDownloadReport(templateId: string, templateName: string) {
    const uin = await getUin()
    const os = await getOSInfo()
    const macMd5 = await getMacAddressMd5()

    const data = {
        os,
        uin,
        macMd5,
        templateId,
        templateName,
        version: process.CLI_VERSION
    }

    try {
        await postFetch(url, data)
    } catch (e) {
        // ignore error
    }
}
