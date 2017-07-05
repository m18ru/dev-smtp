import * as Fs from 'fs';
import {Attachment, EmailAddress, MailParser, ParsedMail} from 'mailparser';
import * as Path from 'path';
import errorCallback from './utils/errorCallback';
import getMailDirName from './utils/getMailDirName';

/**
 * Parse and extract contents from email.
 * 
 * @param mailDir Path to directory to store emails.
 * @param rawFile Path to raw email file.
 */
function parseMail( mailDir: string, rawFile: string ): MailParser
{
	const mailparser = new MailParser(
		{
			streamAttachments: true,
		},
	);
	mailparser.on(
		'attachment',
		( attachment ) => onParserAttachment( mailDir, attachment ),
	);
	mailparser.on(
		'end',
		( mail ) => onParserEnd( mailDir, rawFile, mail ),
	);
	
	return mailparser;
}

/**
 * Extract attachments.
 * 
 * @param mailDir Path to directory to store emails.
 * @param attachment Attachment data.
 */
function onParserAttachment( mailDir: string, attachment: Attachment ): void
{
	const file = Path.resolve(
		mailDir,
		'attachment_' + attachment.generatedFileName,
	);
	const output = Fs.createWriteStream( file );
	
	attachment.stream.pipe( output );
}

/**
 * Extract email contents and move to specific directory.
 * 
 * @param mailDir Path to directory to store emails.
 * @param rawFile Path to raw email file.
 * @param mail Mail data.
 */
function onParserEnd( mailDir: string, rawFile: string, mail: ParsedMail ): void
{
	const metaParts = [ mail.subject, '' ];
	
	appendAddressesAsHeaderString( mail.from, 'From: ', metaParts );
	appendAddressesAsHeaderString( mail.to, 'To: ', metaParts );
	appendAddressesAsHeaderString( mail.cc, 'Cc: ', metaParts );
	appendAddressesAsHeaderString( mail.bcc, 'Bcc: ', metaParts );
	
	metaParts.push( '' );
	
	const headerKeys = Object.keys( mail.headers );
	
	for ( const key of headerKeys )
	{
		metaParts.push( `${key}: ${mail.headers[key]}` );
	}
	
	const currentMailDir = Path.resolve( mailDir, getMailDirName( mail ) );
	
	const onDirCreated = ( error: Error ): void =>
	{
		if ( error )
		{
			console.error( error );
			
			return;
		}
		
		Fs.rename(
			rawFile,
			Path.resolve( currentMailDir, 'raw.eml' ),
			errorCallback,
		);
		
		Fs.writeFile(
			Path.resolve( currentMailDir, 'meta.txt' ),
			metaParts.join( '\n' ),
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
	};
	
	Fs.mkdir( currentMailDir, onDirCreated );
}

/**
 * Append list of email addresses to list of headers.
 * 
 * @param list List of email addresses.
 * @param label Header label.
 * @param target Array to append.
 */
function appendAddressesAsHeaderString(
	list: EmailAddress[] | undefined,
	label: string,
	target: string[],
): void
{
	if ( list && ( list.length !== 0 ) )
	{
		const addresses = [];
		
		for ( const item of list )
		{
			addresses.push( `${item.name} <${item.address}>` );
		}
		
		target.push( label + addresses.join( ', ' ) );
	}
}

/**
 * Module.
 */
export {
	parseMail as default,
};
