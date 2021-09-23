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

import { Vector2 } from 'three';
import { ReliefNode } from './ReliefNode.js';

class ReliefNodeVoronoiUV extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'VoronoiUV';

		this.numPoints = parameterValues[ 1 ];
		this.lineThickness = parameterValues[ 2 ];

		this.prng = context.prng;
		this.range = this.ceil - this.floor;

		this.points = [ ];
		for ( let i = 0; i < this.numPoints; i ++ ) {

			this.points.push( new Vector2( this.prng.random(), this.prng.random() ) );

		}

		this.vec21 = new Vector2();
		this.vec22 = new Vector2();


	}

	evaluate( uv, pos, normal, materialIndex ) {

		const lineThickness = this.lineThickness.evaluate( uv, pos, normal, materialIndex );
		const lineThickness2 = lineThickness * 0.5;

		let minDist1 = + Infinity;
		let minIndex1 = - 1;
		for ( let i = 0; i < this.numPoints; i ++ ) {

			this.vec21.subVectors( uv, this.points[ i ] );
			const dist = this.vec21.length();

			if ( dist < minDist1 ) {

				minDist1 = dist;
				minIndex1 = i;

			}

		}

		this.vec22.subVectors( uv, this.points[ minIndex1 ] ).normalize().multiplyScalar( lineThickness2 ).add( uv );

		let minDist2 = + Infinity;
		let minIndex2 = - 1;
		for ( let i = 0; i < this.numPoints; i ++ ) {

			this.vec21.subVectors( this.vec22, this.points[ i ] );
			const dist = this.vec21.length();

			if ( dist < minDist2 ) {

				minDist2 = dist;
				minIndex2 = i;

			}

		}

		const distToVoronoi = Math.abs( minDist2 - minDist1 );

		const isInLine = ( distToVoronoi < lineThickness2 ) && ( minIndex1 !== minIndex2 );

		//return this.floor + this.range * ( isInLine ? Math.max( 0, distToVoronoi / lineThickness2 ) : 1  );
		return this.floor + this.range * ( isInLine ? 0 : 1  );

	}

}

export { ReliefNodeVoronoiUV };
