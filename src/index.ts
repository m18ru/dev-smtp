import * as Fs from 'fs';
import * as Path from 'path';
import {generate} from 'shortid';
import {Session, SMTPServer} from 'smtp-server';
import parseMail from './parseMail';
import errorCallback from './utils/errorCallback';

/**
 * Run development SMTP server.
 * 
 * @param mailRootDir Path to directory to store emails.
 * @param port TCP port number.
 */
function main( mailRootDir: string, port: number = 25 ): SMTPServer
{
	const server = new SMTPServer(
		{
			disabledCommands: ['AUTH'],
			disableReverseLookup: true,
			onData: onServerData.bind( null, mailRootDir ),
		},
	);
	
	server.listen( port );
	
	process.on(
		'exit',
		() => server.close( errorCallback ),
	);
	
	return server;
}

/**
 * On incoming message.
 * 
 * @param mailRootDir Path to directory to store emails.
 * @param stream A readable stream for the incoming message.
 * @param _session Includes the `envelope` object and `user` data if logged in.
 * @param callback Runs when stream is ended.
 */
function onServerData(
	mailRootDir: string,
	stream: NodeJS.ReadableStream,
	_session: Session,
	callback: ( error?: Error ) => any,
): void
{
	const mailDir = Path.resolve( mailRootDir, generate() );
	
	const onDirCreated = ( error: Error ): void =>
	{
		if ( error )
		{
			console.error( error );
			
			return;
		}
		
		const rawFile = Path.resolve( mailDir, 'raw.eml' );
		const rawOutput = Fs.createWriteStream( rawFile );
		const mailparser = parseMail( mailDir );
		
		stream.pipe( rawOutput );
		stream.pipe( mailparser );
		stream.on( 'end', callback );
	};
	
	Fs.mkdir( mailDir, onDirCreated );
}

/**
 * Module.
 */
export {
	main as default,
};
