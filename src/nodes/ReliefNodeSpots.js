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

class ReliefNodeSpots extends ReliefNodeCell {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'Spots';

		this.spotRadius = parameterValues[ 3 ];

		this.range = this.ceil - this.floor;

	}

	evaluate( uv, pos, normal, materialIndex ) {

		const sizeU = this.sizeU.evaluate( uv, pos, normal, materialIndex );
		const sizeV = this.sizeV.evaluate( uv, pos, normal, materialIndex );

		const cellU = ReliefNodeCell.coordinateToCell( uv.x, sizeU );
		const cellV = ReliefNodeCell.coordinateToCell( uv.y, sizeV );

		uv.x -= ( cellU * 0.5 + 0.5 ) * sizeU;
		uv.y -= ( cellV * 0.5 + 0.5 ) * sizeV;

		const radius = this.spotRadius.evaluate( uv, pos, normal, materialIndex );

		const r = Math.sqrt( cellU * cellU + cellV * cellV );

		if ( r > radius ) return this.floor;

		const h = 1 - r / radius;

		return this.floor + this.range * h;

	}

}

export { ReliefNodeSpots };
