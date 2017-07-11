/**
 * Converts the first character of `str` to upper case.
 * 
 * @param str The string to convert.
 */
function upperFirst( str: string ): string
{
	return str[0].toUpperCase() + str.substr( 1 );
}

/**
 * Module.
 */
export {
	upperFirst as default,
};
