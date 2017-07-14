'use strict';

// tslint:disable:no-console

const argv = require( 'minimist' )(
	process.argv.slice( 2 ),
	{
		boolean: 'version',
		alias: {
			port: 'p',
			version: 'v',
		},
		default: {
			port: 2525,
		},
	}
);

const packageData = require( './package.json' );

if ( argv.version )
{
	console.log( packageData.version );
	process.exit();
}

if ( argv._.length !== 1 )
{
	console.log( `
${packageData.name} ${packageData.version}

Usage: dev-smtp [options] <path>
	
	<path> - Path to directory to store emails (should exist).
	
Options:
	-p, --port PORT    Port to listen for (default is 2525).
	-v, --version      Current version.
` );
	process.exit();
}

const path = argv._[0];
const Fs = require( 'fs' );

try
{
	const stats = Fs.statSync( path );
	
	if ( !stats.isDirectory() )
	{
		throw new Error( 'Path should be a directory.' );
	}
}
catch ( exception )
{
	console.error( exception.message );
	process.exit( 1 );
}

const devSmtp = require( './index' );

devSmtp( path, argv.port );

console.log( 'Starting development SMTP server on port %s', argv.port );
