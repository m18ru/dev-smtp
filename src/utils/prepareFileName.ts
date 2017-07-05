/**
 * Prepare name to use as filename.
 * 
 * @param name Original name.
 */
function prepareFileName( name: string ): string
{
	return name.replace( /[<>:;"'`\/\\|?*.]+/g, '_' ).substr( 100 );
}

/**
 * Module.
 */
export {
	prepareFileName as default,
};
