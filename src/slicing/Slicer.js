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
	Matrix4,
	Box3,
	Triangle,
	Mesh,
	Raycaster,
	MeshPhongMaterial,
	SphereGeometry,
	DoubleSide,
	BackSide,
	BufferGeometry
} from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { MeshBVH } from 'three-mesh-bvh';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';

import { PseudoRandomGenerator, CachedRandomGenerator } from '../utils/Random.js';
import { reliefNodeClasses } from '../nodes/reliefNodeClasses.js';
import { ReliefNode } from '../nodes/ReliefNode.js';
import { ReliefNodeConstant } from '../nodes/ReliefNodeConstant.js';

class Slicer {

	constructor() {

		this.mesh = null;
		this.bvh = null;
		this.settings = null;
		this.raycaster = new Raycaster( new Vector3(), new Vector3( 0, 0, 1 ) );
		this.reliefPreset = null;
		this.reliefNode = null;

		// Temp variables

		this.voxelPosition = new Vector3();
		this.closestPoint = new Vector3();
		this.closestUVDistance = new Vector3();
		this.closestNormal = new Vector3();
		this.uvCoords = new Vector2();
		this.box3 = new Box3();
		this.matrix4Identity = new Matrix4().identity();
		this.vec31 = new Vector3();

		this.indices = null;
		this.positions = null;
		this.uvs = null;

		this.vA = new Vector3();
		this.vB = new Vector3();
		this.vC = new Vector3();

		this.uvA = new Vector2();
		this.uvB = new Vector2();
		this.uvC = new Vector2();

		this.groups = null;

		this.insideSolidDirection = new Vector3( 1.23456789, 0.123456789, 0.567891234 ).normalize();

	}

	setupPrint( geometry, images, settings ) {

		this.mesh = new Mesh( geometry, new MeshPhongMaterial( { side: DoubleSide } ) );

		this.bvh = 	new MeshBVH( geometry );

		this.settings = settings;

		if ( settings.reliefEnabled ) {

			this.reliefPreset = this.settings.reliefPresets[ this.settings.reliefPresetName ];

			this.context = Slicer.createContext( this.reliefPreset ? this.reliefPreset.randomSeed : 0, images, settings.reliefPresets );

			const reliefNodeJSON = this.reliefPreset ? this.reliefPreset.reliefNodeJSON : null;

			this.reliefNode = ReliefNode.makeReliefTreeFromJSON( reliefNodeJSON, this.context );

			const err = this.reliefNode ? this.reliefNode.isValid() : null;

			if ( this.reliefNode ) {

				if ( err ) {

					console.warn( err );
					this.reliefNode = null;

				}

			}

		}
		else {

			this.reliefNode = null;
			this.context = null;

		}

		if ( ( settings.antialiasingLevel !== 1 ) && ( ! this.reliefNode ) ) {

			// Force rendering with nodes if antialiasing is set

			if ( ! this.context ) {

				this.context = Slicer.createContext( 0, images, settings.reliefPresets );
			}

			this.reliefNode = new ReliefNodeConstant(
				"",
				reliefNodeClasses[ "Constant" ].parameters,
				[ 0 ],
				this.context
			);

		}

		if ( this.reliefNode ) {

			this.indices = this.bvh.geometry.getIndex().array;
			this.positions = this.bvh.geometry.getAttribute( 'position' );
			this.uvs = this.bvh.geometry.getAttribute( 'uv' );
			this.groups = this.bvh.geometry.groups;

		}

	}

	static createContext( randomSeed, images, presets ) {

		const prng = new PseudoRandomGenerator();
		const cachedPrng = new CachedRandomGenerator( 2000000, prng, randomSeed );
		const simplex = new SimplexNoise( cachedPrng );

		return {
			prng: cachedPrng,
			simplex: simplex,
			images: images,
			presets: presets
		};
	}

	sliceLayer( layerIndex, image ) {

		if ( this.reliefNode ) {

			this.sliceLayerWithDistance( layerIndex, image );

		}
		else {

			this.sliceLayerRaycasting( layerIndex, image );

		}

	}

	sliceLayerRaycasting( layerIndex, image ) {

		// Raycast layer section (no antialiasing)

		/*
			Beware different coordinate system axis:
			X in machine is Z in Three.js
			Y in machine is X in Three.js
			Z in machine is Y in Three.js
		*/
		const layerHeight = this.settings.layerHeight;
		const initialRayZ = this.settings.machineX * 0.5 + this.settings.maxDistance;
		const resolutionX = this.settings.resolutionY;
		const resolutionZ = this.settings.resolutionX;
		const voxelXSize = this.settings.machineY / resolutionX;
		const voxelZSize = this.settings.machineX / resolutionZ;
		const initialLayerRayX = this.settings.machineY * 0.5 - voxelXSize * 0.5;
		const pixelOffset = this.settings.machineX * 0.5;

		const mesh = this.mesh;
		const raycaster = this.raycaster;
		const ray = raycaster.ray;
		const bvh = this.bvh;

		ray.direction.set( 0, 0, - 1 );

		// Clear image
		image.fill( 0 );

		// Cast rays across the layer
		for ( let layerRayIndex = 0; layerRayIndex < resolutionX; layerRayIndex ++ ) {

			let x = initialLayerRayX - layerRayIndex * voxelXSize;
			ray.origin.set( x, layerHeight * ( layerIndex + 0.5 ), initialRayZ );

			const intersections = [ ];
			bvh.raycast( mesh, raycaster, ray, intersections );

			// intersects[ i ]. distance point uv face.normal

			intersections.sort( ( a, b ) => {
				if ( a.distance === b.distance ) return 0;
				return a.distance < b.distance ? - 1 : 1;
			} );

			const firstPixelIndex = layerRayIndex * resolutionZ;

			// Set pixels which are inside the solids
			const numIntersections = intersections.length;
			let intersectionIndex0 = 0;
			while ( intersectionIndex0 < numIntersections ) {

				// Find front-facing intersection
				let intersection0;
				while ( intersectionIndex0 < numIntersections ) {

					intersection0 = intersections[ intersectionIndex0 ];

					//const isFrontFacing = intersection0.face.normal.x < 0;
					const isFrontFacing = intersection0.face.normal.dot( ray.direction ) < 0;

					// Found it
					if ( isFrontFacing ) break;

					intersectionIndex0 ++;

				}

				if ( intersectionIndex0 >= numIntersections ) break;

				// Find back-facing intersection after the ray has left all contained solids behind.
				let numSolidsInside = 0;
				let intersectionIndex1 = intersectionIndex0 + 1;
				let intersection1;
				while ( intersectionIndex1 < numIntersections ) {

					intersection1 = intersections[ intersectionIndex1 ];

					//const isFrontFacing = intersection1.face.normal.x < 0;
					const isFrontFacing = intersection1.face.normal.dot( ray.direction ) < 0;

					if ( ! isFrontFacing ) {

						if ( numSolidsInside === 0 ) {
							// Found it
							break;
						}

						numSolidsInside --;

					}
					else numSolidsInside ++;

					intersectionIndex1 ++;

				}

				if ( intersectionIndex1 >= numIntersections ) break;

				var minXIndex = Math.max( 0, Math.min( resolutionZ - 1, Math.round( ( - intersection0.point.z + pixelOffset ) / voxelZSize ) ) );
				var maxXIndex = Math.max( 0, Math.min( resolutionZ - 1, Math.floor( ( - intersection1.point.z + pixelOffset ) / voxelZSize ) ) );

				image.fill( 255, firstPixelIndex + minXIndex, firstPixelIndex + maxXIndex );

				intersectionIndex0 = intersectionIndex1 + 1;

			}

		}

	}

	static isFrontFacingIntersection( intersection, direction ) {

		return intersection.face.normal.dot( direction ) < 0;

	}

	sliceLayerWithDistance( layerIndex, image ) {

		const scope = this;

		// Raycast layer section by computing distance to surface, taking into account relief/emboss texture

		/*
			Beware different coordinate system axis:
			X in machine is Z in Three.js
			Y in machine is X in Three.js
			Z in machine is Y in Three.js
		*/
		const layerHeight = this.settings.layerHeight;
		const resolutionX = this.settings.resolutionY;
		const resolutionZ = this.settings.resolutionX;
		const voxelXSize = this.settings.machineY / resolutionX;
		const voxelZSize = this.settings.machineX / resolutionZ;
		const y = layerHeight * layerIndex;
		const pixelOffsetX = this.settings.machineY * 0.5;
		const pixelOffsetZ = this.settings.machineX * 0.5;
		const antialiasing = Math.floor( this.settings.antialiasingLevel );

		const mesh = this.mesh;
		const raycaster = this.raycaster;
		const ray = this.raycaster.ray;
		const bvh = this.bvh;
		const box3 = this.box3;
		const matrix4Identity = this.matrix4Identity;
		const uvCoords = this.uvCoords;
		const voxelPosition = this.voxelPosition;
		const closestPoint = this.closestPoint;
		const closestUVDistance = this.closestUVDistance;
		const closestNormal = this.closestNormal;

		this.context.prng.setSeed( 0 );

		const reliefNode = this.reliefNode;
		const reliefMaxSize = this.reliefPreset ? this.reliefPreset.maxHeight : 0;

		const subvoxelContribution = 256 / Math.pow( antialiasing, 3 );

		const antialiasingVoxelSizeFactor = antialiasing === 1 ? 1 : 1 + antialiasing * 0.2;
		const antialiasingVoxelSizeX = antialiasingVoxelSizeFactor * voxelXSize;
		const antialiasingVoxelSizeZ = antialiasingVoxelSizeFactor * voxelZSize;
		const antialiasingVoxelSizeY = antialiasingVoxelSizeFactor * layerHeight;
		const subPosXInc = antialiasingVoxelSizeX / antialiasing;
		const subPosZInc = antialiasingVoxelSizeZ / antialiasing;
		const subPosYInc = antialiasingVoxelSizeY / antialiasing;
		const subPosXOffset = 0.5 * voxelXSize - antialiasingVoxelSizeX * 0.5 + 0.5 * subPosXInc;
		const subPosZOffset = 0.5 * voxelZSize - antialiasingVoxelSizeZ * 0.5 + 0.5 * subPosZInc;
		const subPosYOffset = 0.5 * layerHeight - antialiasingVoxelSizeY * 0.5 + 0.5 * subPosYInc;

		// Clear image
		image.fill( 0 );

		function isPointInsideMesh( point ) {

			const intersections = [ ];

			ray.origin.copy( point );
			ray.direction.copy( scope.insideSolidDirection );

			bvh.raycast( mesh, raycaster, ray, intersections );

			intersections.sort( ( a, b ) => {
				if ( a.distance === b.distance ) return 0;
				return a.distance < b.distance ? - 1 : 1;
			} );

			let numSolids = 0;
			for ( let i = 0, il = intersections.length; i < il; i ++ ) {

				const isFrontFacing = intersections[ i ].face.normal.dot( ray.direction ) < 0;

				numSolids += isFrontFacing ? 1 : - 1;
			}

			return numSolids < 0;
		}

		function layerDistanceRecursive( i0, j0, i1, j1 ) {

			// Fill image recursively in quad-partitioned boxes and using distance to surface.

			if ( i1 < i0 || j1 < j0 ) return;

			const di = i1 - i0 + 1;
			const dj = j1 - j0 + 1;

			// Leaf condition
			const leafSizeVoxels = 10;
			if ( di <= leafSizeVoxels || dj <= leafSizeVoxels ) {

				for ( let m = 0; m < di; m ++ ) {

					for ( let n = 0; n < dj; n ++ ) {

						let currentVoxelContribution = 0;

						let vPosY = subPosYOffset;

						for ( let vk = 0; vk < antialiasing; vk ++ ) {

							let vPosX = subPosXOffset;

							for ( let vj = 0; vj < antialiasing; vj ++ ) {

								let vPosZ = subPosZOffset;

								for ( let vi = 0; vi < antialiasing; vi ++ ) {

									scope.voxelPosition.set(
										- ( i0 + m ) * voxelXSize + pixelOffsetX - vPosX,
										y + vPosY,
										( j0 + n ) * voxelZSize - pixelOffsetZ + vPosZ
									);

									// Relief computation

									const materialIndex = scope.closestPointToMesh( voxelPosition, closestPoint, closestUVDistance, closestNormal );

									const isInside = isPointInsideMesh( scope.voxelPosition );
									const distance = closestUVDistance.z * ( isInside ? - 1 : 1 );

									uvCoords.copy( closestUVDistance );

									let nodeValue = reliefNode.evaluate( uvCoords, voxelPosition, closestNormal, materialIndex );
									if ( isNaN( nodeValue ) ) nodeValue = 0;

									const height = Math.max( - 1, Math.min( 1, nodeValue ) ) * reliefMaxSize;

									if ( distance <= height ) {

										// Subvoxel is under the relief surface and hence is solid

										currentVoxelContribution += subvoxelContribution;

									}

									vPosZ += subPosZInc;

								}

								vPosX += subPosXInc;

							}

							vPosY += subPosYInc;

						}

						if ( currentVoxelContribution > 0 ) {

							//image[ ( i0 + m ) * resolutionZ + ( n + j0 ) ] = Math.min( 255, currentVoxelContribution );
							image[ ( i0 + m ) * resolutionZ + ( resolutionZ - ( n + j0 ) - 1 ) ] = Math.min( 255, currentVoxelContribution );

						}

					}

				}

			}
			else {

				const iHalf = Math.floor( ( i0 + i1 ) * 0.5 );
				const jHalf = Math.floor( ( j0 + j1 ) * 0.5 );

				// Check if box collides with mesh

				box3.min.set( - ( i1 + 1 ) * voxelXSize + pixelOffsetX - reliefMaxSize, y - reliefMaxSize, j0 * voxelZSize - pixelOffsetZ - reliefMaxSize );
				box3.max.set( - ( i0 ) * voxelXSize + pixelOffsetX + reliefMaxSize, y + reliefMaxSize, ( j1 + 1 ) * voxelZSize - pixelOffsetZ + reliefMaxSize );
				if ( bvh.intersectsBox( null, box3, matrix4Identity ) ) {

					// Subdivision of box in 4 smaller boxes

					layerDistanceRecursive( i0, j0, iHalf, jHalf );
					layerDistanceRecursive( i0, jHalf + 1, iHalf, j1 );
					layerDistanceRecursive( iHalf + 1, j0, i1, jHalf );
					layerDistanceRecursive( iHalf + 1, jHalf + 1, i1, j1 );

				}
				else {

					// Box does not intersect. If inside the mesh, fill the box entirely.

					box3.getCenter( scope.voxelPosition );
					if ( isPointInsideMesh( scope.voxelPosition ) ) {

						for ( let m = 0; m < di; m ++ ) {

							for ( let n = 0; n < dj; n ++ ) {

								//image[ ( i0 + m ) * resolutionZ + ( n + j0 ) ] = 255;
								image[ ( i0 + m ) * resolutionZ + ( resolutionZ - ( n + j0 ) - 1 ) ] = 255;

							}

						}

					}

				}

			}

		}


		layerDistanceRecursive( 0, 0, resolutionX - 1, resolutionZ - 1 );

	}

	closestPointToMesh( point, targetPos, targetUVDistance, targetNormal, target ) {

		// early out if under minThreshold
		// skip checking if over maxThreshold
		// set minThreshold = maxThreshold to quickly check if a point is within a threshold
		// returns Infinity if no value found
		const minThresholdSq = 0;
		const maxThresholdSq = Infinity;
		let closestDistanceSq = Infinity;
		let closestDistanceTriangleIndex = null;

		const temp = this.vec31;

		this.bvh.shapecast(
			this.mesh,
			{

				boundsTraverseOrder: ( box ) => {

					temp.copy( point ).clamp( box.min, box.max );
					return temp.distanceToSquared( point );

				},

				intersectsBounds: ( box, isLeaf, score ) => {

					return score < closestDistanceSq && score < maxThresholdSq;

				},

				intersectsTriangle: ( tri, triIndex ) => {

					tri.closestPointToPoint( point, temp );
					const distSq = point.distanceToSquared( temp );
					if ( distSq < closestDistanceSq ) {

						targetPos.copy( temp );

						closestDistanceSq = distSq;
						closestDistanceTriangleIndex = triIndex;

					}

					if ( distSq < minThresholdSq ) {

						return true;

					} else {

						return false;

					}

				},

			}

		);

		const a = this.indices[ closestDistanceTriangleIndex * 3 ];
		const b = this.indices[ closestDistanceTriangleIndex * 3 + 1 ];
		const c = this.indices[ closestDistanceTriangleIndex * 3 + 2 ];

		this.vA.fromBufferAttribute( this.positions, a );
		this.vB.fromBufferAttribute( this.positions, b );
		this.vC.fromBufferAttribute( this.positions, c );

		this.uvA.fromBufferAttribute( this.uvs, a );
		this.uvB.fromBufferAttribute( this.uvs, b );
		this.uvC.fromBufferAttribute( this.uvs, c );

		Triangle.getUV(
			targetPos,
			this.vA,
			this.vB,
			this.vC,
			this.uvA,
			this.uvB,
			this.uvC,
			targetUVDistance
		);

		// x, y: uv, z: distance
		targetUVDistance.z = Math.sqrt( closestDistanceSq );

		Triangle.getNormal( this.vA, this.vB, this.vC, targetNormal );

		// find the associated material index
		let materialIndex = 0;
		const firstVertexIndex = closestDistanceTriangleIndex * 3;
		for ( let i = 0, l = this.groups.length; i < l; i ++ ) {

			const group = this.groups[ i ];
			const { start, count } = group;
			if ( firstVertexIndex >= start && firstVertexIndex < start + count ) {

				materialIndex = group.materialIndex;
				break;

			}

		}

		return materialIndex;

	}


	static mergeGeometries( geometries, matrices ) {

		// Merge all geometries into one

		const transformedGeometries = [ ];
		for ( let i = 0, l = geometries.length; i < l; i ++ ) {

			const transformedGeometry = geometries[ i ].clone();
			transformedGeometry.applyMatrix4( matrices[ i ] );
			transformedGeometries.push( transformedGeometry );

		}

		const mergedGeometry = this.mergeBufferGeometries( transformedGeometries );
		if ( ! mergedGeometry ) {

			console.error( "Error merging the models into one geometry." );
			return null;

		}

		return mergedGeometry;

	}

	static mergeBufferGeometries( geometries ) {

		const isIndexed = geometries[ 0 ].index !== null;

		const attributesUsed = new Set( Object.keys( geometries[ 0 ].attributes ) );

		const attributes = {};

		const mergedGeometry = new BufferGeometry();

		let thereAreGroups = false;
		for ( let i = 0; i < geometries.length; ++ i ) {

			const geometry = geometries[ i ];
			if ( geometry.groups.length > 0 ) {

				thereAreGroups = true;
				break;

			}

		}

		let offset = 0;
		let nextGroupId = 0;

		for ( let i = 0; i < geometries.length; ++ i ) {

			const geometry = geometries[ i ];
			let attributesCount = 0;

			// ensure that all geometries are indexed, or none

			if ( isIndexed !== ( geometry.index !== null ) ) {

				console.error( 'Slicer.mergeBufferGeometries() failed with geometry at index ' + i + '. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.' );
				return null;

			}

			// gather attributes, exit early if they're different

			for ( const name in geometry.attributes ) {

				if ( ! attributesUsed.has( name ) ) {

					console.error( 'Slicer.mergeBufferGeometries() failed with geometry at index ' + i + '. All geometries must have compatible attributes; make sure "' + name + '" attribute exists among all geometries, or in none of them.' );
					return null;

				}

				if ( attributes[ name ] === undefined ) attributes[ name ] = [];

				attributes[ name ].push( geometry.attributes[ name ] );

				attributesCount ++;

			}

			// ensure geometries have the same number of attributes

			if ( attributesCount !== attributesUsed.size ) {

				console.error( 'Slicer.mergeBufferGeometries() failed with geometry at index ' + i + '. Make sure all geometries have the same number of attributes.' );
				return null;

			}

			// Create meshgroups

			if ( thereAreGroups ) {

				const jl = geometry.groups.length;

				if ( jl > 0 ) {

					for ( let j = 0; j < jl; j ++ ) {

						const count = geometry.groups[ j ].count;

						mergedGeometry.addGroup( offset, count, nextGroupId ++ );
						offset += count;

					}

				}
				else {


					let count;
					if ( isIndexed ) count = geometry.getIndex().array.length;
					else count = geometry.getAttribute( 'position' ).array.length / 3;

					mergedGeometry.addGroup( offset, count, nextGroupId ++ );
					offset += count;

				}

			}

		}

		// merge indices

		if ( isIndexed ) {

			let indexOffset = 0;
			const mergedIndex = [];

			for ( let i = 0; i < geometries.length; ++ i ) {

				const index = geometries[ i ].index;

				for ( let j = 0; j < index.count; ++ j ) {

					mergedIndex.push( index.getX( j ) + indexOffset );

				}

				indexOffset += geometries[ i ].attributes.position.count;

			}

			mergedGeometry.setIndex( mergedIndex );

		}

		// merge attributes

		for ( const name in attributes ) {

			const mergedAttribute = BufferGeometryUtils.mergeBufferAttributes( attributes[ name ] );

			if ( ! mergedAttribute ) {

				console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed while trying to merge the ' + name + ' attribute.' );
				return null;

			}

			mergedGeometry.setAttribute( name, mergedAttribute );

		}

		return mergedGeometry;

	}


	static createImage( resolutionX, resolutionY ) {

		return new Uint8Array( resolutionX * resolutionY );

	}

	static createSharedImage( resolutionX, resolutionY ) {

		return new SharedArrayBuffer( resolutionX * resolutionY );

	}

	static paintImageInCanvas( r, g, b, image, canvas, canvasCtx, imageData ) {

		// Returns number of pixels different than zero

		if ( image === null ) {

			canvasCtx.fillStyle = 'black';
			canvasCtx.fillRect( 0, 0, canvas.width, canvas.height );
			return 0;

		}

		const data = imageData.data;

		const numPixels = canvas.width * canvas.height;
		let numNonZeroPixels = 0;
		let p = 0;
		for ( let i = 0; i < numPixels; i ++ ) {

			const gray = image[ i ];

			data[ p ] = r;
			data[ p + 1 ] = g;
			data[ p + 2 ] = b;
			data[ p + 3 ] = gray;

			p += 4;

			if ( gray !== 0 ) numNonZeroPixels ++;

		}

		canvasCtx.putImageData( imageData, 0, 0 );

		return numNonZeroPixels;

	}

	countPixelsInImage( image ) {

		const resolutionX = this.settings.resolutionY;
		const resolutionZ = this.settings.resolutionX;

		let numPixels = 0;

		for ( let i = 0, il = resolutionZ * resolutionX; i < il; i ++ ) {

			if ( image[ i ] !== 0 ) numPixels ++;

		}

		return numPixels;

	}

}

export { Slicer };
