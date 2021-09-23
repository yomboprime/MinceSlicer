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
import { Vector3 } from 'three';
import { unzip } from 'unzipit';
import * as zip from '@zip.js/zip.js';
import { decode } from 'fast-png';

import { ResinGCode } from './ResinGCode.js';

class ResinPrint {

	constructor() {

		this.printSettings = null;

		// These are png file contents
		this.previewImage = null;
		this.previewImageCropped = null;

		// This array elements are png file contents
		this.pngLayers = null;

		this.couldNotFindGCodeError = "Could not find 'run.gcode' file in the ZIP.";

	}

	loadSettingsFromZipFile( zipFile, callback ) {

		// Load only print settings from ZIP file

		const scope = this;

		unzip( zipFile ).then( ( zipContents ) => {

			const runGCodeEntry = zipContents.entries[ 'run.gcode' ];

			if ( ! runGCodeEntry ) {

				callback( scope.couldNotFindGCodeError );
				return;

			}

			// Read print settings from 'run.gcode' text file
			runGCodeEntry.text().then( ( gcodeContent ) => {

				const gcode = new ResinGCode( gcodeContent );

				scope.printSettings = gcode.getSettings();

				const settingsError = gcode.checkSettings( scope.printSettings );
				if ( settingsError ) {

					callback( "In 'run.gcode' file settings: " + error );
					return;

				}

				// Success
				callback( null );

			} );

		} );

	}

	setDataFromZipFile( zipFile, callback ) {

		// Load settings and all data from ZIP file

		this.pngLayers = [ ];

		const scope = this;

		unzip( zipFile ).then( ( zipContents ) => {

			const runGCodeEntry = zipContents.entries[ 'run.gcode' ];
			const previewImageEntry = zipContents.entries[ 'preview.png' ];
			const previewImageCroppedEntry = zipContents.entries[ 'preview_cropping.png' ];

			if ( ! runGCodeEntry ) {

				callback( "Could not find 'run.gcode' file in the ZIP." );
				return;

			}

			if ( ! previewImageEntry ) {

				callback( "Could not find 'preview.png' file in the ZIP." );
				return;

			}

			if ( ! previewImageCroppedEntry ) {

				callback( "Could not find 'preview_cropping.png' file in the ZIP." );
				return;

			}

			// Read print settings from 'run.gcode' text file
			runGCodeEntry.text().then( ( gcodeContent ) => {

				const gcode = new ResinGCode( gcodeContent );

				scope.printSettings = gcode.getSettings();

				const settingsError = gcode.checkSettings( scope.printSettings );
				if ( settingsError ) {

					callback( "In 'run.gcode' file settings: " + error );
					return;

				}

				// Check all layer PNGs exist
				for ( let i = 1, il = scope.printSettings.totalLayer; i <= il; i ++ ) {

					if ( ! zipContents.entries[ i + '.png' ] ) {

						callback( "Could not find layer image file '" + i + ".png' in the ZIP." );
						return;

					}

				}

				previewImageEntry.blob( 'image/png' ).then( ( pngDataPreview ) => {

					scope.previewImage = pngDataPreview;

					previewImageCroppedEntry.blob( 'image/png' ).then( ( pngDataPreviewCropped ) => {

						scope.previewImageCropped = pngDataPreviewCropped;

						function extractLayer( layerNumber ) {

							if ( layerNumber > scope.printSettings.totalLayer ) {

								// Success
								callback( null );
								return;

							}

							const layerEntry = zipContents.entries[ layerNumber + '.png' ];

							layerEntry.blob( 'image/png' ).then( ( pngData ) => {

								// Store PNG image
								scope.pngLayers.push( pngData );

								// Extract next image
								extractLayer( layerNumber + 1 );

							} );

						}

						// Extract first image
						extractLayer( 1 );

					} );

				} );

			} );

		} );

	}

	estimatePrintTime( resinPrintNumLayers ) {

		const numBottomLayers = Math.min( resinPrintNumLayers, this.printSettings.bottomLayerCount );
		const numNormalLayers = resinPrintNumLayers - numBottomLayers;

		// Just a guess
		const imageLoadTime = 0.2;

		const bottomLayerTime =
			imageLoadTime +
			2 * ( 60 * this.printSettings.bottomLayerLiftHeight / this.printSettings.bottomLayerLiftSpeed ) +
			this.printSettings.bottomLightOffTime +
			this.printSettings.bottomLayerExposureTime;


		const normalLayerTime =
			imageLoadTime +
			60 * this.printSettings.normalLayerLiftHeight / this.printSettings.normalLayerLiftSpeed +
			60 * this.printSettings.normalLayerLiftHeight / this.printSettings.normalDropSpeed +
			this.printSettings.lightOffTime +
			this.printSettings.normalExposureTime;

		return numBottomLayers * bottomLayerTime + numNormalLayers * normalLayerTime;

	}

	getZipFileData( onProgress, onResult ) {

		const scope = this;

		// Get gcode text
		const gcode = new ResinGCode();
		gcode.setSettings( this.printSettings );
		const parsedSettings = gcode.getSettings();
		const gcodeContent = gcode.printSettingsToString( parsedSettings );

		// Create zip file
		const blobWriter = new zip.BlobWriter( "application/zip" );
		const writer = new zip.ZipWriter( blobWriter );

		const numLayers = this.pngLayers.length;

		writer.add( "run.gcode", new zip.TextReader( gcodeContent ) ).then( () => {

			writer.add( "preview.png", new zip.TextReader( scope.previewImage ) ).then( () => {
				writer.add( "preview_cropping.png", new zip.TextReader( scope.previewImageCropped ) ).then( () => {

					if ( numLayers > 0 ) {

						addLayerPNG( 0 );

					}
					else finishZIP();

				} );
			} );

		} );

		function addLayerPNG( layerIndex ) {

			if ( layerIndex >= numLayers ) {

				finishZIP();
			}
			else {

				writer.add( ( layerIndex + 1 ) + ".png", new zip.TextReader( scope.pngLayers[ layerIndex ] ) ).then( () => {

					layerIndex ++;

					onProgress( layerIndex, numLayers );

					addLayerPNG( layerIndex );

				} );
			}
		}

		function finishZIP() {

			writer.close().then( () => {

				const blob = blobWriter.getData();
				onResult( blob );

			} );
		}

	}

	convertToSTL( voxelSize ) {

		// voxelSize is Vector3

		const numLayers = this.pngLayers.length;

		if ( numLayers < 3 ) return null;

		// Count quads

		let numQuads = 0;

		const firstLayerPNG = decode( this.pngLayers[ 0 ] );

		const width = firstLayerPNG.width;
		const height = firstLayerPNG.height;

		let previousLayer = null;
		let currentLayer = firstLayerPNG.data;
		let nextLayer = decode( this.pngLayers[ 1 ] ).data;

		for ( let k = 0; k < numLayers; k ++ ) {

			let p = 0;
			for ( let j = 0; j < height; j ++ ) {

				for ( let i = 0; i < width; i ++ ) {

					if ( currentLayer[ p ] !== 0 ) {

						if ( ( ! previousLayer ) || ( previousLayer[ p ] === 0 ) ) numQuads ++;
						if ( ( ! nextLayer ) || ( nextLayer[ p ] === 0 ) ) numQuads ++;
						if ( ( i === 0 ) || ( currentLayer[ p - 1 ] === 0 ) ) numQuads ++;
						if ( ( i === width - 1 ) || ( currentLayer[ p + 1 ] === 0 ) ) numQuads ++;
						if ( ( j === 0 ) || ( currentLayer[ p - width ] === 0 ) ) numQuads ++;
						if ( ( j === height - 1 ) || ( currentLayer[ p + width ] === 0 ) ) numQuads ++;

					}

					p ++;

				}

			}

			previousLayer = currentLayer;
			currentLayer = nextLayer;
			nextLayer = k < numLayers - 2 ? decode( this.pngLayers[ k + 2 ] ).data : null;

		}

		const numTriangles = numQuads * 2;

		// Prepare STL file. Skip header
		let offset = 80;
		const bufferLength = numTriangles * 2 + numTriangles * 3 * 4 * 4 + 80 + 4;
		const arrayBuffer = new ArrayBuffer( bufferLength );
		const output = new DataView( arrayBuffer );
		output.setUint32( offset, numTriangles, true ); offset += 4;

		// Generate vertices

		const v1 = new Vector3();
		const v2 = new Vector3();
		const v3 = new Vector3();
		const v12 = new Vector3();
		const v13 = new Vector3();
		const normal = new Vector3();

		previousLayer = null;
		currentLayer = decode( this.pngLayers[ 0 ] ).data;
		nextLayer = decode( this.pngLayers[ 1 ] ).data;

		for ( let k = 0; k < numLayers; k ++ ) {

			let p = 0;
			for ( let j = 0; j < height; j ++ ) {

				for ( let i = 0; i < width; i ++ ) {

					if ( currentLayer[ p ] !== 0 ) {

						if ( ( ! previousLayer ) || ( previousLayer[ p ] === 0 ) ) generateQuad( i, j, k, 0, 1, true );
						if ( ( ! nextLayer ) || ( nextLayer[ p ] === 0 ) ) generateQuad( i, j, k + 1, 0, 1, false );
						if ( ( i === 0 ) || ( currentLayer[ p - 1 ] === 0 ) ) generateQuad( i, j, k, 2, 1, false );
						if ( ( i === width - 1 ) || ( currentLayer[ p + 1 ] === 0 ) ) generateQuad( i + 1, j, k, 2, 1, true );
						if ( ( j === 0 ) || ( currentLayer[ p - width ] === 0 ) ) generateQuad( i, j, k, 0, 2, false );
						if ( ( j === height - 1 ) || ( currentLayer[ p + width ] === 0 ) ) generateQuad( i, j + 1, k, 0, 2, true );

					}

					p ++;

				}

			}

			previousLayer = currentLayer;
			currentLayer = nextLayer;
			nextLayer = k < numLayers - 2 ? decode( this.pngLayers[ k + 2 ] ).data : null;

		}

		function generateQuad( i, j, k, a, b, invertNormal ) {

			let iIncX = 0;
			let jIncX = 0;
			let kIncX = 0;
			let iIncY = 0;
			let jIncY = 0;
			let kIncY = 0;

			if ( a === 0 ) {
				iIncX ++;
			}
			else if ( a === 1 ) {
				jIncX ++;
			}
			else {
				kIncX ++;
			}

			if ( b === 0 ) {
				iIncY ++;
			}
			else if ( b === 1 ) {
				jIncY ++;
			}
			else {
				kIncY ++;
			}

			if ( ! invertNormal ) {

				generateTriangle(
					i, j, k,
					i + iIncX, j + jIncX, k + kIncX,
					i + iIncX + iIncY, j + jIncX + jIncY, k + kIncX + kIncY
				);

				generateTriangle(
					i, j, k,
					i + iIncX + iIncY, j + jIncX + jIncY, k + kIncX + kIncY,
					i + iIncY, j + jIncY, k + kIncY
				);

			}
			else {

				generateTriangle(
					i, j, k,
					i + iIncX + iIncY, j + jIncX + jIncY, k + kIncX + kIncY,
					i + iIncX, j + jIncX, k + kIncX
				);

				generateTriangle(
					i, j, k,
					i + iIncY, j + jIncY, k + kIncY,
					i + iIncX + iIncY, j + jIncX + jIncY, k + kIncX + kIncY
				);

			}

			function generateTriangle( x1, y1, z1, x2, y2, z2, x3, y3, z3 ) {

				v1.set( x1, y1, z1 ).multiply( voxelSize );
				v2.set( x2, y2, z2 ).multiply( voxelSize );
				v3.set( x3, y3, z3 ).multiply( voxelSize );

				v12.subVectors( v2, v1 );
				v13.subVectors( v3, v1 );
				normal.crossVectors( v13, v12 ).normalize();

				// Normal
				output.setFloat32( offset, normal.x, true ); offset += 4;
				output.setFloat32( offset, normal.y, true ); offset += 4;
				output.setFloat32( offset, normal.z, true ); offset += 4;

				// Vertices
				output.setFloat32( offset, v1.x, true ); offset += 4;
				output.setFloat32( offset, v1.y, true ); offset += 4;
				output.setFloat32( offset, v1.z, true ); offset += 4;

				output.setFloat32( offset, v2.x, true ); offset += 4;
				output.setFloat32( offset, v2.y, true ); offset += 4;
				output.setFloat32( offset, v2.z, true ); offset += 4;

				output.setFloat32( offset, v3.x, true ); offset += 4;
				output.setFloat32( offset, v3.y, true ); offset += 4;
				output.setFloat32( offset, v3.z, true ); offset += 4;

				// attribute byte count
				output.setUint16( offset, 0, true ); offset += 2;
			}

		}

		return arrayBuffer;

	}

}

export { ResinPrint };
