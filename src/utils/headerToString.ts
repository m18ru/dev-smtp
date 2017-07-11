import {AddressObject, HeaderValue, StructuredHeader} from 'mailparser';

/**
 * Convert parsed header value to string.
 * 
 * @param value Header value.
 */
function headerToString( value: HeaderValue ): string
{
	if ( (value as AddressObject).text )
	{
		return (value as AddressObject).text;
	}
	
	if ( (value as StructuredHeader).value )
	{
		const params = (value as StructuredHeader).params;
		const paramsStrParts: string[] = [];
		
		for ( const key of Object.keys( params ) )
		{
			paramsStrParts.push( `${key}="${params[key]}"` );
		}
		
		return `${(value as StructuredHeader).value}; ${paramsStrParts.join( '; ' )}`;
	}
	
	if ( (value as string[]).join )
	{
		return (value as string[]).join( ', ' );
	}
	
	return value as string;
}

/**
 * Module.
 */
export {
	headerToString as default,
};
