import { CloudBaseError } from '@cloudbase/toolbox'
import { ChildProcess } from 'child_process'

export function promisifyProcess(p: ChildProcess, pipe = false) {
  return new Promise((resolve, reject) => {
      let stdout = ''
      let stderr = ''

      p.stdout.on('data', (data => {
          stdout +=String(data)
      }))
      p.stderr.on('data', (data => {
          stderr += String(data)
      }))
      p.on('error', reject)
      p.on('exit', exitCode => {
          exitCode === 0 ? resolve(stdout) : reject(new CloudBaseError(stderr || String(exitCode)))
      })

      if (pipe) {
        p.stdout.pipe(process.stdout)
        p.stderr.pipe(process.stderr)
      }
  })
}