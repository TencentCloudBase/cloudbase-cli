import { LocalStore } from './db'

const DB_KEY = 'usage'

export const usageStore = new LocalStore(
    {
        // 是否同意收集使用数据
        agreeCollect: false,
        commands: []
    },
    DB_KEY
)
