/**
 * External dependencies
 */

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import fs from 'fs';

/**
 * Internal dependencies
 */

import cache, { ServeStaticCache } from '../src/';

/**
 * Test initialization
 */

chai.use( sinonChai );
const expect = chai.expect;

/**
 * Mocks
 */

const MOCK_OPTIONS = { root: './' };

/**
 * Test #cache() function
 */

describe( '#cache()', function() {
	it( 'should throw error if no options are passed', () => {
		expect( cache ).to.throw( TypeError );
	} );

	it( 'should throw error if root option is not passed', () => {
		expect( cache.bind( null, {} ) ).to.throw( TypeError );
	} );

	it( 'should return middleware function', () => {
		expect( cache( MOCK_OPTIONS ) ).to.be.a( 'function' );
	} );
} );

/**
 * Test ServeStaticCache class
 */

describe( 'ServeStaticCache', () => {
	let sandbox, instance;

	before( () => {
		sandbox = sinon.sandbox.create();
		instance = new ServeStaticCache( MOCK_OPTIONS );
	} );

	beforeEach( () => {
		sandbox.restore();
	} );

	describe( '#constructor()', () => {
		it( 'should clean the root directory if passed `clean` option', () => {
			sandbox.stub( ServeStaticCache.prototype, 'clean' );
			const options = Object.assign( {}, MOCK_OPTIONS, { clean: true } );

			new ServeStaticCache( options );

			expect( ServeStaticCache.prototype.clean ).to.have.been.called;
		} );
	} );

	describe( '#cache()', () => {
		it( 'should write the response to the target file', () => {
			sandbox.stub( fs, 'writeFile' );

			instance.cache( { url: 'http://example.com/foo' }, 'Hello World' );

			expect( fs.writeFile ).to.have.been.calledWith( 'foo/index.html', 'Hello World' );
		} );
	} );

	describe( '#target()', () => {
		it( 'should suffix with index.html for directories', () => {
			const target = instance.target( 'http://example.com/foo' );
			expect( target ).to.equal( 'foo/index.html' );
		} );

		it( 'should use the the url extension', () => {
			const target = instance.target( 'http://example.com/foo/bar.txt' );
			expect( target ).to.equal( 'foo/bar.txt' );
		} );
	} );
} );
