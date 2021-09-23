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

import { ReliefNodeCell } from './ReliefNodeCell.js';

class ReliefNodeImageTiledUV extends ReliefNodeCell {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'ImageTiledUV';

		this.imageSizeU = parameterValues[ 3 ];
		this.imageSizeV = parameterValues[ 4 ];

		this.offsetU = parameterValues[ 5 ];
		this.offsetV = parameterValues[ 6 ];

		const image = this.context.images[ parameterValues[ 7 ] ];

		this.imageValid = ( image != null ) && image.isImage && ( image.data !== null );
		this.imageData = this.imageValid ? image.data : null;
		this.width = this.imageValid ? image.width : null;
		this.height = this.imageValid ? image.height : null;

		this.range = this.ceil - this.floor;
		this.grayScaleConstant = this.range / 255;

	}

	evaluate( uv, pos, normal, materialIndex ) {

		if ( ! this.imageValid ) return 0;

		const sizeU = this.sizeU.evaluate( uv, pos, normal, materialIndex );
		const sizeV = this.sizeV.evaluate( uv, pos, normal, materialIndex );

		const u = ( ReliefNodeCell.coordinateToCell( uv.x, sizeU ) - this.offsetU ) / this.imageSizeU;
		const v = 1 - ( ReliefNodeCell.coordinateToCell( uv.y, sizeV ) - this.offsetV ) / this.imageSizeV;

		if ( u < 0 || u > 1 || v < 0 || v > 1 ) return 0;

		const p = Math.floor( v * this.height ) * this.width + Math.floor( u * this.width );

		return this.imageData[ p ] * this.grayScaleConstant + this.floor;

	}

}

export { ReliefNodeImageTiledUV };
