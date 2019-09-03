import { login } from '../../src/auth'

test('登录：cloudbase login', async () => {
    const res = await login()
    expect(res.code).toEqual('SUCCESS')
})
