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

import { Vector2, Raycaster } from 'three';

import { Tool } from './Tool.js';

class ToolSitOnFace extends Tool {

	constructor( minceSlicer ) {

		super( minceSlicer );

		this.mouseCoords = new Vector2();
		this.raycaster = new Raycaster();

		this.previousTool = null;

		const scope = this;

		minceSlicer.renderer.domElement.addEventListener( 'click', ( e ) => {

			if ( this !== scope.minceSlicer.tools.currentTool ) return;

			if ( ! scope.minceSlicer.selectedSlicerObject ) return;

			scope.mouseCoords.set(
				( event.clientX / window.innerWidth ) * 2 - 1,
				- ( event.clientY / window.innerHeight ) * 2 + 1
			);

			scope.raycaster.setFromCamera( scope.mouseCoords, scope.minceSlicer.camera );

			const intersections = scope.raycaster.intersectObject( scope.minceSlicer.selectedSlicerObject.mesh );

			if ( intersections.length === 0 ) return;

			intersections.sort( ( a, b ) => {
				if ( a.distance === b.distance ) return 0;
				return a.distance < b.distance ? - 1 : 1;
			} );

			if ( this.previousTool && this.previousTool !== this ) {

				this.minceSlicer.tools.selectTool( this.previousTool.name );

			}

			scope.minceSlicer.makeSlicerObjectSitOnFace( scope.minceSlicer.selectedSlicerObject, intersections[ 0 ].face.normal );

		}, false );

	}

	select( previousTool ) {

		this.previousTool = previousTool;
		this.enable( true );

	}

	deselect() {

		this.enable( false );
		this.previousTool = null;

	}

	selectionChanged() {

		this.enable( this.minceSlicer.selectedSlicerObject !== null );

	}

	enable( doEnable ) {

		this.minceSlicer.renderer.domElement.style.cursor = doEnable ? 'crosshair' : 'auto';
		this.minceSlicer.cameraControls.enabled = ! doEnable;

	}

}

export { ToolSitOnFace };
