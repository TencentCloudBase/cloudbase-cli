import * as Table from 'cli-table3'

export function printCliTable(
    head: string[],
    data: string[][] = [],
    options?: any
) {
    const table = new Table({
        head,
        style: { head: ['yellow'] },
        colAligns: new Array(head.length).fill('center'),
        ...options
    })
    data.forEach((item: any) => {
        table.push(item)
    })
    console.log(table.toString())
}
