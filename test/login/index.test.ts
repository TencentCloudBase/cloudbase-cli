import { login } from '../../src/auth'

test('登录：cloudbase login', async () => {
    const res = await login({
        authUrl: 'https://google.com'
    })
    expect(res.code).toEqual('SUCCESS')
})