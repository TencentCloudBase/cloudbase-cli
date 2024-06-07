import { generateDataModelDTS } from '../../src/utils/dts'
import { getDataModelMockList, getMockDTS, formatDTS } from './mockdata/dts'

describe('generateDataModelDTS', () => {

    test('没有关联关系', async () => {
        const dataModelList = getDataModelMockList({ relation: '' })
        const result = await generateDataModelDTS(dataModelList as any)
        expect(formatDTS(result)).toEqual(getMockDTS({relation: ''}))
    })

    test('旧关联关系 related 或 father-son', async () => {
        const dataModelList = getDataModelMockList({ relation: 'father-son' })
        const result = await generateDataModelDTS(dataModelList as any)
        expect(formatDTS(result)).toEqual(getMockDTS({relation: 'father-son'}))
    })

    test('新关联关系 one-one 或 many-one', async () => {
        const dataModelList = getDataModelMockList({ relation: 'one-one' })
        const result = await generateDataModelDTS(dataModelList as any)
        console.log(result)
        expect(formatDTS(result)).toEqual(getMockDTS({relation: 'one-one'}))
    })

    test('新关联关系 one-many 或 many-many', async () => {
        const dataModelList = getDataModelMockList({ relation: 'one-many' })
        const result = await generateDataModelDTS(dataModelList as any)
        expect(formatDTS(result)).toEqual(getMockDTS({relation: 'one-many'}))
    })

    test('关联关系 多个字段关联同个模型', async () => {
        const dataModelList = [{
            name: 'dx_comment_wxp8smw',
            schema: {
                type: 'object',
                properties: {
                    post: {
                        format: 'one-one',
                        description: '',
                        type: 'string',
                        title: '文章',
                        'x-parent': {
                            parentDataSourceName: 'dx_post_160wrcv'
                        }
                    },
                    post1: {
                        format: 'one-one',
                        description: '',
                        type: 'string',
                        title: '文章',
                        'x-parent': {
                            parentDataSourceName: 'dx_post_160wrcv'
                        }
                    },
                }
            },
            title: '评论'
        },]
        const result = await generateDataModelDTS(dataModelList as any)
        expect(formatDTS(result)).toEqual(formatDTS(`
            import { type DataModelMethods } from "@cloudbase/wx-cloud-client-sdk";
            interface IModalDxCommentWxp8Smw {
                post?: IModalDxPost_160Wrcv;
                post1?: IModalDxPost_160Wrcv;
            }
            
            declare module "@cloudbase/wx-cloud-client-sdk" {
                interface OrmClient {
                
                    /**
                    * 数据模型：评论
                    */ 
                    dx_comment_wxp8smw: DataModelMethods<IModalDxCommentWxp8Smw>;
                }
            }
        `))
    })

    test('异常：没有 schema 字段', async () => {
        const dataModelList = [
            {
                name: 'dx_comment_wxp8smw',
                title: '评论'
            },
        ]
        const result = await generateDataModelDTS(dataModelList as any)
        expect(formatDTS(result)).toEqual(formatDTS(`
            import { type DataModelMethods } from "@cloudbase/wx-cloud-client-sdk";
            interface IModalDxCommentWxp8Smw {}
            declare module "@cloudbase/wx-cloud-client-sdk" {
                interface OrmClient {
                
                    /**
                    * 数据模型：评论
                    */ 
                    dx_comment_wxp8smw: DataModelMethods<IModalDxCommentWxp8Smw>;
                }
            }
        `))
    })
})
