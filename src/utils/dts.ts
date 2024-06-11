/**
 * 生成 TS 类型定义文件相关方法
 */

import { compile, type JSONSchema } from 'json-schema-to-typescript'
import { deburr, has, set, trim, upperFirst } from 'lodash'
import { uuidv4 } from './tools'

/**
 * 生成数据模型的 TS 类型定义文件
 */
export async function generateDataModelDTS(
    dataModelList: { name: string; title: string; schema: JSONSchema }[]
): Promise<string> {
    const dtsList = await Promise.all(
        dataModelList.map(async (item) => {
            let dts = await _handleOne(item.name, item.schema)
            return {
                name: item.name,
                title: item.title,
                dts
            }
        })
    )

    const result = `
import { DataModelMethods } from "@cloudbase/wx-cloud-client-sdk";
${dtsList.map((item) => item.dts).join('\n')}

interface IModels {
${dtsList
    .map((item: any) => {
        return `
    /**
    * 数据模型：${item.title}
    */ 
    ${item.name}: DataModelMethods<${getModelInterfaceName(item.name)}>;`
    })
    .join('\n')}    
}

declare module "@cloudbase/wx-cloud-client-sdk" {
    interface OrmClient extends IModels {}
}

declare global {
    interface WxCloud {
        models: IModels;
    }
}`

    return result

    async function _handleOne(name: string, schema: JSONSchema): Promise<string> {
        if (!schema?.properties) return `interface ${getModelInterfaceName(name)} {}`

        // 删除系统字段
        Object.keys(schema.properties).forEach((key) => {
            if (schema.properties[key]['x-system']) {
                delete schema.properties[key]
            }
        })

        // 旧关联关系
        Object.keys(schema.properties).forEach((key) => {
            const field = schema.properties[key]
            if (['related', 'father-son'].includes(field.format)) {
                schema.properties[`@${key}`] = {
                    type: 'object',
                    description: `关联${field.title}对象`,
                    properties: {
                        v1: {
                            type: 'object',
                            properties: {
                                record: {
                                    type: 'string',
                                    format: field.format,
                                    'x-parent': {
                                        parentDataSourceName: field['x-parent'].parentDataSourceName
                                    }
                                }
                            }
                        }
                    }
                }
                // 清空，因为关联关系转移到上面的字段了
                schema.properties[key].format = ''
            }
        })

        // title 字段合并进 description 字段作为注释信息。同时删除 title 字段，避免生成的 dts 不符合预期
        schema = JSON.parse(
            JSON.stringify(schema, (_: string, value: any) => {
                if (has(value, 'title') && !has(value, 'title.title')) {
                    set(value, 'description', value['title'] + '\n' + value['description'])
                    delete value['title']
                }
                return value
            })
        )

        const dts = await _compile(name, schema)

        return dts
    }

    async function _compile(name: string, jsonschema) {
        try {
            let dts = await compile(jsonschema, getModelInterfaceName(name), {
                additionalProperties: false,
                bannerComment: '',
                format: true,
                unknownAny: false,
                customName(_schema) {
                    const format = _schema.format
                    let name = ''
                    if (['one-one', 'many-one', 'related', 'father-son'].includes(format)) {
                        // 1 或 n : 1
                        name = getModelInterfaceName(_schema?.['x-parent']?.parentDataSourceName)
                    }
                    if (['one-many', 'many-many'].includes(format)) {
                        // 1 或 n : n: 增加 ARRAY_TYPE_ 来标识这是个数组类型
                        name = `ARRAY_TYPE_${getModelInterfaceName(
                            _schema?.['x-parent']?.parentDataSourceName
                        )}`
                    }

                    if (name) {
                        // 这里的处理是为了当多个字段关联同个数据模型时，在生成 dts 时，会生成两个不同的类型（比如 type, type1）
                        name = `${name}_TAIL${uuidv4()}_END_`
                    }

                    return name || undefined
                }
            })
            dts = dts
                .replace(/export interface/g, 'interface')
                .replace(/ARRAY_TYPE_(.*);/g, '$1[]')
                .replace(/_TAIL.*?_END_/g, '')
                .replace(/[\s\S]*?(?=interface)/, '') // 删除掉 interface 上面的内容
            return dts
        } catch (e) {
            console.error('_compile error:', e)
            return ''
        }
    }

    function getModelInterfaceName(name: string) {
        if (!name) return ''
        return upperFirst(
            // remove accents, umlauts, ... by their basic latin letters
            deburr(`IModal_${name}`)
                // replace chars which are not valid for typescript identifiers with whitespace
                .replace(/(^\s*[^a-zA-Z_$])|([^a-zA-Z_$\d])/g, ' ')
                // uppercase leading underscores followed by lowercase
                .replace(/^_[a-z]/g, (match) => match.toUpperCase())
                // remove non-leading underscores followed by lowercase (convert snake_case)
                .replace(/_[a-z]/g, (match) => match.substr(1, match.length).toUpperCase())
                // uppercase letters after digits, dollars
                .replace(/([\d$]+[a-zA-Z])/g, (match) => match.toUpperCase())
                // uppercase first letter after whitespace
                .replace(/\s+([a-zA-Z])/g, (match) => trim(match.toUpperCase()))
                // remove remaining whitespace
                .replace(/\s/g, '')
        )
    }
}
