import os from 'os'
import crypto from 'crypto'
import { postFetch } from './net'

/**
 * 灯塔行为上报类
 * 由于没有外网可以使用的 SDK，当前直接调用 API 进行最简单的实现
 */
class BeaconAction {
    private deviceId: string
    private userAgent: string
    private additionalParams: { [key: string]: any } = {}

    /**
     * 构造函数
     */
    constructor() {
        this.deviceId = this.getDeviceId()
        this.userAgent = this.getUserAgent()
    }

    /**
     * 获取用户运行环境信息
     * 包含操作系统、Node版本和CLI版本等信息
     */
    private getUserAgent(): string {
        const osType = os.type() // 操作系统类型
        const osRelease = os.release() // 操作系统版本
        const nodeVersion = process.version // Node.js版本
        const arch = os.arch() // 系统架构

        // 从package.json获取CLI版本信息
        const cliVersion = require('../../package.json').version || 'unknown'

        return `Node/${nodeVersion} (${osType} ${osRelease}; ${arch}) CLI/${cliVersion}`
    }

    /**
     * 获取设备唯一标识
     * 基于主机名、CPU信息和MAC地址生成
     */
    private getDeviceId(): string {
        // 获取设备信息组合
        const deviceInfo = [
            os.hostname(),
            os
                .cpus()
                .map((cpu) => cpu.model)
                .join(','),
            Object.values(os.networkInterfaces())
                .reduce((acc, val) => acc.concat(val), [])
                .filter((nic) => nic && !nic.internal && nic.mac)
                .map((nic) => nic.mac)
                .join(',')
        ].join('|')

        // 生成SHA256哈希作为设备ID
        return crypto.createHash('sha256').update(deviceInfo).digest('hex').substring(0, 32) // 取前32位
    }

    /**
     * 上报事件
     * @param eventCode 事件代码
     * @param eventData 事件数据
     */
    async report(eventCode: string, eventData: { [key: string]: any } = {}) {
        const now = Date.now()

        return postFetch('https://otheve.beacon.qq.com/analytics/v2_upload', {
            appVersion: '',
            sdkId: 'js',
            sdkVersion: '4.5.14-web',
            mainAppKey: '0WEB0AD0GM4PUUU1',
            platformId: 3,
            common: {
                A2: this.deviceId, // 设备标识，用于标识用户身份
                A101: this.userAgent, // 运行环境信息
                from: 'tcb-cli',
                xDeployEnv: process.env.NODE_ENV,
                ...this.additionalParams
            },
            events: [
                {
                    eventCode,
                    eventTime: String(now),
                    mapValue: {
                        ...eventData
                    }
                }
            ]
        })
    }

    /**
     * 设置公共参数
     */
    addAdditionalParams(params: { [key: string]: any }) {
        this.additionalParams = {
            ...this.additionalParams,
            ...params
        }
    }
}

export const beaconAction = new BeaconAction()
