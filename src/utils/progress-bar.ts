import ProgressBar from 'progress'

// 打印文件传输进度条
export function createUploadProgressBar(onFinished: Function, onStart?: Function) {
    let bar
    let lastLoaded = 0
    let finished = false

    return function (data) {
        const { total, loaded, percent } = data
        if (lastLoaded === 0 && onStart) {
            onStart()
        }

        if (+percent === 1) {
            if (finished) return
            finished = true
            setTimeout(() => {
                onFinished()
            }, 500)
            bar.tick(total - lastLoaded)
            return
        }
        const tick = loaded - lastLoaded
        lastLoaded = loaded
        if (bar) {
            bar.tick(tick)
        } else {
            bar = new ProgressBar('文件传输中 [:bar] :percent :etas', {
                total,
                complete: '=',
                incomplete: ' ',
                width: 50
            })
            bar.tick(tick)
        }
    }
}
