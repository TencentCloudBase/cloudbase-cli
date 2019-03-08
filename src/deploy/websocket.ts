import WebsocketBuilder from '../builder/websocket'
import NodeZipUploader from '../uploader/node-zip'
import NodeController from '../controller/node'
import Deploy from './base'
import * as path from 'path'
import * as del from 'del'

export default class NodeDeploy extends Deploy {
    _config: IWebsocketDepolyConfig
    constructor(config: IWebsocketDepolyConfig) {
        config = {
            username: 'root',
            port: 22,
            distPath: './.tcb-dist',
            remotePath: `/data/tcb-service/${config.name}`,
            path: './',
            ...config
        }
        super(config)
        this.builder = new WebsocketBuilder(config)
        this.uploader = new NodeZipUploader(config)
        this.controller = new NodeController(config)
    }

    async deploy(start = false) {
        await this.builder.clean()
        await this.builder.build()
        await this.uploader.upload()
        await this.controller.npmInstall()
        if (start) {
            await this.controller.start({ isSingle: true })
        } else {
            await this.controller.reload({ isSingle: true })
        }
        await this.builder.clean()
    }
}

export interface IWebsocketDepolyConfig {
    name: string

    host: string
    username: string
    port: number
    password: string

    secretId: string
    secretKey: string

    entry: string,

    path: string,
    distPath: string
    remotePath: string
}