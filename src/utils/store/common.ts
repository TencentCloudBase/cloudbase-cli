import { LocalStore } from './db'

export const commonStore = new LocalStore({
    // 已读最新消息的 uid
    lastNotificationUid: 1,
    // 上次通知时间
    lastNotifyTime: 0
})
