import { Command } from '../command'
import { upload, download, deleteFile, list, getUrl, detail, getAcl, setAcl } from './storage'

const commands = [
    {
        cmd: 'storage:upload <localPath> [cloudPath]',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '上传文件/文件夹',
        handler: upload
    },
    {
        cmd: 'storage:download <cloudPath> <localPath>',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '-d, --dir',
                desc: '下载目标是否为文件夹'
            }
        ],
        desc: '下载文件/文件夹，文件夹需指定 --dir 选项',
        handler: download
    },
    {
        cmd: 'storage:delete <cloudPath>',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '-d, --dir',
                desc: '下载目标是否为文件夹'
            }
        ],
        desc: '删除文件/文件夹，文件夹需指定 --dir 选项',
        handler: deleteFile
    },
    {
        cmd: 'storage:list [cloudPath]',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
            // {
            //     flags: '-m, --max',
            //     desc: '传输数据的最大条数'
            // },
            // {
            //     flags: '--markder',
            //     desc: '起始路径名，后（不含）按照 UTF-8 字典序返回条目'
            // }
        ],
        desc: '获取文件存储的文件列表，不指定路径时获取全部文件列表',
        handler: list
    },
    {
        cmd: 'storage:url <cloudPath>',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '获取文件临时访问地址',
        handler: getUrl
    },
    {
        cmd: 'storage:detail <cloudPath>',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '获取文件信息',
        handler: detail
    },
    {
        cmd: 'storage:get-acl',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '获取文件存储权限信息',
        handler: getAcl
    },
    {
        cmd: 'storage:set-acl',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '设置文件存储权限信息',
        handler: setAcl
    }
]

commands.forEach(item => {
    const command = new Command(item)
    command.init()
})
