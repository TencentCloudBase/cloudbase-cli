import FunctionBuilder from '../builder/function'
import NodeZipBuilder from '../builder/node-zip'
import { INodeDeployConfig } from './node'
import { IFunctionDeployConfig } from './function'

export default class Deploy {
    _config: INodeDeployConfig | IFunctionDeployConfig
    builder: FunctionBuilder | NodeZipBuilder
    uploader: { upload(): Promise<any> }
    controller: any
    constructor(config) {
        this._config = config
    }
    async deploy() {

    }
}