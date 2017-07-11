import * as Fs from 'fs';
import {ParsedMail, simpleParser} from 'mailparser';
import * as Path from 'path';
import errorCallback from './utils/errorCallback';
import getMailDirName from './utils/getMailDirName';
import headerToString from './utils/headerToString';
import upperFirst from './utils/upperFirst';

/**
 * Parse and extract contents from email.
 * 
 * @param stream Raw mail stream.
 * @param mailDir Path to directory to store emails.
 */
function parseMail( stream: NodeJS.ReadableStream, mailDir: string ): void
{
	simpleParser(
		stream,
		( error, mail ) =>
		{
			if ( error )
			{
				console.error( error );
				
				return;
			}
			
			onParserEnd( mailDir, mail );
		},
	);
}

/**
 * Extract email contents and move to specific directory.
 * 
 * @param mailDir Path to directory to store emails.
 * @param mail Mail data.
 */
function onParserEnd( mailDir: string, mail: ParsedMail ): void
{
	const headersParts: string[] = [];
	
	mail.headers.forEach(
		( value, key ) =>
			headersParts.push(
				`${upperFirst( key )}: ${headerToString( value )}`,
			),
	);
	
	const currentMailDir = Path.resolve( mailDir, '..', getMailDirName( mail ) );
	
	const onDirRenamed = ( error: Error ): void =>
	{
		if ( error )
		{
			console.error( error );
			
			return;
		}
		
		Fs.writeFile(
			Path.resolve( currentMailDir, 'headers.txt' ),
			headersParts.join( '\n' ),
			errorCallback,
		);
		
		if ( mail.text )
		{
			Fs.writeFile(
				Path.resolve( currentMailDir, 'message.txt' ),
				mail.text,
				errorCallback,
			);
		}
		
		if ( mail.html )
		{
			Fs.writeFile(
				Path.resolve( currentMailDir, 'message.html' ),
				mail.html,
				errorCallback,
			);
		}
		
		if ( mail.attachments )
		{
			for ( const attachment of mail.attachments )
			{
				Fs.writeFile(
					Path.resolve(
						currentMailDir,
						'attachment_' + attachment.filename,
					),
					attachment.content,
					errorCallback,
				);
			}
		}
	};
	
	Fs.rename( mailDir, currentMailDir, onDirRenamed );
}

/**
 * Module.
 */
export {
	parseMail as default,
};
