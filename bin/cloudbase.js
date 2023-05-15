#!/usr/bin/env node
const chalk = require('chalk')

console.log(chalk.bold.yellowBright('\n', `Tip: cloudbase 命令可以简写为 tcb`), '\n')

require('./tcb').main()
