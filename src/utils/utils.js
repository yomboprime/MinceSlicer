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

function getFilenameExtension( path ) {

	path = path || "";

	const pathLastIndexOfDot = path.lastIndexOf( "." );

	if ( pathLastIndexOfDot > 0 && path.length > pathLastIndexOfDot + 1) {

		return path.substring( pathLastIndexOfDot + 1 );

	}
	else return "";

}

function removeFilenameExtension( path ) {

	path = path || "";

	const pathLastIndexOfDot = path.lastIndexOf( "." );

	if ( pathLastIndexOfDot > 0 && path.length > pathLastIndexOfDot + 1) {

		return path.substring( 0, pathLastIndexOfDot );

	}
	else return "";

}

function roundTo2Digits( value ) {

	const r = Math.round( value * 100 );

	const r10 = r % 10;
	const r100 = Math.round( r % 100 / 10 );

	const numDigitsDecimals = r10 !== 0 ? 2 : ( r100 == 0 ? 0 : 1 );

	let s = "" + ( r / 100 );

	if ( numDigitsDecimals === 0 ) s += ".";

	for ( let i = 0; i < 2 - numDigitsDecimals; i ++ ) s += "0";

	return s;
}

function timeInSecondsToHumanString( timeSeconds ) {

	timeSeconds = Math.floor( timeSeconds );

	const hours = Math.floor( timeSeconds / 3600 );
	const minutes = Math.floor( ( timeSeconds / 60 ) % 60);
	const seconds = Math.floor( timeSeconds % 60 );

	return "" + ( hours > 0 ? hours + " hours " : "" ) + minutes + " minutes " + ( seconds + " seconds" );
}

module.exports = {
	getFilenameExtension,
	removeFilenameExtension,
	roundTo2Digits,
	timeInSecondsToHumanString
};