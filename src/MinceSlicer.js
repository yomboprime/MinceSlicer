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

// Note: System units are millimeters.

import {
	Vector2,
	Vector3,
	Quaternion,
	Box3,
	Matrix4,
	Plane,
	Color,
	MathUtils,
	PerspectiveCamera,
	Scene,
	WebGLRenderer,
	Float32BufferAttribute,
	AxesHelper,
	Box3Helper,
	Mesh,
	PlaneGeometry,
	CanvasTexture,
	UVMapping,
	ClampToEdgeWrapping,
	NearestFilter,
	RGBAFormat,
	UnsignedByteType,
	DoubleSide,
	MeshBasicMaterial,
	MeshPhongMaterial,
	ShaderMaterial,
	AmbientLight,
	PointLight
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import { encode } from 'fast-png';

import { FileIn } from './FileIn.js';
import { MinceSlicerUI } from './ui/UI.js';
import { ResinPrint } from './slicing/ResinPrint.js';
import { ResinGCode } from './slicing/ResinGCode.js';
import { SlicerObject } from './SlicerObject.js';
import { JobManager } from './JobManager.js';
import { Slicer } from './slicing/Slicer.js';
import { Project } from './Project.js';
import { GeometrySerializer } from './utils/GeometrySerializer.js';
import { Tools } from './tools/Tools.js';
import { removeFilenameExtension, getFilenameExtension, roundTo2Digits } from './utils/utils.js';
import { reliefNodeClasses } from './nodes/reliefNodeClasses.js';
import { ReliefNode } from './nodes/ReliefNode.js';

import {
	saveFile,
	makeButton,
	makeCheckbox,
	makeProgressBar,
	makeControllerReadOnly,
	makePanelUI,
	deletePanelUI
} from './ui/uiUtils.js';

class MinceSlicer {

	constructor() {

		// File input

		this.fileIn = new FileIn( this );

		// Graphics

		this.maxDistance = 1000;
		this.container = null;
		this.renderer = null;
		this.camera = null;
		this.gui = null;
		this.scene = null;
		this.cameraControls = null;
		this.transformControls = null;
		this.layerClippingPlane = null;
		this.layerClippingTransformControls = null;
		this.selectedObjectColor = new Color( 0.8, 0.6, 0.2 );
		this.nonSelectedObjectColor = new Color( 0.65, 0.6, 0.3 );
		this.buildPlate = null;
		this.buildPlateMaterial = null;
		this.buildPlateBBoxHelper = null;

		// Canvas and 2D texture to upload to GPU texture array slices
		this.canvas = null;
		this.canvasCtx = null;
		this.canvasImageData = null;
		this.layerCanvasTexture = null;
		this.layerClippingPlaneCurrentLayer = 0;
		this.layerPlaneViewIsDirty = false;
		this.layerPlaneUpdateRequest = false;

		// Canvas for creating png thumbnails
		this.canvasThumbnail = null;
		this.canvasThumbnailCtx = null;
		this.canvasThumbnailCropped = null;
		this.canvasThumbnailCroppedCtx = null;

		// PNG image for 2D preview and export
		this.pngLayerImage = null;

		// Project data

		this.project = new Project();

		// Sliced resin print data

		this.resinPrint = null;

		// Slicing

		this.jobManagerIsBusy = false;
		this.jobManager = null;
		this.slicer = new Slicer();
		this.cancelSliceFlag = false;

		// User 3D tools

		this.tools = null;
		this.selectedSlicerObject = null;
		this.selectedImage = null;


		// Temporary variables

		this.bbox1 = new Box3();
		this.vec31 = new Vector3();
		this.vec32 = new Vector3();
		this.vec33 = new Vector3();
		this.mat41 = new Matrix4();
		this.quat1 = new Quaternion();

	}

	run() {

		this.initSystem();

		this.initApp3D();

		this.render();

	}

	initSystem() {

		this.container = document.createElement( 'div' );
		document.body.appendChild( this.container );

		this.gui = new MinceSlicerUI( this );

		this.jobManager = new JobManager( this.gui.data.maxWorkers );

		this.camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, this.maxDistance );
		this.camera.position.set(
			- this.gui.data.machineY,
			this.gui.data.machineZ / 2,
			this.gui.data.machineX
		);

		// scene

		this.scene = new Scene();
		//this.scene.background = new Color( 0xdeebed );

		this.scene.add( this.camera );

		this.renderer = new WebGLRenderer( {
			antialias: true,
			preserveDrawingBuffer: true,
			powerPreference: "high-performance"
		} );
		//this.renderer.autoClear = false;
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.setClearColor( 0x002244, 1.0 );
		this.renderer.localClippingEnabled = true;
		this.container.appendChild( this.renderer.domElement );

		window.addEventListener( 'resize', () => { this.onWindowResize(); } );

	}

	onWindowResize() {

		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize( window.innerWidth, window.innerHeight );

		this.render();

	}

	initApp3D() {

		const scope = this;

		// Lights

		const pointLight1 = new PointLight();
		this.camera.add( pointLight1 );

		this.scene.add( new AmbientLight( 0xFFFFFF, 0.2 ) );


		// Axes helper

		this.axesHelper = new AxesHelper( 50 );
		this.axesHelper.position.z = 0.05;
		this.scene.add( this.axesHelper );

		// Models material
		this.layerClippingPlane = new Plane( new Vector3( 0, -1, 0 ), +Infinity );

		// Build plate object

		this.buildPlateMaterial = new ShaderMaterial( {
			uniforms: {
				buildPlateDimensionsHalf: { value: new Vector2( this.gui.data.machineY * 0.5, this.gui.data.machineX * 0.5 ) }
			},
			vertexShader: `
				varying vec3 vPos;

				void main() {

					vPos = ( modelMatrix * vec4( position, 1.0 ) ).xyz;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}
			`,
			fragmentShader: `
				uniform vec2 buildPlateDimensionsHalf;
				varying vec3 vPos;

				#define lightColor vec4( 112.0 / 255.0, 128.0 / 255.0, 144.0 / 255.0, 1.0 )
				#define darkColor ( 0.7 * vec4( 112.0 / 255.0, 128.0 / 255.0, 144.0 / 255.0, 1.0 ) )

				void main() {

					vec2 fraction = mod( vPos.xz, vec2( 10.0, 10.0 ) );

					// Centimetred grid + build plate bounds

					float inMargin = abs( vPos.x ) >= buildPlateDimensionsHalf.x - 0.5 || abs( vPos.z ) >= buildPlateDimensionsHalf.y - 0.5 ? 1.0 : 0.0;

					float absX = abs( fraction.x );
					float absY = abs( fraction.y );

					if ( absX > 0.5 && absY > 0.5 && absX < 9.5 && absY < 9.5 && inMargin == 0.0 ) discard;

					gl_FragColor = inMargin == 0.0 ? lightColor : darkColor;

				}
			`
		} );

		this.buildPlate = new Mesh( new PlaneGeometry(), this.buildPlateMaterial );
		this.buildPlate.rotation.x = - Math.PI / 2;
		this.scene.add( this.buildPlate );

		const buildPlateBBox = new Box3();
		this.buildPlateBBoxHelper = new Box3Helper( buildPlateBBox, 0x00FFA0 );
		this.scene.add( this.buildPlateBBoxHelper );

		this.pngLayerImage = new Image();

		// Create canvas and 2D texture to convert sliced images to texture and pngs
		this.setLCDResolution();

		// Layer plane view object

		this.layerPlaneView = new Mesh(
			new PlaneGeometry(),
			new ShaderMaterial( {
			transparent:true,
			side: DoubleSide,
			uniforms: {
				buildPlateDimensionsHalf: { value: new Vector2( this.gui.data.machineY * 0.5, this.gui.data.machineX * 0.5 ) },
				layerMap: { value: this.layerCanvasTexture }
			},
			vertexShader: `
				//uniform sampler2D layerMap;
				varying vec2 vUV;

				void main() {

					//float offset = 1.0 / float( textureSize( layerMap, 0 ).y );

					vUV = vec2( uv.y, uv.x );
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}
			`,
			fragmentShader: `
				uniform vec2 buildPlateDimensionsHalf;
				uniform sampler2D layerMap;
				varying vec2 vUV;

				void main() {

					vec4 textureValue = texture2D( layerMap, vUV );

					//gl_FragColor = vec4( textureValue.rgb, textureValue.r > 0.0 ? 1.0 : 0.23 );
					//gl_FragColor = vec4( textureValue.rgb, textureValue.a > 0.0 ? textureValue.a : 0.23 );

					gl_FragColor = vec4( textureValue.rgb, textureValue.a );

				}
			`
			} )
		);
		this.layerPlaneView.rotation.x = - Math.PI / 2;
		this.layerPlaneView.position.y = 5;
		this.layerPlaneView.visible = false;
		this.scene.add( this.layerPlaneView );

		this.setBuildPlateScale();

		this.canvasThumbnail = document.createElement( 'canvas' );
		this.canvasThumbnail.width = 400;
		this.canvasThumbnail.height = 300;
		this.canvasThumbnailCtx = this.canvasThumbnail.getContext( '2d' );

		this.canvasThumbnailCropped = document.createElement( 'canvas' );
		this.canvasThumbnailCropped.width = 150;
		this.canvasThumbnailCropped.height = 150;
		this.canvasThumbnailCroppedCtx = this.canvasThumbnailCropped.getContext( '2d' );

		// Layer clipping plane transform controls

		this.layerClippingTransformControls = new TransformControls( this.camera, this.renderer.domElement );
		this.layerClippingTransformControls.setMode( 'translate' );
		this.layerClippingTransformControls.showX = false;
		this.layerClippingTransformControls.showZ = false;
		this.layerClippingTransformControls.attach( this.layerPlaneView );
		this.layerClippingTransformControls.enabled = false;
		this.layerClippingTransformControls.visible = false;
		this.layerClippingTransformControls.addEventListener( 'change', () => {

			scope.render();

		} );

		this.layerClippingTransformControls.addEventListener( 'objectChange', () => {

			if ( this.layerPlaneView.position.y < 0 ) this.layerPlaneView.position.y = 0;
			if ( this.layerPlaneView.position.y > this.gui.data.machineZ ) this.layerPlaneView.position.y = this.gui.data.machineZ;

			this.userMessage( "Height (mm): " + roundTo2Digits( this.layerPlaneView.position.y ) );

			scope.layerPlaneViewIsDirty = true;
			scope.render();

		} );

		this.layerClippingTransformControls.addEventListener( 'dragging-changed', function ( event ) {

			scope.cameraControls.enabled = ! event.value;
			scope.transformControls.enabled = ! event.value;

		} );

		this.scene.add( this.layerClippingTransformControls );


		// Camera controls

		this.cameraControls = new OrbitControls( this.camera, this.renderer.domElement );
		this.cameraControls.addEventListener( 'change', () => {

			//this.axesHelper.position.copy( this.cameraControls.target );
			scope.render();

		} );

		// Object transform controls

		this.transformControls = new TransformControls( this.camera, this.renderer.domElement );
		this.transformControls.setMode( 'translate' );

		this.transformControls.addEventListener( 'change', () => {

			scope.render();

		} );

		this.transformControls.addEventListener( 'objectChange', () => {

			scope.objectTransformChanged( scope.selectedSlicerObject );

		} );

		this.transformControls.addEventListener( 'dragging-changed', function ( event ) {

			scope.cameraControls.enabled = ! event.value;

		} );

		this.scene.add( this.transformControls );

		// Tools manager

		this.tools = new Tools( this );

		this.tools.selectTool( 'Move (g)' );

		// Create 2D UI
		this.gui.createMainUI();

	}

	resetView() {

		if ( this.cameraControls ) {

			this.cameraControls.target0.set( 0, 0, 0 );
			this.cameraControls.position0.set(
				- this.gui.data.machineY,
				this.gui.data.machineZ / 2,
				this.gui.data.machineX
			);

			this.cameraControls.reset();

			this.axesHelper.position.copy( this.cameraControls.target );

		}

	}

	setBuildPlateScale() {

		if ( this.jobManagerIsBusy ) {

			this.gui.makeInfoDialog( 600, "Can't change settings, please wait for current task.", null, "OK" );
			return;

		}

		this.buildPlate.scale.set( this.gui.data.machineY, this.gui.data.machineX, 1 );
		this.layerPlaneView.scale.set( this.gui.data.machineY, this.gui.data.machineX, 1 );

		this.buildPlateBBoxHelper.box.min.set( - this.gui.data.machineY * 0.5, 0, - this.gui.data.machineX * 0.5 );
		this.buildPlateBBoxHelper.box.max.set( this.gui.data.machineY * 0.5, this.gui.data.machineZ, this.gui.data.machineX * 0.5 );
		this.buildPlateBBoxHelper.visible = this.gui.data.showBuildVolumeBox;

		this.buildPlate.material.uniforms.buildPlateDimensionsHalf.value.set( this.gui.data.machineY * 0.5, this.gui.data.machineX * 0.5 );
		this.layerPlaneView.material.uniforms.buildPlateDimensionsHalf.value.set( this.gui.data.machineY * 0.5, this.gui.data.machineX * 0.5 );

		this.layerPlaneViewIsDirty = true;
		this.render();

	}

	setLCDResolution() {

		if ( this.jobManagerIsBusy ) {

			this.gui.makeInfoDialog( 600, "Can't change settings, please wait for current task.", null, "OK" );
			return;

		}

		this.canvas = document.createElement( 'canvas' );
		this.canvas.width = this.gui.data.resolutionX;
		this.canvas.height = this.gui.data.resolutionY;
		this.canvasCtx = this.canvas.getContext( '2d' );
		this.layerCanvasTexture = new CanvasTexture(
			this.canvas,
			UVMapping,
			ClampToEdgeWrapping,
			ClampToEdgeWrapping,
			NearestFilter,
			NearestFilter,
			RGBAFormat,
			UnsignedByteType
		);

		this.canvasImageData = this.canvasCtx.getImageData( 0, 0, this.canvas.width, this.canvas.height );

		if ( this.layerPlaneView ) {

			this.layerPlaneView.material.uniforms.layerMap.value = this.layerCanvasTexture;

		}

		this.layerPlaneViewIsDirty = true;
		this.render();

	}

	setMaxDistance( maxDistance ) {

		this.maxDistance = maxDistance;
		this.camera.far = maxDistance;
		this.camera.updateProjectionMatrix();
		this.render();

	}

	selectSlicerObject( slicerObject ) {

		this.selectedSlicerObject = slicerObject;

		this.tools.selectionChanged();

		this.userMessage( this.getToolbarInfoMessage() );

		this.render();

	}

	selectImage( image ) {

		this.selectedImage = image;

	}


	objectTransformChanged( slicerObject ) {

		if ( ! slicerObject ) return;

		// Set slicerObject transform config
		slicerObject.config.buildplatePosition.set( slicerObject.dummyTransformObject.position.x, slicerObject.dummyTransformObject.position.z );
		slicerObject.config.rotationQuaternion.copy( slicerObject.dummyTransformObject.quaternion );
		slicerObject.config.scale.copy( slicerObject.dummyTransformObject.scale );

		// Transform mesh
		slicerObject.mesh.position.copy( slicerObject.dummyTransformObject.position );
		slicerObject.mesh.quaternion.copy( slicerObject.dummyTransformObject.quaternion );
		this.vec31.copy( slicerObject.dummyTransformObject.scale );
		if ( this.vec31.x < 0 ) this.vec31.x = - this.vec31.x;
		if ( this.vec31.y < 0 ) this.vec31.y = - this.vec31.y;
		if ( this.vec31.z < 0 ) this.vec31.z = - this.vec31.z;
		slicerObject.mesh.scale.copy( this.vec31 );

		// Compute bounding box
		const verts = slicerObject.mesh.geometry.getAttribute( 'position' ).array;
		const matrix = this.mat41;
		this.vec31.set( 0, 0, 0 );
		matrix.compose( this.vec31, slicerObject.mesh.quaternion, slicerObject.mesh.scale );
		const min = this.vec31;
		const max = this.vec32;
		min.set( +Infinity, +Infinity, +Infinity );
		max.set( -Infinity, -Infinity, -Infinity );
		const worldPos = this.vec33;
		for ( let i = 0, l = verts.length; i < l; i += 3 ) {

			worldPos.fromArray( verts, i ).applyMatrix4( matrix );

			if ( worldPos.x < min.x ) min.x = worldPos.x;
			if ( worldPos.y < min.y ) min.y = worldPos.y;
			if ( worldPos.z < min.z ) min.z = worldPos.z;

			if ( worldPos.x > max.x ) max.x = worldPos.x;
			if ( worldPos.y > max.y ) max.y = worldPos.y;
			if ( worldPos.z > max.z ) max.z = worldPos.z;

		}

		// Put mesh on buildplate
		slicerObject.mesh.position.y = - min.y + slicerObject.config.heightAboveBuildplate;

		// Update visual BBox helper
		min.add( slicerObject.mesh.position );
		max.add( slicerObject.mesh.position );
		slicerObject.updateBBox( min, max, this.gui.data.machineX, this.gui.data.machineY, this.gui.data.machineZ );

		this.userMessage( this.getToolbarInfoMessage() );

		this.layerPlaneViewIsDirty = true;
		this.render();

	}

	getToolbarInfoMessage() {

		if ( this.selectedSlicerObject === null ) return null;

		let message = "Object: " + this.selectedSlicerObject.displayName;

		const tool = this.tools.currentTool;
		if ( tool !== null ) {

			switch ( tool.name ) {

				case 'Move (g)':
					this.vec31.subVectors( this.transformControls.worldPosition, this.transformControls.worldPositionStart );
					message += " Traslation: (" + roundTo2Digits( this.vec31.z ) + ", " + roundTo2Digits( this.vec31.x ) + ") mm.";
					break;

				case 'Rotate (r)':
					this.vec31.copy( this.selectedSlicerObject.mesh.rotation );
					this.vec31.x = roundTo2Digits( this.vec31.x * MathUtils.RAD2DEG );
					this.vec31.y = roundTo2Digits( this.vec31.y * MathUtils.RAD2DEG );
					this.vec31.z = roundTo2Digits( this.vec31.z * MathUtils.RAD2DEG );
					message += " Rotation: (" + this.vec31.z + ", " + this.vec31.x + ", " + this.vec31.y + ") deg.";
					break;

				case 'Scale (s)':
					this.vec31.copy( this.selectedSlicerObject.mesh.scale );
					message += " Scale factor: (" +
						roundTo2Digits( this.vec31.z ) + ", " +
						roundTo2Digits( this.vec31.x ) + ", " +
						roundTo2Digits( this.vec31.y ) + ")";
					break;

			}

		}

		message += " Tri count: " + this.selectedSlicerObject.triCount;

		return message;

	}

	createNewSlicerObject( project, mesh, fileName, displayName, id ) {

		mesh = this.processInputMesh( mesh );

		// Set object name avoiding duplicates
		if ( displayName === undefined ) displayName = fileName;
		let name = displayName;
		let i = 1;
		while ( this.gui.findObjectUIByName( name ) !== null ) {

			name = displayName + ' (' + ( i ++ ) + ')';

		}

		const objectId = id !== undefined ? id : project.nextSlicerObjectId ++;
		const slicerObject = new SlicerObject( mesh, name, fileName, objectId );
		this.addSlicerObject( project, slicerObject );

		return slicerObject;

	}

	addSlicerObject( project, slicerObject ) {

		const scope = this;

		project.slicerObjects.push( slicerObject );
		this.scene.add( slicerObject.mesh );
		this.scene.add( slicerObject.dummyTransformObject );
		this.scene.add( slicerObject.bboxHelper );

		slicerObject.mesh.userData.slicerObject = slicerObject;
		slicerObject.mesh.onBeforeRender = ( renderer, scene, camera, geometry, material, group ) => {

			if ( scope.selectedSlicerObject !== null && scope.selectedSlicerObject === slicerObject ) {

				material.color.copy(  scope.selectedObjectColor );

			}
			else {

				material.color.copy(  scope.nonSelectedObjectColor );

			}

		};

		const objectUI = this.gui.addObjectToUI( slicerObject );

		this.objectTransformChanged( slicerObject );

	}

	deleteSlicerObject( slicerObject ) {

		const index = this.project.slicerObjects.indexOf( slicerObject );
		if ( index < 0 ) return;

		this.selectSlicerObject( null );

		this.scene.remove( slicerObject.mesh );
		this.scene.remove( slicerObject.dummyTransformObject );
		this.scene.remove( slicerObject.bboxHelper );

		this.gui.removeObjectFromUI( slicerObject );

		this.project.slicerObjects.splice( index, 1 );

		slicerObject.mesh.geometry.dispose();

		this.userMessage( "" );

		this.layerPlaneViewIsDirty = true;
		this.render();

	}

	clearBuildPlate() {

		// Delete all SlicerObject's

		for ( let n = this.project.slicerObjects.length; n > 0; n -- ) {

			this.deleteSlicerObject( this.project.slicerObjects[ this.project.slicerObjects.length - 1 ] )

		}
	}

	resetSlicerObjectRotation( slicerObject ) {

		slicerObject.dummyTransformObject.quaternion.set( 0, 0, 0, 1 );

		this.objectTransformChanged( slicerObject );

	}

	makeSlicerObjectSitOnFace( slicerObject, faceNormal ) {

		this.mat41.compose(
			this.vec31.set( 0, 0, 0 ),
			slicerObject.dummyTransformObject.quaternion,
			slicerObject.dummyTransformObject.scale
		).invert();

		this.vec31.set( 0, -1, 0 ).applyMatrix4( this.mat41 ).normalize();
		this.vec32.crossVectors( faceNormal, this.vec31 );
		let angle = Math.asin( this.vec32.length() );
		if ( angle === 0 ) this.vec32.set( 1, 0, 0 );
		if ( faceNormal.dot( this.vec31 ) < 0 ) angle = Math.PI - angle;

		this.quat1.setFromAxisAngle( this.vec32.normalize(), angle );
		slicerObject.dummyTransformObject.quaternion.multiply( this.quat1 );

		this.objectTransformChanged( slicerObject );

	}

	makeSlicerObjectCopies( slicerObject, numCopiesX, numCopiesZ, separationX, separationZ ) {

		const scope = this;

		slicerObject.bbox.getSize( this.vec31 );
		const sizeX = this.vec31.x;
		const sizeZ = this.vec31.z;

		const offsetX =  - 0.5 * ( ( sizeX + separationX ) * ( numCopiesX - 1 ) );
		const offsetZ =  - 0.5 * ( ( sizeZ + separationZ ) * ( numCopiesZ - 1 ) );

		placeObject( slicerObject, 0, 0 );

		for ( let j = 0; j < numCopiesZ; j ++ ) {

			for ( let i = 0; i < numCopiesX; i ++ ) {

				if ( i === 0 && j === 0 ) continue;

				const newMesh = new Mesh( slicerObject.mesh.geometry.clone(), this.createModelMaterial() );
				const newSlicerObject = this.createNewSlicerObject( this.project, newMesh, slicerObject.originalFileName );

				newSlicerObject.config.heightAboveBuildplate = slicerObject.config.heightAboveBuildplate;

				placeObject( newSlicerObject, i, j );

			}

		}

		function placeObject( obj, i, j ) {

			obj.dummyTransformObject.position.x = offsetX + i * ( sizeX + separationX );
			obj.dummyTransformObject.position.z = offsetZ + j * ( sizeZ + separationZ );

			obj.dummyTransformObject.quaternion.copy( slicerObject.dummyTransformObject.quaternion );
			obj.dummyTransformObject.scale.copy( slicerObject.dummyTransformObject.scale );

			scope.objectTransformChanged( obj );

		}

	}

	processInputMesh( mesh ) {

		// Merge all geometries inside the mesh tree into one geometry.

		const geometries = [ ];
		mesh.updateMatrixWorld( true );
		mesh.traverse( ( childMesh ) => {

			if ( childMesh.isMesh ) {

				const geometry = childMesh.geometry;

				geometry.applyMatrix4( childMesh.matrixWorld );

				//const geometryMerged = BufferGeometryUtils.mergeVertices( geometry, 0.001 );
				const geometryMerged = geometry;

				// Add empty UV attribute
				if ( ! geometryMerged.attributes[ 'uv' ] ) {

					const numVerts = geometryMerged.attributes[ 'position' ].count;
					const array = new Float32Array( numVerts * 2 );
					array.fill( 0 );
					geometryMerged.setAttribute( 'uv', new Float32BufferAttribute( array, 2 ) );

				}

				geometries.push( geometryMerged );

			}

		} );

		if ( geometries.length === 0 ) {

			this.userMessage( "The model does not contain geometry.", "error" );
			return;

		}

		const mergedGeometry = Slicer.mergeBufferGeometries( geometries );
		if ( ! mergedGeometry ) {

			this.userMessage( "Error merging into one geometry the model file.", "error" );
			return;

		}

		mesh = new Mesh( mergedGeometry, this.createModelMaterial() );

		// Centers the geometry using the bounding box.
		this.bbox1.setFromObject( mesh );
		this.bbox1.getCenter( this.vec31 );
		this.vec31.negate();
		mesh.geometry.translate( this.vec31.x, this.vec31.y, this.vec31.z );;

		return mesh;

	}

	createModelMaterial() {

		return new MeshPhongMaterial( {
			color: this.selectedObjectColor,
			flatShading: true,
			clippingPlanes: [ this.layerClippingPlane ],
			clipIntersection: true
		} );

	}

	mergeGeometries() {

		const geometries = [ ];
		const matrices = [ ];

		for ( let i = 0, l = this.project.slicerObjects.length; i < l; i ++ ) {

			const obj = this.project.slicerObjects[ i ];
			geometries.push( obj.mesh.geometry );
			matrices.push( obj.mesh.matrix );

		}

		if ( geometries.length === 0 ) return null;

		return Slicer.mergeGeometries( geometries, matrices );
	}

	computeSlicePreview() {

		if ( this.jobManagerIsBusy ) {

			this.layerPlaneUpdateRequest = true;
			return;

		}
		this.jobManagerIsBusy = true;
		this.layerPlaneUpdateRequest = false;

		const scope = this;

		const printSettings = this.gui.getSettingsFromGUI();

		this.layerClippingPlaneCurrentLayer = Math.floor( this.layerPlaneView.position.y / printSettings.layerHeight );
		const h = ( this.layerClippingPlaneCurrentLayer + 0.5 ) * printSettings.layerHeight;
		this.layerPlaneView.position.y = h;
		this.layerClippingPlane.constant = h;

		const mergedGeometry = this.mergeGeometries();

		if ( ! mergedGeometry  ) {

			Slicer.paintImageInCanvas( 88, 107, 228, null, this.canvas, this.canvasCtx, this.canvasImageData );

			this.layerCanvasTexture.needsUpdate = true;

			this.jobManagerIsBusy = false;

			return;

		}

		const layerIndex = this.layerClippingPlaneCurrentLayer;

		// Init print
		this.jobManager.postInitMessageToAllWorkers( {
			geometry: GeometrySerializer.serialize( mergedGeometry ),
			images: this.project.images,
			printSettings: printSettings
		} );

		// Execute slicing job for the layer
		scope.jobManager.executeJob( {
			parameters: {
				jobType: 'sliceLayer',
				layerIndex: layerIndex,
				resultTypePNGContent: false
			},
			onProgress: null,
			onResult: ( sliceLayerResult ) => {

				Slicer.paintImageInCanvas( 88, 107, 228, sliceLayerResult.image, scope.canvas, scope.canvasCtx, scope.canvasImageData );

				scope.layerCanvasTexture.needsUpdate = true;

				mergedGeometry.dispose();

				scope.jobManagerIsBusy = false;

				scope.render();

			}

		} );

	}

	getPreviewImages( callback ) {

		const scope = this;

		const frameBufferContents = this.renderer.domElement.toDataURL();
		const frameBufferImg = document.createElement( 'img' );
		frameBufferImg.addEventListener( 'load', () => {

			scope.paintImageElementInCanvas( frameBufferImg, scope.canvasThumbnail, scope.canvasThumbnailCtx );
			scope.paintImageElementInCanvas( frameBufferImg, scope.canvasThumbnailCropped, scope.canvasThumbnailCroppedCtx  );
			const previewImage = encode( {
				width: scope.canvasThumbnail.width,
				height: scope.canvasThumbnail.height,
				data: scope.canvasThumbnailCtx.getImageData( 0, 0, scope.canvasThumbnail.width, scope.canvasThumbnail.height ).data,
				depth: 8,
				channels: 4
			} );

			const previewImageCropped = encode( {
				width: scope.canvasThumbnailCropped.width,
				height: scope.canvasThumbnailCropped.height,
				data: scope.canvasThumbnailCroppedCtx.getImageData( 0, 0, scope.canvasThumbnailCropped.width, scope.canvasThumbnailCropped.height ).data,
				depth: 8,
				channels: 4
			} );

			callback( previewImage, previewImageCropped );

		} );

		frameBufferImg.src = frameBufferContents;

	}

	paintImageElementInCanvas( imageElement, canvas, canvasCtx ) {

		canvasCtx.fillStyle = 'black';
		canvasCtx.fillRect( 0, 0, canvas.width, canvas.height );

		const imageAspect = imageElement.width / imageElement.height;
		const canvasAspect = canvas.width / canvas.height;

		let sx = 0;
		let sy = 0;
		let sWidth = 0;
		let sHeight = 0;
		if ( imageAspect > canvasAspect ) {

			sWidth = imageElement.width;
			sx = 0;

			sHeight = imageElement.height * imageAspect / canvasAspect;
			sy = 0.5 * ( imageElement.height - sHeight );
		}
		else {

			sHeight = imageElement.height;
			sy = 0;

			sWidth = imageElement.width / ( imageAspect / canvasAspect );
			sx = 0.5 * ( imageElement.width - sWidth );

		}

		canvasCtx.drawImage( imageElement, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height );

	}

	getPreviewImagesAndSlice() {

		const scope = this;

		this.getPreviewImages( ( previewImage, previewImageCropped ) => {

			this.computeCompleteSlice( previewImage, previewImageCropped );

		} );

	}

	computeCompleteSlice( previewImage, previewImageCropped ) {

		const scope = this;

		if ( this.jobManagerIsBusy || this.gui.saveResinPrintDialogShown ) {

			this.gui.makeInfoDialog( 600, "Can't slice, please wait for current task.", null, "OK" );
			return;

		}
		this.jobManagerIsBusy = true;

		this.cancelSliceFlag = false;

		// Merge all objects geometries into one

		const mergedGeometry = this.mergeGeometries();

		if ( ! mergedGeometry  ) {

			this.gui.makeInfoDialog( 800, "There are no objects in the build plate, please load models.", null, "OK", () => { scope.jobManagerIsBusy = false; } );
			this.jobManagerIsBusy = false;
			return;

		}

		mergedGeometry.computeBoundingBox();

		// Init print result data

		const printSettings = this.gui.getSettingsFromGUI();

		this.resinPrint = new ResinPrint();
		this.resinPrint.printSettings = printSettings;
		const gcode = new ResinGCode( '' );
		if ( getFilenameExtension( printSettings.fileName ).toLowerCase() !== 'mince' ) {

			this.gui.makeInfoDialog( 800, "File name must have '.mince' extension.", null, "OK" );
			this.jobManagerIsBusy = false;
			return;

		}
		const settingsError = gcode.checkSettings( printSettings );
		if ( settingsError ) {

			this.gui.makeInfoDialog( 800, "Invalid print setting: ", settingsError, "OK" );
			this.jobManagerIsBusy = false;
			return;

		}
		this.resinPrint.previewImage = previewImage;
		this.resinPrint.previewImageCropped = previewImageCropped;
		this.resinPrint.pngLayers = [ ];
		const pngLayers = this.resinPrint.pngLayers;

		// Compute num layers to process

		const maxLayerToCompute = Math.max(
			0,
			Math.min(
				Math.ceil( mergedGeometry.boundingBox.max.y ) / printSettings.layerHeight,
				Math.floor( printSettings.machineZ / printSettings.layerHeight )
			)
		);
		const numLayers = maxLayerToCompute + 1;
		let numProcessedLayers = 0;

		if ( this.cancelSliceFlag ) {

			finishUp();
			return;

		}

		// Init print jobs

		this.jobManager.postInitMessageToAllWorkers( {
			geometry: GeometrySerializer.serialize( mergedGeometry ),
			images: this.project.images,
			printSettings: printSettings
		} );

		// Create dialog

		const sliceDialog = this.gui.createSliceDialog( numLayers, onCancelSlicing );

		function onCancelSlicing() {

			scope.cancelSliceFlag = true;

		}

		// Start job set to compute the slicing

		let numNonZeroPixels = 0;
		let stopSendingJobs = false;
		let firstZeroLayer = null;
		let guiLastLayerUpdated = -1;
		const t0 = new Date();

		this.jobManager.executeJobSet(
			// Num jobs
			numLayers,
			// New job function
			function ( jobIndex ) {

				if ( scope.cancelSliceFlag ) stopSendingJobs = true;

				const layerIndex = jobIndex;

				if ( ( layerIndex > maxLayerToCompute ) || stopSendingJobs ) {

					// Stop sending layer jobs
					return null;

				}

				return {
					jobType: 'sliceLayer',
					layerIndex: layerIndex,
					resultTypePNGContent: true
				};

			},
			// Job result function
			function ( result ) {

				// Slice cancelled, don't use this layer result
				if ( scope.cancelSliceFlag ) return;

				const layerNumNonZeroPixels = result.numNonZeroPixels;
				const layerIndex = result.layerIndex;

				// Already found a black layer, don't use this layer result
				if ( firstZeroLayer !== null && firstZeroLayer < layerIndex ) return;

				if ( layerNumNonZeroPixels === 0 ) {

					// Black layer found

					stopSendingJobs = true;

					if ( firstZeroLayer === null || firstZeroLayer > layerIndex ) firstZeroLayer = layerIndex;

					return;

				}

				numProcessedLayers ++;
				numNonZeroPixels += layerNumNonZeroPixels;

				// Store result pngLayerData
				pngLayers[ layerIndex ] = result.pngLayerData;

				// Update progress bar

				const layerIndex10 = Math.round( ( layerIndex + 1 )/ 10 );
				if ( guiLastLayerUpdated !== layerIndex10 ) {

					sliceDialog.onProgress( numProcessedLayers, numLayers );
					guiLastLayerUpdated = layerIndex10;

				}

			},
			// All jobs completed function
			function() {

				let resinPrintNumLayers = pngLayers.length;

				sliceDialog.onProgress( resinPrintNumLayers, resinPrintNumLayers );

				if ( scope.cancelSliceFlag ) {

					finishUp();
					return;

				}

				// Check all layers are set
				for ( let i = 0; i < resinPrintNumLayers; i ++ ) {

					if ( ! scope.resinPrint.pngLayers[ i ] ) {

						resinPrintNumLayers = i;
						scope.resinPrint.pngLayers.slice( resinPrintNumLayers, scope.resinPrint.pngLayers.length - resinPrintNumLayers );
						break;

					}

				}


				// Final print processing

				// Set resin print results in settings

				printSettings.totalLayer = resinPrintNumLayers;
				printSettings.machineZ = resinPrintNumLayers * printSettings.layerHeight;

				// Seconds
				printSettings.estimatedPrintTime = scope.resinPrint.estimatePrintTime( resinPrintNumLayers );

				// Take into account non-cubic voxels.
				const voxelX = printSettings.machineX / printSettings.resolutionX;
				const voxelY = printSettings.machineY / printSettings.resolutionY;
				const voxelZ = printSettings.layerHeight;
				const voxelVolumeMM3 = voxelX * voxelY * voxelZ;
				// cm³ or ml
				printSettings.volume = ( voxelVolumeMM3 * numNonZeroPixels ) / 1000;

				// Grams
				printSettings.weight = printSettings.volume * printSettings.resinDensity;

				// Coin units
				printSettings.price = printSettings.weight * printSettings.resinPriceKg;

				finishUp();

			}
		);

		function getTotalTimeString() {

			return "Total time: " + roundTo2Digits( ( ( new Date() ) - t0 ) / 1000 ) + " seconds.";

		}

		function finishUp() {

			scope.jobManagerIsBusy = false;

			if ( scope.cancelSliceFlag ) {

				scope.resinPrint = null;
				scope.userMessage( "Slicing cancelled. " + getTotalTimeString(), 'warning' );

			}
			else {

				scope.userMessage( "Slicing completed. " + getTotalTimeString() );

			}

			mergedGeometry.dispose();

			sliceDialog.close();

			if ( ! scope.cancelSliceFlag ) {

				// Show slice results dialog with save and close buttons
				scope.gui.createSliceResultDialog( scope.resinPrint, onSave, onCancel );

			}

		}

		function onSave() {

			// Save the resin print zip

			const infoProgressBarDialog = makePanelUI( 600 );
			document.body.appendChild( infoProgressBarDialog.div );

			makeControllerReadOnly( makeButton( infoProgressBarDialog.uiController, "Compressing ZIP data..." ) );

			const progressBar = makeProgressBar( infoProgressBarDialog.uiController, "Completed %" );

			function onProgress( completed, total ) {

				progressBar.setProgress( 100 * completed / total );

			}

			scope.resinPrint.getZipFileData( onProgress, ( blob ) => {

				deletePanelUI( infoProgressBarDialog );
				document.body.removeChild( infoProgressBarDialog.div );

				saveFile( removeFilenameExtension( printSettings.fileName ) + '.zip', blob );

			} );

		}

		function onCancel() {

			scope.resinPrint = null;

		}

	}

	loadImage( file ) {

		const scope = this;

		const fileName = file.name;

		// Set image name avoiding duplicates
		let name = fileName;
		let i = 1;
		while ( this.gui.findObjectUIByName( name ) !== null ) {

			name = fileName + ' (' + ( i ++ ) + ')';

		}

		let mimeType = null;
		switch ( getFilenameExtension( fileName ).toLowerCase() ) {

			case 'png':
				mimeType = 'image/png';
				break;
			case 'jpg':
			case 'jpeg':
			case 'jfif':
			case 'pjpeg':
			case 'pjp':
				mimeType = 'image/jpeg';
				break;

			case 'gif':
				mimeType = 'image/gif';
				break;

			case 'webp':
				mimeType = 'image/webp';
				break;

			default:
				this.showUserMessage( "Image file extension not recognized: '." + extension + "'.", "error" );
				return;
		}

		const imageElement = document.createElement( 'img' );

		imageElement.onload = ( event ) => {

			const width = imageElement.width;
			const height = imageElement.height;

			const imageCanvas = document.createElement( 'canvas' );
			imageCanvas.width = width;
			imageCanvas.height = height;
			const imageCanvasCtx = imageCanvas.getContext( '2d' );
			imageCanvasCtx.drawImage( imageElement, 0, 0 );
			const pixelData = imageCanvasCtx.getImageData( 0, 0, width, height ).data;
			const imageData = Slicer.createImage( width, height );
			for ( let i = 0, p = 0, l = width * height; i < l; i ++, p += 4 ) {

				imageData[ i ] = Math.round( (
					pixelData[ p ] +
					pixelData[ p + 1 ] +
					pixelData[ p + 2 ]
				) / 3 );

			}

			const image = {
				isImage: true,
				name: name,
				fileName: fileName,
				mimeType: mimeType,
				width: width,
				height: height,
				data: imageData
			};

			scope.project.images[ name ] = image;

			scope.gui.addImageToUI( image );

			scope.selectImage( image );

			scope.userMessage( "Image file '" + name + "' loaded." );

		};

		imageElement.src = URL.createObjectURL( file );

	}

	deleteImage( image ) {

		if ( ! this.project.images[ image.name ] ) return;

		this.selectedImage = null;

		this.gui.removeImageFromUI( image );

		delete this.project.images[ image.name ];

		this.userMessage( "" );

		this.layerPlaneViewIsDirty = true;
		this.render();

	}

	/*
	animate() {

		requestAnimationFrame( () => { this.animate() } );

		...

	}
	*/

	render() {

		if ( this.layerPlaneView && this.layerPlaneView.visible && ( this.layerPlaneViewIsDirty || this.layerPlaneUpdateRequest ) ) {

			this.layerPlaneViewIsDirty = false;
			this.computeSlicePreview();

		}

		this.renderer.render( this.scene, this.camera );

	}

	userMessage( message, type ) {

		// Type: "info", "warning" or "error" (undefined defaults to "info")

		if ( message === null ) return;

		switch ( type ) {

			case undefined:
			case "info":
				this.gui.userMessageInfo( message );
				break;

			case "warning":
				this.gui.userMessageWarning( message );
				console.warn( "MinceSlicer warning: " + message );
				break;

			case "error":
				this.gui.userMessageError( message );
				console.warn( "MinceSlicer error: " + message );
				break;

		}

	}

}

export { MinceSlicer };
