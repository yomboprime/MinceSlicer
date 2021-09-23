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

import { ReliefNode } from './ReliefNode.js';

class ReliefNodeCircles extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'Circles';

		this.numCircles = parameterValues[ 1 ] * 2;

		this.offsetU = parameterValues[ 2 ];
		this.offsetV = parameterValues[ 3 ];

		this.range = this.ceil - this.floor;

	}

	evaluate( uv, pos, normal, materialIndex ) {

		const u = uv.x + this.offsetU.evaluate( uv, pos, normal, materialIndex );
		const v = uv.y + this.offsetV.evaluate( uv, pos, normal, materialIndex );

		const r = Math.sqrt( u * u + v * v );

		return this.floor + this.range * ( Math.floor( r * this.numCircles ) & 1 ? 1 : 0 );


	}

}

export { ReliefNodeCircles };
