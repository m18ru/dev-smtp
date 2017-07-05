import * as Fs from 'fs';
import * as Path from 'path';
import {Session, SMTPServer} from 'smtp-server';
import parseMail from './parseMail';
import errorCallback from './utils/errorCallback';

/**
 * Run development SMTP server.
 * 
 * @param mailDir Path to directory to store emails.
 * @param port TCP port number.
 */
function main( mailDir: string, port: number = 25 ): SMTPServer
{
	const server = new SMTPServer(
		{
			disabledCommands: ['AUTH'],
			disableReverseLookup: true,
			onData: onServerData.bind( null, mailDir ),
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
 * @param mailDir Path to directory to store emails.
 * @param stream A readable stream for the incoming message.
 * @param _session Includes the `envelope` object and `user` data if logged in.
 * @param callback Runs when stream is ended.
 */
function onServerData(
	mailDir: string,
	stream: NodeJS.ReadableStream,
	_session: Session,
	callback: ( error?: Error ) => any,
): void
{
	const rawFile = Path.resolve( mailDir, Date.now() + '.eml' );
	const rawOutput = Fs.createWriteStream( rawFile );
	const mailparser = parseMail( mailDir, rawFile );
	
	stream.pipe( rawOutput );
	stream.pipe( mailparser );
	stream.on( 'end', callback );
}

/**
 * Module.
 */
export {
	main as default,
};
