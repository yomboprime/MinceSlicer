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

class ReliefNodeEvaluate extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'Evaluate';

		this.aNode = parameterValues[ 0 ];
		this.uNode = parameterValues[ 1 ];
		this.vNode = parameterValues[ 2 ];

		this.uv = new Vector2();

	}

	evaluate( uv, pos, normal, materialIndex ) {

		this.uv.set(
			this.uNode.evaluate( uv, pos, normal, materialIndex ),
			this.vNode.evaluate( uv, pos, normal, materialIndex )
		);

		return this.aNode.evaluate( this.uv, pos, normal, materialIndex );

	}

}

export { ReliefNodeEvaluate };
