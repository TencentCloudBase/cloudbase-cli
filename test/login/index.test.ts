import { login } from '../../src/auth'

test('登录：cloudbase login', async () => {
    const res = await login({
        getAuthUrl: url => {
            console.log(url)
            return url
        }
    })
    expect(res.code).toEqual('SUCCESS')
})
