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

import { Vector3, MathUtils, Box3 } from 'three';

import { Tool } from './Tool.js';

class ToolTransform extends Tool {

	constructor( minceSlicer, transformType, snapValue ) {

		super( minceSlicer );

		// 'translate', 'rotate' or 'scale'
		this.transformType = transformType;

		// mm, degrees, factor
		this.snapValue = snapValue;

		// mm, degrees, factor
		this.previousValue = new Vector3();

	}

	select( previousTool ) {

		this.selectionChanged();

	}

	deselect() {

		if ( this.minceSlicer.selectedSlicerObject ) {

			this.minceSlicer.scene.attach( this.minceSlicer.selectedSlicerObject.dummyTransformObject );

		}

		this.minceSlicer.transformControls.visible = false;
		this.minceSlicer.transformControls.enabled = false;

	}

	selectionChanged() {

		const controls = this.minceSlicer.transformControls;

		if ( this.minceSlicer.selectedSlicerObject ) {

			controls.attach( this.minceSlicer.selectedSlicerObject.dummyTransformObject );
			controls.visible = true;
			controls.enabled = true;

			controls.setMode( this.transformType );
			this.setSnapEnabled( false );

			switch ( this.transformType ) {

				case 'translate':
					controls.setSpace( 'world' );
					controls.showY = false;
					break;

				case 'rotate':
					controls.setSpace( 'local' );
					controls.showY = true;
					break;

				case 'scale':
					controls.setSpace( 'local' );
					controls.showY = true;
					break;

			}

		}
		else {

			controls.detach();
			controls.visible = false;
			controls.enabled = false;

		}

	}

	setSnapEnabled( enabled ) {

		const controls = this.minceSlicer.transformControls;

		if ( ! enabled ) {

			controls.setTranslationSnap( null );
			controls.setRotationSnap( null );
			controls.setScaleSnap( null );

			return;

		}

		switch ( this.transformType ) {

			case 'translate':
				controls.setTranslationSnap( this.snapValue );
				break;

			case 'rotate':
				controls.setRotationSnap( MathUtils.degToRad( this.snapValue ) );
				break;

			case 'scale':
				controls.setScaleSnap( this.snapValue );
				break;

		}

	}

}

export { ToolTransform };
