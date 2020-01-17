const tcb = require('@cloudbase/node-sdk')

const app = tcb.init({
    env: 'tcli'
})

exports.main = async event => {
    const db = app.database()
    const collection = db.collection('cli-config')
    return collection.add({
        name: 'test'
    })
}
