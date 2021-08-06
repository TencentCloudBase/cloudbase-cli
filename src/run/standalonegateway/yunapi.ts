import { CloudApiService } from '../../utils'

const tcbService = CloudApiService.getInstance('tcb')

export default function request(action, ...args) {
    return tcbService.request(action, ...args)
}
