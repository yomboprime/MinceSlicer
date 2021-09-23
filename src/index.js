/*
Mince Slicer

MIT License

Copyright (c) 2021 Juan Jose Luna Espinosa

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

import { WEBGL } from 'three/examples/jsm/WebGL.js';
import { MinceSlicer } from './MinceSlicer.js';

changeFavicon( "favicon.ico" );

new MinceSlicer().run();

/*

This is not needed at the moment.

if ( WEBGL.isWebGL2Available() === false ) {

	document.body.appendChild( WEBGL.getWebGL2ErrorMessage() );

}
else {

	new MinceSlicer().run();

}
*/

function changeFavicon( src ) {

	// from http://stackoverflow.com/questions/260857/changing-website-favicon-dynamically
	var link = document.querySelector( "link[rel*='icon']" ) || document.createElement( 'link' );
	link.type = 'image/x-icon';
	link.rel = 'shortcut icon';
	link.href = src;
	document.getElementsByTagName( 'head' )[ 0 ].appendChild( link );

}