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

class ReliefNodePerlinUV extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'PerlinUV';

		this.numIterations = parameterValues[ 1 ];
		this.size = parameterValues[ 2 ];
		this.multSize = parameterValues[ 3 ];
		this.multContribution = parameterValues[ 4 ];

		this.simplex = context.simplex;

		this.range = this.ceil - this.floor;

		this.vec21 = new Vector2();

	}

	evaluate( uv, pos, normal, materialIndex ) {

		const size = this.size.evaluate( uv, pos, normal, materialIndex );

		const multSize = this.multSize.evaluate( uv, pos, normal, materialIndex );
		const multContribution = this.multContribution.evaluate( uv, pos, normal, materialIndex );

		let value = 0;
		let maxValue = 0;
		let multContrib = 1;
		const vec21 = this.vec21;
		vec21.set( 0.5, 0.5 ).add( uv ).multiplyScalar( size );
		for ( let i = 0, l = this.numIterations; i < l; i ++ ) {

			vec21.multiplyScalar( multSize );
			multContrib *= multContribution;
			maxValue += multContrib;

			value += multContrib * this.simplex.noise( vec21.x, vec21.y );

		}

		value /= maxValue;

		return this.floor + this.range * ( value * 0.5 + 0.5 );

	}

}

export { ReliefNodePerlinUV };

/*
vec2 ruido3d( vec3 pos, int numIterations, float size, float multSize, float multContribution )
{
  // Obtain a vec2 noise (0..1 in the 2 dimensions) based on model position
  float multContrib = 1.0;
  float maxValue = 0.0;
  vec2 noise = vec2( 0.0 );
  for ( int i = 1; i <= numIterations; i++ ) {
    size *= multSize;
    multContrib *= multContribution;
    maxValue += multContrib;
    vec2 n = texture( sampler0, size * pos.xyz ).xy;
    n.x = abs( 2.0 * n.x -1.0 );
    n.y = abs( 2.0 * n.y -1.0 );
    noise += multContrib * ( n );
  }
  noise /= maxValue;
  return noise;
}
*/
