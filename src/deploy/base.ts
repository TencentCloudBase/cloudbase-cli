import { IBuildResult } from '../builder/base'
import FunctionBuilder from '../builder/function'
import WebsocketBuilder from '../builder/websocket'
import NodeZipBuilder from '../builder/node-zip'
import { INodeDeployConfig } from './node'
import { IFunctionDeployConfig } from './function'
import { IWebsocketDepolyConfig } from './websocket'

export default class Deploy {
    _config: INodeDeployConfig | IFunctionDeployConfig | IWebsocketDepolyConfig
    builder: FunctionBuilder | NodeZipBuilder | WebsocketBuilder
    uploader: { upload(): Promise<any> }
    controller: any
    constructor(config) {
        this._config = config
    }
    async deploy() {

    }
}