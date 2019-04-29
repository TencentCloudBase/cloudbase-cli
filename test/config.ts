import { INodeDeployConfig } from './../src/deploy/node'
import { IFunctionDeployConfig } from './../src/deploy/function'

const secretId: string = 'secretId'
const secretKey: string = 'secretKey'
const characters: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

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
    host: 'host',
    username: 'username',
    port: 3000,
    password: 'password',
    secretId,
    secretKey,
    name: 'name',
    path: 'test',
    distPath: `${randomStr()}jest-dist`,
    remotePath: 'string'
}

export const iFunctionDeployConfig: IFunctionDeployConfig = {
    secretId,
    secretKey,
    name: 'test',
    path: './test',
    envId: 'envId',
    distPath: `${randomStr()}jest-dist`,
    override: true
}