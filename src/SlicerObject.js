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

import {
	Vector2,
	Vector3,
	Quaternion,
	Object3D,
	Box3,
	Box3Helper
} from 'three';

class SlicerObject {

	constructor( mesh, displayName, originalFileName, id ) {

		this.id = id;

		this.displayName = displayName;
		this.originalFileName = originalFileName;

		this.config = this.getDefaultConfig();

		this.mesh = mesh;
		this.mesh.name = displayName;
		this.supportsMeshes = null;

		this.dummyTransformObject = new Object3D();
		this.dummyTransformObject.name = "Dummy of " + displayName;

		this.bbox = new Box3();
		this.bboxHelper = new Box3Helper( this.bbox, 0xFF0000 );
		this.updateBBox();

		if ( mesh.geometry.getIndex() ) this.triCount = Math.floor( mesh.geometry.getIndex().array.length / 3 );
		else this.triCount = Math.floor( mesh.geometry.getAttribute( 'position' ).array.length / 9 );

	}

	updateBBox( min, max, machineX, machineY, machineZ ) {

		if ( min === undefined ) {

			this.bboxHelper.visible = false;
			return;

		}

		this.bbox.min.copy( min );
		this.bbox.max.copy( max );

		machineX *= 0.5;
		machineY *= 0.5;

		//  Machine axes are not the same as Three.js axes
		const outOfBounds = this.bbox.min.x < - machineY ||
							this.bbox.min.y < 0 ||
							this.bbox.min.z < - machineX ||
							this.bbox.max.x > machineY ||
							this.bbox.max.y > machineZ ||
							this.bbox.max.z > machineX;

		this.bboxHelper.visible = outOfBounds;

	}

	getDefaultConfig() {

		return {
			buildplatePosition: new Vector2(),
			heightAboveBuildplate: 0,
			rotationQuaternion: new Quaternion(),
			scale: new Vector3(),
			supports: {

			}
		};
	}

}

export { SlicerObject };
