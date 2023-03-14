import * as storage from '../../src/storage'

test('文件：cloudbase storage.uploadFile', async () => {
    const res = await storage.uploadFile({
        envId: 'izero-a92521',
        cloudPath: 'test.md',
        localPath: './test/files/test.md'
    })
    expect(res).toBeUndefined()
})

test('文件：cloudbase storage.uploadDirectory', async () => {
    const res = await storage.uploadDirectory({
        envId: 'izero-a92521',
        cloudPath: 'env',
        localPath: './test/env'
    })
    expect(res).toBeUndefined()
})

test('文件：cloudbase storage.downLoadFile', async () => {
    const res = await storage.downloadFile({
        envId: 'izero-a92521',
        cloudPath: 'test.md',
        localPath: './test/files/d.md'
    })
    expect(res).toBeUndefined()
})

test('文件：cloudbase storage.downloadDirectory', async () => {
    const res = await storage.downloadDirectory({
        envId: 'izero-a92521',
        cloudPath: 'env',
        localPath: './test/files'
    })
    expect(res).toBeUndefined()
})

test('文件：cloudbase storage.getUrl', async () => {
    const res = await storage.getUrl({
        envId: 'izero-a92521',
        cloudPaths: ['test.md']
    })
    expect(res.length).toBeGreaterThan(0)
})

test('文件：cloudbase storage.deleteFile', async () => {
    const res = await storage.deleteFile({
        envId: 'izero-a92521',
        cloudPath: 'test.md'
    })
    expect(res).toBeUndefined()
})

test('文件：cloudbase storage.deleteDirectory', async () => {
    const res = await storage.deleteDirectory({
        envId: 'izero-a92521',
        cloudPath: 'env'
    })
    expect(res).toBeUndefined()
})

test('文件：cloudbase storage.list', async () => {
    const res = await storage.list({
        envId: 'izero-a92521',
        cloudPath: 'test_dir'
    })
    expect(res.length).toBeGreaterThanOrEqual(0)
})

test('文件：cloudbase storage.getAcl', async () => {
    const res = await storage.getAcl({
        envId: 'izero-a92521'
    })
    expect(res).toBeTruthy()
})

test('文件：cloudbase storage.setAcl', async () => {
    const res = await storage.setAcl({
        envId: 'izero-a92521',
        acl: 'READONLY'
    })
    expect(res.RequestId).toBeTruthy()
})
