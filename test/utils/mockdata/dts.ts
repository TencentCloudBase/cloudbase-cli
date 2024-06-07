import { template } from "lodash";


export function getDataModelMockList(params: {relation: '' | 'related' | 'father-son' | 'one-one' | 'many-one' | 'one-many' | 'many-many'}) {
    return [
        {
            name: 'dx_comment_wxp8smw',
            schema: {
                'x-primary-column': '_id',
                'x-kind': 'tcb',
                'x-defaultMethods': [
                    'wedaCreate',
                    'wedaUpdate',
                    'wedaDelete',
                    'wedaGetItem',
                    'wedaGetRecords',
                    'wedaGetList',
                    'wedaBatchCreate',
                    'wedaBatchUpdate',
                    'wedaBatchDelete'
                ],
                type: 'object',
                'x-relatedType': 'exist',
                'x-viewId': 'view-5my36gm34w',
                required: [],
                properties: {
                    owner: {
                        default: '',
                        'x-system': true,
                        'x-id': '8eaf3c7',
                        name: 'owner',
                        format: 'father-son',
                        pattern: '',
                        'x-index': 4,
                        title: '所有人',
                        type: 'string',
                        'x-unique': false,
                        'x-parent': {
                            fatherAction: 'judge',
                            parentViewId: 'view-4t6yyda26o',
                            type: 'father-son',
                            parentDataSourceName: 'sys_user'
                        }
                    },
                    createdAt: {
                        default: 0,
                        'x-system': true,
                        'x-id': '632cf95',
                        format: 'datetime',
                        'x-index': 2,
                        type: 'number',
                        title: '创建时间',
                        'x-unique': false
                    },
                    createBy: {
                        default: '',
                        'x-system': true,
                        'x-id': '8f6b347',
                        name: 'createBy',
                        format: 'father-son',
                        pattern: '',
                        'x-index': 5,
                        type: 'string',
                        title: '创建人',
                        'x-unique': false,
                        'x-parent': {
                            fatherAction: 'judge',
                            parentViewId: 'view-4t6yyda26o',
                            type: 'father-son',
                            parentDataSourceName: 'sys_user'
                        }
                    },
                    post: {
                        'x-required': false,
                        'x-keyPath': '',
                        'x-id': 'afa5f577',
                        format: params.relation,
                        description: '',
                        type: 'string',
                        'x-index': 46,
                        title: '文章',
                        'x-unique': false,
                        'x-parent': {
                            fatherAction: 'prompt-not-delete',
                            parentViewId: 'view-5mxgxruqls',
                            type: params.relation,
                            parentDataSourceName: 'dx_post_160wrcv'
                        }
                    },
                    updateBy: {
                        default: '',
                        'x-system': true,
                        'x-id': '93a079a',
                        name: 'updateBy',
                        format: 'father-son',
                        pattern: '',
                        'x-index': 6,
                        type: 'string',
                        title: '修改人',
                        'x-unique': false,
                        'x-parent': {
                            fatherAction: 'judge',
                            parentViewId: 'view-4t6yyda26o',
                            type: 'father-son',
                            parentDataSourceName: 'sys_user'
                        }
                    },
                    _departmentList: {
                        default: '',
                        'x-system': true,
                        'x-id': '04199c8',
                        format: '',
                        name: '_departmentList',
                        title: '所属部门',
                        type: 'array',
                        'x-index': 7,
                        items: { type: 'string' },
                        'x-unique': false
                    },
                    _openid: {
                        default: '',
                        'x-system': true,
                        'x-id': 'f139991',
                        name: '_openid',
                        format: '',
                        pattern: '',
                        description: '仅微信云开发下使用',
                        'x-index': 45,
                        title: '记录创建者',
                        type: 'string',
                        'x-unique': false
                    },
                    comment: {
                        'x-required': false,
                        'x-keyPath': '',
                        'x-id': 'abb2147c',
                        format: 'x-long-text',
                        description: '',
                        type: 'string',
                        'x-index': 47,
                        title: '评论内容',
                        'x-unique': false,
                        maxLength: 4000
                    },
                    _id: {
                        default: '',
                        'x-system': true,
                        'x-id': '8530d55',
                        format: '',
                        pattern: '',
                        'x-index': 1,
                        type: 'string',
                        title: '数据标识',
                        'x-unique': true
                    },
                    updatedAt: {
                        default: 0,
                        'x-system': true,
                        'x-id': '55593d5',
                        format: 'datetime',
                        'x-index': 3,
                        title: '更新时间',
                        type: 'number',
                        'x-unique': false
                    }
                }
            },
            title: '评论'
        },
        {
            name: 'dx_post_160wrcv',
            schema: {
                'x-primary-column': '_id',
                'x-kind': 'tcb',
                'x-defaultMethods': [
                    'wedaCreate',
                    'wedaUpdate',
                    'wedaDelete',
                    'wedaGetItem',
                    'wedaGetRecords',
                    'wedaGetList',
                    'wedaBatchCreate',
                    'wedaBatchUpdate',
                    'wedaBatchDelete'
                ],
                type: 'object',
                'x-relatedType': 'exist',
                'x-viewId': 'view-5mxgxruqls',
                required: [],
                properties: {
                    owner: {
                        default: '',
                        'x-system': true,
                        'x-id': '024d5f7',
                        name: 'owner',
                        format: 'father-son',
                        pattern: '',
                        'x-index': 4,
                        title: '所有人',
                        type: 'string',
                        'x-unique': false,
                        'x-parent': {
                            fatherAction: 'judge',
                            parentViewId: 'view-4t6yyda26o',
                            type: 'father-son',
                            parentDataSourceName: 'sys_user'
                        }
                    },
                    createdAt: {
                        default: 0,
                        'x-system': true,
                        'x-id': 'af8c848',
                        format: 'datetime',
                        'x-index': 2,
                        type: 'number',
                        title: '创建时间',
                        'x-unique': false
                    },
                    createBy: {
                        default: '',
                        'x-system': true,
                        'x-id': 'f8cb320',
                        name: 'createBy',
                        format: 'father-son',
                        pattern: '',
                        'x-index': 5,
                        type: 'string',
                        title: '创建人',
                        'x-unique': false,
                        'x-parent': {
                            fatherAction: 'judge',
                            parentViewId: 'view-4t6yyda26o',
                            type: 'father-son',
                            parentDataSourceName: 'sys_user'
                        }
                    },
                    updateBy: {
                        default: '',
                        'x-system': true,
                        'x-id': '93a079a',
                        name: 'updateBy',
                        format: 'father-son',
                        pattern: '',
                        'x-index': 6,
                        type: 'string',
                        title: '修改人',
                        'x-unique': false,
                        'x-parent': {
                            fatherAction: 'judge',
                            parentViewId: 'view-4t6yyda26o',
                            type: 'father-son',
                            parentDataSourceName: 'sys_user'
                        }
                    },
                    _departmentList: {
                        default: '',
                        'x-system': true,
                        'x-id': '1739969',
                        format: '',
                        name: '_departmentList',
                        title: '所属部门',
                        type: 'array',
                        'x-index': 7,
                        items: { type: 'string' },
                        'x-unique': false
                    },
                    _openid: {
                        default: '',
                        'x-system': true,
                        'x-id': 'a103dc3',
                        name: '_openid',
                        format: '',
                        pattern: '',
                        description: '仅微信云开发下使用',
                        'x-index': 45,
                        title: '记录创建者',
                        type: 'string',
                        'x-unique': false
                    },
                    _id: {
                        default: '',
                        'x-system': true,
                        'x-id': '0f41d10',
                        format: '',
                        pattern: '',
                        'x-index': 1,
                        type: 'string',
                        title: '数据标识',
                        'x-unique': true
                    },
                    title: {
                        'x-required': false,
                        'x-keyPath': '',
                        'x-id': '33fd3c57',
                        format: '',
                        name: 'title',
                        description: '',
                        isEnum: false,
                        type: 'string',
                        'x-index': 48,
                        title: '标题',
                        'x-unique': false,
                        maxLength: 4000
                    },
                    body: {
                        'x-required': false,
                        'x-keyPath': '',
                        'x-id': 'a737ec34',
                        format: 'x-rtf',
                        description: '',
                        type: 'string',
                        'x-index': 46,
                        title: '内容',
                        'x-unique': false,
                        maxLength: 262144
                    },
                    slug: {
                        'x-required': false,
                        'x-keyPath': '',
                        'x-id': '7d5bba5b',
                        format: '',
                        description: '',
                        type: 'string',
                        'x-index': 47,
                        title: '别名',
                        'x-unique': false,
                        maxLength: 4000
                    },
                    updatedAt: {
                        default: 0,
                        'x-system': true,
                        'x-id': '67ecc9f',
                        format: 'datetime',
                        'x-index': 3,
                        title: '更新时间',
                        type: 'number',
                        'x-unique': false
                    }
                }
            },
            title: 'dx_post'
        }
    ]
}


export function getMockDTS(params: {relation: ''| 'related' | 'father-son' | 'one-one' | 'many-one' | 'one-many' | 'many-many'}) {
    let result = ''

    const compiled = template(`
    import { type DataModelMethods } from "@cloudbase/wx-cloud-client-sdk";
    interface IModalDxCommentWxp8Smw {
      <%= commentDts %>
    }
    
    interface IModalDxPost_160Wrcv {
      /**
       * 标题
       *
       */
      title?: string;
      /**
       * 内容
       *
       */
      body?: string;
      /**
       * 别名
       *
       */
      slug?: string;
    }
    
    declare module "@cloudbase/wx-cloud-client-sdk" {
        interface OrmClient {
        
        /**
        * 数据模型：评论
        */ 
        dx_comment_wxp8smw: DataModelMethods<IModalDxCommentWxp8Smw>;
        
        /**
        * 数据模型：dx_post
        */ 
        dx_post_160wrcv: DataModelMethods<IModalDxPost_160Wrcv>;
        }
    }`)

    switch (params.relation) {
        case 'father-son':
        case 'related':
            result = compiled({commentDts: `
                /**
                 * 文章
                 *
                 */
                post?: string;
                /**
                 * 评论内容
                 *
                 */
                comment?: string;
                /**
                 * 关联文章对象
                 */
                "@post"?: {
                    v1?: {
                    record?: IModalDxPost_160Wrcv;
                    };
                };
            `})
            break;
        case 'one-one':
        case 'many-one':
            result = compiled({commentDts: `
                post?: IModalDxPost_160Wrcv;
                /**
                 * 评论内容
                 *
                 */
                comment?: string;
            `})
           break;
        case 'one-many':
        case 'many-many':
            result = compiled({commentDts: `
                post?: IModalDxPost_160Wrcv[]
                /**
                 * 评论内容
                 *
                 */
                comment?: string;
            `})
            break;
        default:
            result = compiled({commentDts: `
                /**
                 * 文章
                 *
                 */
                post?: string;
                /**
                 * 评论内容
                 *
                 */
                comment?: string;
            `})
    }

    return formatDTS(result)
}

export function formatDTS(dts: string) {
    return dts.replace(/^\s+/gm, '').trim()
}

