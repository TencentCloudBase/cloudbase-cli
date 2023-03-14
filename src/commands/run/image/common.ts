export const imageCommonOptions = (sub: string) => ({
    cmd: 'run:deprecated',
    childCmd: {
        cmd: 'image',
        desc: '云托管镜像管理'
    },
    childSubCmd: sub
})
