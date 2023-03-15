import _ from 'lodash'
import { checkAndGetCredential as _getCredentail } from '@cloudbase/toolbox'
import { CloudBaseError } from '../../error'
import { REQUEST_TIMEOUT } from '../../constant'
import { Credential, AuthSecret } from '../../types'

import { md5 } from '../tools'
import { getMacAddress } from '../platform'
import { getProxy } from './proxy'
import { fetch } from './http-request'


const refreshTokenUrl = 'https://iaas.cloud.tencent.com/tcb_refresh'

// 临时密钥过期后，进行续期
export async function refreshTmpToken(
    metaData: Credential & { isLogout?: boolean }
): Promise<Credential> {
    const mac = await getMacAddress()
    const hash = md5(mac)
    metaData.hash = hash

    const res = await fetch(refreshTokenUrl, {
        method: 'POST',
        body: JSON.stringify(metaData),
        headers: { 'Content-Type': 'application/json' }
    })

    if (res.code !== 0) {
        throw new CloudBaseError(res.message, {
            code: res.code
        })
    }

    const { data: credential } = res
    return credential
}

export async function checkAndGetCredential(throwError = false): Promise<AuthSecret> {
    const credential = await _getCredentail({
        proxy: getProxy(),
        timeout: REQUEST_TIMEOUT
    })

    if (!credential || _.isEmpty(credential)) {
        if (throwError) {
            throw new CloudBaseError('无有效身份信息，请使用 cloudbase login 登录')
        }
        return null
    }

    return credential
}
