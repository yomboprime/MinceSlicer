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

import { MinceSlicer } from '../MinceSlicer.js';
import { ToolTransform } from './ToolTransform.js';
import { ToolSitOnFace } from './ToolSitOnFace.js';

class Tools {

	constructor( minceSlicer ) {

		this.minceSlicer = minceSlicer;

		this.toolNames = [
			'None',
			'Move (g)',
			'Rotate (r)',
			'Scale (s)',
			'Sit Model On Face (f)'
			/*,
			'Lineal support'
			*/
		];

		this.tools = {
			'None': null,
			'Move (g)': new ToolTransform( this.minceSlicer, 'translate', 1 ),
			'Rotate (r)': new ToolTransform( this.minceSlicer, 'rotate', 15 ),
			'Scale (s)': new ToolTransform( this.minceSlicer, 'scale', 0.5 ),
			'Sit Model On Face (f)': new ToolSitOnFace( this.minceSlicer ),
			/*,
			new ToolLinealSupport( this.minceSlicer ),
			*/
		};

		for ( let i = 0; i < this.toolNames.length; i ++ ) {

			if ( this.tools[ this.toolNames[ i ] ] ) {

				this.tools[ this.toolNames[ i ] ].name = this.toolNames[ i ];

			}

		}

		this.currentTool = null;

	}

	selectTool( toolName ) {

		// toolName can be null to deselect

		const tool = this.tools[ toolName ];

		if ( tool === undefined ) {

			console.error( "Unknown tool name: '" + toolName + "'." );
			return;

		}

		const previousTool = this.currentTool;

		if ( previousTool ) previousTool.deselect();

		this.currentTool = tool;

		if ( this.currentTool ) this.currentTool.select( previousTool );

	}

	selectionChanged() {

		if ( this.currentTool ) this.currentTool.selectionChanged();
	}

}

export { Tools };