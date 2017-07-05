/**
 * Callback to handle errors.
 * 
 * @param error Error object
 */
function errorCallback( error?: Error ): void
{
	if ( error )
	{
		console.error( error );
	}
}

/**
 * Module.
 */
export {
	errorCallback as default,
};
