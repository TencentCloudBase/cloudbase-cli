import { postFetch } from '../http-request'
import { commonStore } from '../store'

const url = 'https://tcli.service.tcloudbase.com/notify'

// 获取通知，最多每天获取一次
const ONE_DAY = 86400000

export async function getNotification() {
    const now = Date.now()
    // 上次记录的时间
    const lastTime = await commonStore.get('lastNotifyTime')
    const diff = now - Number(lastTime)
    const day = new Date(lastTime).getDay()
    const today = new Date().getDay()
    // 日期不同，且时差小于 1 天
    if (day === today && diff < ONE_DAY) return null
    const lastUid = await commonStore.get('lastNotificationUid')
    const data = await postFetch(url)
    const uid = data?.uid || 0
    // 消息已读
    if (Number(lastUid) >= Number(uid)) return
    await commonStore.set('readNotificationUid', data.uid)
    await commonStore.set('lastNotifyTime', Date.now())
    return data
}
