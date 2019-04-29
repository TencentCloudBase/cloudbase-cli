import Logger from './../src/logger'

describe('class Logger', () => {
    let loggerWithParam: Logger | null = null
    let loggerWithoutParam: Logger | null = null

    beforeAll(async () => {
        loggerWithParam = new Logger('loggerWithParam')
        loggerWithoutParam = new Logger(undefined)
    })

    afterAll(async () => {
        loggerWithParam = null
        loggerWithoutParam = null
    })

    test('#log', () => {
        expect(loggerWithParam.log('test logger#log with param'))
            .toBeUndefined()
        expect(loggerWithoutParam.log('test logger#log without param'))
            .toBeUndefined()
    })

    test('#error', () => {
        expect(loggerWithParam.error('test logger#error with param'))
            .toBeUndefined()
        expect(loggerWithoutParam.log('test logger#error without param'))
            .toBeUndefined()
    })
})