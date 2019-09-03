import { listEnvs, createEnv } from '../../src/env'

test('列出所有环境：cloudbase env:list', async () => {
    const data = await listEnvs()

    expect(data.length).toBeGreaterThanOrEqual(1)
})

test('创建环境：cloudbase env:create', async () => {
    await createEnv({
        alias: 'scf'
    })
})
