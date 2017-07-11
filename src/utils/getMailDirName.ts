import {ParsedMail} from 'mailparser';
import prepareFileName from './prepareFileName';

/**
 * Regexp to clean up ISO date for use in directory name.
 */
const regexpCleanDate = /[^\d-]/g;

/**
 * Date of previous email message.
 */
let lastDateString: string = '';
/**
 * Counter for messages with the same date.
 */
let counter: number = 0;

/**
 * Returns directory name for email message.
 * 
 * @param mail Mail data.
 */
function getMailDirName( mail: ParsedMail ): string
{
	let dateString: string;
	
	if ( !mail.date )
	{
		dateString = (new Date()).toISOString().replace( regexpCleanDate, '-' );
	}
	else
	{
		dateString = mail.date.toISOString().replace( regexpCleanDate, '-' );
	}
	
	if ( lastDateString !== dateString )
	{
		counter = 0;
	}
	else
	{
		++counter;
	}
	
	lastDateString = dateString;
	
	return `${dateString}${counter}-${prepareFileName( mail.subject || '' )}`;
}

/**
 * Module.
 */
export {
	getMailDirName as default,
};
