const arg = require('arg')

const argv = process.argv

const args = arg(
    {
        '--help': Boolean,
        '-h': '--help',

        '--platform-version': Number,
        '-V': '--platform-version',

        '--debug': Boolean,
        '-d': '--debug',

        '--token': String,
        '-t': '--token',

        '--scope': String,
        '-S': '--scope',

        '--team': String,
        '-T': '--team',

        '--local-config': String,
        '-A': '--local-config',

        '--global-config': String,
        '-Q': '--global-config',

        '--api': String,

        '--target': String
    },
    {
        argv
    }
)

console.log(args)
/*
{
	_: [],
	'-A': 4,
	'-B': [true, true, true, true]
}
*/
