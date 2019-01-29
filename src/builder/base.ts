import { INodeBuilderOptions  } from './node'
import { INodeZipBuilderOptions } from './node-zip'
export default class Builder {
    readonly _options: INodeBuilderOptions | INodeZipBuilderOptions
    constructor(options) {
        this._options = options
    }

    async build(): Promise<IBuildResult> {
        throw new Error('Builder.build() is not implemented.')
    }

    watch() {
        throw new Error('Builder.watch() is not implemented.')
    }

    log() {

    }
}



export interface IBuildResult {
    success: Boolean,
    assets: Array<string>
}
