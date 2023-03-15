export const versionCommonOptions = (sub: string) => ({
    cmd: 'run:deprecated',
    childCmd: {
        cmd: 'version',
        desc: '云托管版本管理'
    },
    childSubCmd: sub
})
