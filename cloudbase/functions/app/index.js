const tcb = require('@cloudbase/node-sdk')

const app = tcb.init({
    env: 'tcli'
})

exports.main = async () => {
    const db = app.database()
    const collection = db.collection('notification')
    return collection
        .orderBy('uid', 'asc')
        .limit(1)
        .get()
}
