import _ from 'lodash'
import { AuthSupevisor } from '@cloudbase/toolbox'
import { getProxy } from './net'
import { REQUEST_TIMEOUT } from '../constant'

export const authSupevisor = AuthSupevisor.getInstance({
    cache: true,
    proxy: getProxy(),
    timeout: REQUEST_TIMEOUT,
    throwError: true
})

export async function getLoginState() {
    return authSupevisor.getLoginState()
}
