Serve Static Cache
==================

Serve Static Cache is an Express middleware for writing responses to static files. Used in combination with the [`serve-static`](https://github.com/expressjs/serve-static) middleware or your web server's static file serving, it can dramatically improve the speed at which responses are served. It does so by automatically generating static files containing the response contents for any `GET` request made to your server.

## Installation

`npm install serve-static-cache`

## Usage

Like the [`serve-static`](https://github.com/expressjs/serve-static) middleware, Serve Static Cache expects a root directory to use as a target for generated files. In most cases, this will match the one you use for serving static files.

```js
var path = require( 'path' );
var express = require( 'express' );
var cache = require( 'serve-static-cache' );

var server = express();
server.use( cache( { root: path.join( __dirname, '/public' ) } ) );
```

By default, Serve Static Cache will never delete cached file. If instead you'd prefer for cached files to be deleted when first initialized, pass a `clean` parameter. If you also plan to serve non-cached file out of your public directory, you may want to serve a separate directory when used in combination with the `clean` option.

```js
var path = require( 'path' );
var express = require( 'express' );
var cache = require( 'serve-static-cache' );

var server = express();
server.use( express.static( path.join( __dirname, '/public' ) );
server.use( express.static( path.join( __dirname, '/public-cache' ) );
server.use( cache( { root: path.join( __dirname, '/public-cache' ) } ) );
```

## Options

The following options are made available:

#### `root`

<table>
	<tr><td>Type</td><td>String</td></tr>
	<tr><td>Required</td><td>Yes</td></tr>
</table>

The target directory for generated files.

#### `clean`

<table>
	<tr><td>Type</td><td>Boolean</td></tr>
	<tr><td>Required</td><td>No</td></tr>
	<tr><td>Default</td><td><code>false</code></td></tr>
</table>

Whether the target directory should be reset when the middleware initializes.

## Planned Features

The following features are not yet available, but are planned for future versions.

- Setting time-to-live cache duration for files
- Exposing cache-busting options

## License

Copyright 2015 Andrew Duthie. Released under the MIT License.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
