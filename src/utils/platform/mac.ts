import address from 'address'
import { md5 } from '../tools'

// 获取本机 Mac 地址
export function getMacAddress(): Promise<string> {
    return new Promise(resolve => {
        address.mac((err, mac) => {
            if (err) {
                resolve('')
                return
            }
            resolve(mac)
        })
    })
}

export async function getMacAddressMd5(): Promise<string> {
    const mac = await getMacAddress()
    const macMD5 = md5(mac)
    return macMD5
}
