import { INodeDeployConfig } from '../src/deploy/node'
import { IFunctionDeployConfig } from '../src/deploy/function'
import config from './config'

const {
    host,
    username,
    password,
    secretId,
    secretKey,
    port
} = config
const characters: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

interface INodeUploaderOptions {
    host: string
    username: string
    port: number
    password: string
    distPath: string
    remotePath: string
}

function randomStr(bits: number = 32): string {
    const length: number = characters.length
    let str: string = ''
    for(let i = 0; i < bits; ++i) {
        let pos: number = Math.round(Math.random() * (length - 1))
        str += characters[pos]
    }

    return str
}

export const iNodeDeployConfig: INodeDeployConfig = {
    host,
    username,
    port,
    password,
    secretId,
    secretKey,
    name: 'name',
    path: 'test',
    distPath: `${randomStr()}jest-dist`,
    remotePath: `/tmp/${randomStr()}jest-dist`
}

export const iFunctionDeployConfig: IFunctionDeployConfig = {
    secretId,
    secretKey,
    name: 'test',
    path: './test',
    envId: 'default',
    distPath: `${randomStr()}jest-dist`,
    override: true
}

export const iNodeUploaderOptions: INodeUploaderOptions = {
    host,
    username,
    password,
    port,
    distPath: `${randomStr()}jest-dist`,
    remotePath: `/tmp/${randomStr()}jest-dist`
}
