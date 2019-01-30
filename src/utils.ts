import * as archiver from 'archiver'
import * as fs from 'fs'
export async function zipDir(dirPath, outputPath) {
    console.log(dirPath, outputPath)
    return new Promise((resolve, reject) => {
        var output = fs.createWriteStream(outputPath);
        var archive = archiver('zip');

        output.on('close', function () {
            // console.log(archive.pointer() + ' total bytes');
            // console.log('archiver has been finalized and the output file descriptor has closed.');
            resolve({
                zipPath: outputPath,
                size: Math.ceil(archive.pointer() / 1024)
            })
        });

        archive.on('error', function (err) {
            reject(err)
        });

        archive.pipe(output);
        archive.directory(dirPath, '');
        archive.finalize();
    })
}