import os from 'os'

const macOSMap = new Map([
    [19, 'Catalina'],
    [18, 'Mojave'],
    [17, 'High Sierra'],
    [16, 'Sierra'],
    [15, 'El Capitan'],
    [14, 'Yosemite'],
    [13, 'Mavericks'],
    [12, 'Mountain Lion'],
    [11, 'Lion'],
    [10, 'Snow Leopard'],
    [9, 'Leopard'],
    [8, 'Tiger'],
    [7, 'Panther'],
    [6, 'Jaguar'],
    [5, 'Puma']
])

const winMap = new Map([
    ['10.0', '10'],
    ['6.3', '8.1'],
    ['6.2', '8'],
    ['6.1', '7'],
    ['6.0', 'Vista'],
    ['5.2', 'Server 2003'],
    ['5.1', 'XP'],
    ['5.0', '2000'],
    ['4.9', 'ME'],
    ['4.1', '98'],
    ['4.0', '95']
])

export function getPlatformRelease(platform: string, release: string) {
    // macOS
    if (platform === 'darwin') {
        const releaseNum = Number(release.split('.')[0])
        const name = macOSMap.get(releaseNum)
        const version = '10.' + (releaseNum - 4)
        return `${name} ${version}`
    }

    // windows
    if (platform === 'win32') {
        const version = (/\d+\.\d/.exec(release) || [])[0]

        return `Windows ${winMap.get(version)}`
    }

    // 其他 Linux
    return 'Linux'
}

// 获取 hostname 和平台信息
export function getOSInfo() {
    const hostname = os.hostname()
    const platform = os.platform()
    const release = os.release()

    const platformRelease = getPlatformRelease(platform, release)

    return [hostname, platformRelease].join('/')
}
