import Table, { TableOptions, HorizontalTable } from 'cli-table3'

// 打印水平方向的表格
export function printHorizontalTable(
    head: string[],
    data: (string | number)[][] = [],
    options?: TableOptions
) {
    if (!data?.length) {
        console.log('列表数据为空')
    }
    const table: HorizontalTable = new Table({
        head,
        style: { head: ['yellow'] },
        colAligns: new Array(head.length).fill('center'),
        ...options
    }) as HorizontalTable

    data.forEach((item: Table.Cell[]) => {
        table.push(item)
    })
    console.log(table.toString())
}
