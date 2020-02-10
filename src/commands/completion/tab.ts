import omelette from 'omelette'
import { CloudBaseError } from '../../error'
import { successLog } from '../../logger'

const completion = omelette('cloudbase|tcb <action>')

export async function installCompletion() {
    try {
        process.on('exit', () => {
             successLog('安装完成，重启终端后生效！')
        })
        // setupShellInitFile 会自动调用 process.exit
        completion.setupShellInitFile()
    } catch (e) {
        throw new CloudBaseError('安装失败！')
    }
}

export async function unInstallCompletion() {
    try {
        process.on('exit', () => {
            successLog('卸载完成，重启终端后生效！')
        })
        // cleanupShellInitFile 会自动调用 process.exit
        completion.cleanupShellInitFile()
    } catch (e) {
        throw new CloudBaseError('卸载失败！')
    }
}
