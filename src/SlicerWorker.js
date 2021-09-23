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
import { encode } from 'fast-png';

import { Slicer } from './slicing/Slicer.js';
import { GeometrySerializer } from './utils/GeometrySerializer.js';

let myWorkerIndex = null;


const slicer = new Slicer();
let resolutionX = 0;
let resolutionY = 0;
let image = null;
let imagePNG = null;

self.onmessage = ( event ) => {

	switch ( event.data.type ) {

		case 'initIndex':
			myWorkerIndex = event.data.workerIndex;
			break;

		case 'initWorker':
			onInitWorkerMessage( event.data );
			break;

		case 'job':

			const parameters = event.data.parameters;

			const result = executeJob( parameters );

			self.postMessage( {
				type: "jobResult",
				workerIndex: myWorkerIndex,
				result: result
			} );

		break;

	}

};

function onInitWorkerMessage( message ) {

	initPrint( message );

}

function executeJob( parameters ) {

	switch ( parameters.jobType ) {

		case 'sliceLayer':
			return sliceLayer( parameters );

	}

	return null;

}

function initPrint( parameters ) {

	const geometry = GeometrySerializer.deserialize( parameters.geometry );

	slicer.setupPrint( geometry, parameters.images, parameters.printSettings );

	resolutionX = parameters.printSettings.resolutionX;
	resolutionY = parameters.printSettings.resolutionY;

	image = Slicer.createImage( resolutionX, resolutionY );

	imagePNG = {
		width: resolutionX,
		height: resolutionY,
		data: image,
		depth: 8,
		channels: 1
	};

}

function sliceLayer( parameters ) {

	slicer.sliceLayer( parameters.layerIndex, image );

	if ( parameters.resultTypePNGContent ) {

		const pngLayerData = encode( imagePNG );

		return {
			layerIndex: parameters.layerIndex,
			numNonZeroPixels: slicer.countPixelsInImage( image ),
			pngLayerData: pngLayerData
		};

	}
	else {

		return {
			layerIndex: parameters.layerIndex,
			image: image
		};

	}
}
