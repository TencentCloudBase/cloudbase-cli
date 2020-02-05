import tabtab from 'tabtab'
import { CloudBaseError } from '../../error'

export async function installCompletion() {
    try {
        await tabtab.install({
            name: 'tcb',
            completer: 'tcb'
        })
    } catch (e) {
        throw new CloudBaseError('安装失败！')
    }
}

export async function unInstallCompletion() {
    try {
        await tabtab.uninstall({
            name: 'tcb',
            completer: 'tcb'
        })
    } catch (e) {
        throw new CloudBaseError('卸载失败！')
    }
}
