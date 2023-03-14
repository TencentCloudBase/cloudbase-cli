export const standalonegatewayCommonOptions = (sub: string) => ({
  cmd: 'run',
  childCmd: {
    cmd: 'standalonegateway',
    desc: '云托管小租户网关管理'
  },
  childSubCmd: sub
})