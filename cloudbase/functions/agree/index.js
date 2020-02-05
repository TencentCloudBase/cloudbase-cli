const tcb = require('@cloudbase/node-sdk')

const app = tcb.init({
    env: 'tcli'
})

class DataSchema {
    constructor(data) {
        this.ip = data.ip || ''
        this.agree = data.agree || false
        this.macMd5 = data.macMd5 || ''
        this.uin = data.uin || ''
        this.os = data.os || ''
        this.date = new Date()
    }
}

exports.main = async (event = {}) => {
    const { headers = {}, body } = event
    const ip = headers['x-real-ip'] || ''

    const bodyData = JSON.parse(body)
    const data = new DataSchema({
        ...bodyData,
        ip
    })

    const db = app.database()
    const collection = db.collection('user-agree')
    return collection.add(data)
}
