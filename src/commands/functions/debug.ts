import path from 'path'
import { execFile } from 'child_process'
// import inquirer from 'inquirer'
// import { FunctionContext } from '../../types'
// import { CloudBaseError } from '../../error'
// import { successLog } from '../../logger'
// export async function deleteFunc(ctx: FunctionContext) {
//     const { name, envId, functions } = ctx
// }
const bootstrapFilePath = path.join(
    __dirname,
    '../../utils/runtime/nodejs/bootstrap.js'
)

execFile(
    'node',
    [bootstrapFilePath],
    {
        cwd: path.dirname(bootstrapFilePath),
        maxBuffer: 1024 * 1024,
        timeout: 20,
        env: {
            ...process.env,
            SCF_FUNCTION_HANDLER: 'index:main',
            SCF_FUNCTION_NAME: 'main',
            GLOBAL_USER_FILE_PATH:
                '/Users/hengechang/Desktop/cloudbase-demo/functions/test/'
        }
    },
    (error, stdout, stderr) => {
        if (error) {
            console.log(error)
        }
        console.log(stdout)
        console.log(stderr)
    }
)
