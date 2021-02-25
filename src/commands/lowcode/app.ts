import _ from 'lodash'
import fse from 'fs-extra'
import path from 'path'
// import lcf from '@cloudbase/lcf'
// import { LCFApp } from '@cloudbase/lcf-core'
import { Command, ICommand } from '../common'
import { startLocalCIServer } from '@cloudbase/lowcode-cli'
import { InjectParams, Log, Logger, CmdContext, ArgsOptions } from '../../decorators'
import { spawn } from 'child_process'
import { promisifyProcess } from './utils'

const WX_CLI = '/Applications/wechatwebdevtools.app/Contents/MacOS/cli'

// interface LCFAppPlus extends LCFApp {
//     compileToWeChatMpApp?: any
// }

@ICommand()
export class LowCodeWatch extends Command {
    get options() {
        return {
            cmd: 'lowcode',
            childCmd: 'watch',
            options: [
                {
                    flags: '--verbose',
                    desc: '是否打印详细日志'
                },
                {
                    flags: '--assets <assets>',
                    desc: '构建时额外引入的ASSETS'
                }
            ],
            desc: '开启云开发低码的本地构建模式',
            requiredEnvId: false
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @Log() log?: Logger) {
        await startLocalCIServer({
            watchPort: 8288
        })
    }
}

// @ICommand()
// export class LowCodePreview extends Command {
//     get options() {
//         return {
//             cmd: 'lowcode',
//             childCmd: 'preview',
//             options: [
//                 {
//                     flags: '--verbose',
//                     desc: '是否打印详细日志'
//                 },
//                 {
//                     flags: '--cals-path <calsPath>',
//                     desc: 'cals路径'
//                 }
//             ],
//             desc: '云开发低码的本地预览模式',
//             requiredEnvId: false
//         }
//     }

//     @InjectParams()
//     async execute(@ArgsOptions() options , @Log() log?: Logger) {
//         const { calsPath = 'cals.json', projectPath = process.cwd() } = options

//         // read input
//         const calsJson = fse.readJSONSync(path.resolve(projectPath, calsPath))
//         console.log('cals', calsJson)

//         // input to code
//         const metaJson = fse.readJSONSync(path.resolve(projectPath, 'data/gsd-meta.json'))
//         const app: LCFAppPlus = lcf.init(null,{
//             compatibleMode: true,
//             componentsLibs: [{
//                 name: 'gsd-h5-react',
//                 type: 'local',
//                 referenceRule: '$module/component/$component/index',
//                 preComipleMeta: metaJson
//             },{
//                 name: 'CLOUDBASE_STANDARD',
//                 type: 'local',
//                 referenceRule: '$module/$component/index'
//             }],
//             materialLibs: [{
//                 name: 'gsd-h5-react',
//                 type: 'local',
//                 referenceRule: '$module/actions/$feature/index',
//                 exportType: 'default'
//             }]
//         })

//         app.updateSource(calsJson)
//         const result = await app.compileToWeChatMpApp()
//         console.log({result})

//         result?.files?.forEach(file => {
//             const path2 = path.join(projectPath, file.path)
//             fse.ensureFileSync(path2)
//             fse.writeFileSync(path2, file.content)
//         })

//         // wx preview
//         log.success('低码应用 - 成功连接微信IDE\n')
//         log.info(projectPath)
//         const previewProcess = spawn(WX_CLI, [
//             'preview',
//             '--project',
//             projectPath
//         ], {
//             cwd: projectPath,
//             env: process.env,
//             stdio: ['inherit', 'pipe', 'pipe'],
//         })
//         await promisifyProcess(previewProcess, true)

//         // log.success('低码应用 - 成功生成预览二维码')
//     }
// }