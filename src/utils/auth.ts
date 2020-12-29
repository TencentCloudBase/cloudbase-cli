import { AuthSupevisor } from '@cloudbase/toolbox'
import { getProxy } from './tools'
import { REQUEST_TIMEOUT } from '../constant'

export const authSupevisor = AuthSupevisor.getInstance({
    cache: true,
    proxy: getProxy(),
    timeout: REQUEST_TIMEOUT
})

export async function getLoginState() {
    return authSupevisor.getLoginState()
}
