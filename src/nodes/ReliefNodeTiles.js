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

class ReliefNodeTiles extends ReliefNodeCell {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'Tiles';

		this.bevelFraction = parameterValues[ 3 ];

		this.alternatedBricks = parameterValues[ 4 ];

		this.range = this.ceil - this.floor;

	}

	evaluate( uv, pos, normal, materialIndex ) {

		const bevelFraction = this.bevelFraction.evaluate( uv, pos, normal, materialIndex );
		const tileFraction = 1 - bevelFraction;

		const sizeU = this.sizeU.evaluate( uv, pos, normal, materialIndex );
		const sizeV = this.sizeV.evaluate( uv, pos, normal, materialIndex );

		let u = uv.x;

		if ( this.alternatedBricks ) {

			const brickRow = Math.floor( uv.y / sizeV );
			if ( brickRow & 1 ) u -= 0.5 * sizeU;

			u = Math.abs( ReliefNodeCell.coordinateToCell( Math.abs( u ), sizeU ) );

		}
		else u = Math.abs( ReliefNodeCell.coordinateToCell( u, sizeU ) );

		const v = Math.abs( ReliefNodeCell.coordinateToCell( uv.y, sizeV ) );

		const a = sizeU / sizeV;
		if ( u < tileFraction && v < 1 - bevelFraction * a ) return this.ceil;

		const vLine = 1 - a + a * u;

		if ( v < vLine ) {

			return - this.range * ( u - 1 + bevelFraction ) / bevelFraction + this.ceil;

		}
		else {

			return - this.range * ( v - 1 + bevelFraction * a ) / ( bevelFraction * a ) + this.ceil;

		}

	}

}

export { ReliefNodeTiles };
