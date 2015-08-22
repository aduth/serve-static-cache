/**
 * External dependencies
 */

import { parse } from 'url';
import { extname, join } from 'path';
import { mkdir, writeFile } from 'fs';
import rimraf from 'rimraf';
import _debug from 'debug';

/**
 * Debug initialization
 */

const debug = _debug( 'serve-static-cache' );

/**
 * ServeStaticCache
 *
 * An instance of this class is created for each invocation of the middleware.
 *
 * Options:
 *  - `root`:  The target directory for generated files (required)
 *  - `clean`: Whether the root directory should be destroyed when middleware
 *             is invoked (optional, defaults `false`)
 */
export class ServeStaticCache {
	/**
	 * The constructor accepts an options object, expecting that a root and any
	 * other optional parameters are specified.
	 *
	 * @param  {Object} options Middleware options, containing at minimum a
	 *                          `root` value
	 */
	constructor( options ) {
		this.options = Object.assign( {}, {
			clean: false
		}, options );

		if ( this.options.clean ) {
			this.clean();
		}
	}

	/**
	 * The Express middleware handler, skipping all non-GET requests and
	 * assumes that static files have already been served. Overrides the
	 * response send function, capturing the contents and generating a
	 * static file.
	 *
	 * @param  {Object}   request  Express request object
	 * @param  {Object}   response Express response object
	 * @param  {Function} next     Middleware continuation
	 */
	middleware( request, response, next ) {
		if ( request.method !== 'GET' ) {
			debug( 'Skipping non-GET request at `%s`', request.url );
			next();
			return;
		}

		const send = response.send;
		response.send = ( body ) => {
			debug( 'Response send intercepted at `%s`', request.url );
			this.cache( request, body );
			send.call( response, body );
		};

		debug( 'Received request at `%s`', request.url );
		next();
	}

	/**
	 * Removes the root directory, creating a new empty directory in its place.
	 */
	clean() {
		debug( 'Removing root directory `%s`', this.options.root );
		rimraf( this.options.root, () => {
			debug( 'Creating root directory `%s`', this.options.root );
			mkdir( this.options.root );
		} );
	}

	/**
	 * Accepting an Express request object and body buffer or string, generates
	 * a new static file at the interpreted path.
	 *
	 * @param  {Object}          request Express request object
	 * @param  {(Buffer|String)} body    Response body
	 */
	cache( request, body ) {
		const string = body instanceof Buffer ? body.toString() : body;
		const target = this.target( request.url );

		debug( 'Writing file for `%s` with %d characters to `%s`', request.url, string.length, target );
		writeFile( target, string );
	}

	/**
	 * Given a URL, determines the target destination for the generated static
	 * file. Unless the requested URL contains an extension, the file will be
	 * generated at a new directory in `index.html`.
	 *
	 * @param  {string} url Request URL
	 * @return {string}     Static file target destination
	 */
	target( url ) {
		let path = parse( url ).pathname;

		if ( ! extname( url ) ) {
			path = join( path, '/index.html' );
		}

		path = join( this.options.root, '/', path );

		return path;
	}
}

/**
 * Validates the existence and contents of the options object before creating
 * an instance of ServeStaticCache, returning its middleware handler.
 *
 * @param  {Object}   options ServeStaticCache options
 * @return {Function}         ServeStaticCache instance middleware handler
 */
export default function( options ) {
	if ( ! options ) {
		throw new TypeError( 'An options object must be passed' );
	}

	if ( ! options.root ) {
		throw new TypeError( 'Options must contain a root' );
	}

	debug( 'ServeStaticCache initialized' );
	const cache = new ServeStaticCache( options );
	return cache.middleware.bind( cache );
};
