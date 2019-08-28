const Client = require('../../lib')

const client = new Client()
const { login } = client

test('登录：tcb login', async () => {
    const res = await login()
    expect(res.code).toEqual('SUCCESS')
})