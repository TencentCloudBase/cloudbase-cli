export const layerCommonOptions = (sub: string) => ({
    cmd: 'fn',
    childCmd: {
        cmd: 'layer',
        desc: '云函数层管理'
    },
    childSubCmd: sub
})
