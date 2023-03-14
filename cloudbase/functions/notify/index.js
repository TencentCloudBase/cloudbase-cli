const tcb = require('@cloudbase/node-sdk')

const app = tcb.init({
    env: 'tcli'
})

exports.main = async () => {
    const db = app.database()
    const collection = db.collection('notification')
    // 获取第一条数据
    const res = await collection
        .orderBy('uid', 'desc')
        .limit(1)
        .get()
    const data = res.data[0]
    return data
}
