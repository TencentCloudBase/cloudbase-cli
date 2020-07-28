const program = require('commander')

program.storeOptionsAsProperties(false).passCommandToAction(false)

// program.name('my-program-name').option('-n,--name <name>')

program
    .command('show')
    .option('--name <name>')
    .option('-a,--action <action>')
    .action((options) => {
        console.log(options.action)
    })

program.parse(process.argv)

// const programOptions = program.opts()
// console.log(programOptions.name)
