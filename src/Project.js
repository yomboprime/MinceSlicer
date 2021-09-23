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

import { Mesh } from 'three';

import { unzip } from 'unzipit';
import * as zip from '@zip.js/zip.js';
import { GeometrySerializer } from './utils/GeometrySerializer.js';

class Project {

	constructor() {

		this.nextSlicerObjectId = 0;

		this.slicerObjects = [ ];

		this.images = {
			"None": Project.getNoneTexture()
		};

	}

	toZIPFileContents( settings, onProgress, onResult ) {

		const scope = this;

		delete settings.showBuildVolumeBox;
		delete settings.isLicenseAccepted;
		delete settings.maxWorkers;
		delete settings.maxDistance;

		const projectJSON = {
			comment: "Mince Slicer Project File",
			projectFileVersion: 1,
			nextSlicerObjectId: this.nextSlicerObjectId,
			objects: [],
			images: [],
			settings: settings
		};

		const numSlicerObjects = this.slicerObjects.length;
		for ( let o = 0; o < numSlicerObjects; o ++ ) {

			const obj = this.slicerObjects[ o ];

			const objectJSON = {
				id: obj.id,
				displayName: obj.displayName,
				originalFileName: obj.originalFileName,
				config: {
					buildplatePosition: [
						obj.config.buildplatePosition.x,
						obj.config.buildplatePosition.y
					],
					heightAboveBuildplate: obj.config.heightAboveBuildplate,
					rotationQuaternion: [
						obj.config.rotationQuaternion.x,
						obj.config.rotationQuaternion.y,
						obj.config.rotationQuaternion.z,
						obj.config.rotationQuaternion.w
					],
					scale: [
						obj.config.scale.x,
						obj.config.scale.y,
						obj.config.scale.z
					],
				},
				hasIndex: obj.mesh.geometry.getIndex() !== null,
				groups: GeometrySerializer.serializeGroups( obj.mesh.geometry )			};

			projectJSON.objects.push( objectJSON );

		}

		const imagesNames = Object.keys( scope.images );
		for ( let i = 0, l = imagesNames.length; i < l; i ++ ) {

			if ( imagesNames[ i ] === "None" ) {

				imagesNames.splice( i, 1 );
				break;

			}

		}
		const numImages = imagesNames.length;
		for ( let i = 0; i < numImages; i ++ ) {

			const image = this.images[ imagesNames[ i ] ];

			const imageJSON = {
				name: image.name,
				fileName: image.fileName,
				mimeType: image.mimeType,
				width: image.width,
				height: image.height
			};

			projectJSON.images.push( imageJSON );

		}

		const total = 1 + numSlicerObjects + numImages;

		onProgress( 0, total );

		// Create zip file
		const blobWriter = new zip.BlobWriter( "application/zip" );
		const writer = new zip.ZipWriter( blobWriter );

		// Add project json file to zip
		writer.add( "project.json", new zip.TextReader( JSON.stringify( projectJSON, null, 4 ) ) ).then( () => {

			onProgress( 1, total );
			addObjectToZIP( 0 );

		} );

		function addObjectToZIP( objectIndex ) {

			if ( objectIndex >= numSlicerObjects ) {

				addImageToZIP( 0 );
				return;

			}

			const obj = scope.slicerObjects[ objectIndex ];
			const serializedGeometry = GeometrySerializer.serialize( obj.mesh.geometry );
			const verticesFileName = "vertices_" + obj.id + ".bin";
			writer.add( verticesFileName, new zip.TextReader( serializedGeometry.position ) ).then( () => {

				const uvsFileName = "uv_" + obj.id + ".bin";
				writer.add( uvsFileName, new zip.TextReader( serializedGeometry.uv ) ).then( () => {

					if ( serializedGeometry.index !== null ) {

						const indexFileName = "index_" + obj.id + ".bin";
						writer.add( indexFileName, new zip.TextReader( serializedGeometry.index ) ).then( () => {

							objectIndex ++;
							onProgress( 1 + objectIndex, total );
							addObjectToZIP( objectIndex );

						} );

					}
					else {

						objectIndex ++;
						onProgress( 1 + objectIndex, total );
						addObjectToZIP( objectIndex );
					}

				} );

			} );
		}

		function addImageToZIP( imageIndex ) {

			if ( imageIndex >= numImages ) {

				finishZIP();
				return;

			}

			const image = scope.images[ imagesNames[ imageIndex ] ];

			if ( image.name === "None" ) {

				imageIndex ++;
				onProgress( 1 + numSlicerObjects + imageIndex, total );
				addImageToZIP( imageIndex );
			}
			else {

				const imageFileName = "image_" + image.name + ".bin";
				writer.add( imageFileName, new zip.TextReader( image.data ) ).then( () => {

					imageIndex ++;
					onProgress( 1 + numSlicerObjects + imageIndex, total );
					addImageToZIP( imageIndex );

				} );

			}

		}

		function finishZIP() {

			writer.close().then( () => {

				const zipFileContentsBlob = blobWriter.getData();
				onResult( zipFileContentsBlob );

			} );

		}

	}

	static fromZIPFileContents( zipFile, minceSlicer, loadObjects, loadImages, onProgress, onResult ) {

		onProgress( 0, 1 );

		unzip( zipFile ).then( ( zipContents ) => {

			onProgress( 1, 100 );

			const projectEntry = zipContents.entries[ 'project.json' ];

			if ( ! projectEntry ) {

				onResult( "ZIP does not contain project.json file." );
				return;

			}

			projectEntry.text().then( ( projectJSONText ) => {

				onProgress( 2, 100 );

				let projectJSON;

				try {

					projectJSON = JSON.parse( projectJSONText );

				} catch ( e ) {

					if ( e instanceof SyntaxError ) onResult( "Syntax error (" + e.lineNumber + ", " + e.columnNumber + "): " + e.message );
					return;

				}


				const jsonAltered = Project.applyVersionPatches( projectJSON );

				// Create project
				const project = new Project();
				project.nextSlicerObjectId = projectJSON.nextSlicerObjectId;

				// Get settings
				const settings = projectJSON.settings;

				const numSlicerObjects = projectJSON.objects.length;
				const imagesNames = Object.keys( projectJSON.images );
				if ( imagesNames.includes( "None" ) ) {
					imagesNames.splice( imagesNames.indexOf( "None" ), 1 );
				}
				const numImages = imagesNames.length;

				const total = 2 + numSlicerObjects + numImages;
				let progress = 2;

				loadObject( 0 );

				function loadObject( objectIndex ) {

					if ( objectIndex >= numSlicerObjects ) {

						loadImage( 0 );
						return;

					}

					const objectJSON = projectJSON.objects[ objectIndex ];

					const verticesFileName = "vertices_" + objectJSON.id + ".bin";
					const verticesEntry = zipContents.entries[ verticesFileName ];
					if ( ! verticesEntry ) {

						onResult( "ZIP does not contain vertices file." );
						return;

					}

					verticesEntry.arrayBuffer().then( ( verticesArray ) => {

						const uvsFileName = "uv_" + objectJSON.id + ".bin";

						const uvsEntry = zipContents.entries[ uvsFileName ];
						if ( ! uvsEntry ) {

							onResult( "ZIP does not contain uv file." );
							return;

						}

						uvsEntry.arrayBuffer().then( ( uvsArray ) => {

							if ( objectJSON.hasIndex ) {

								const indexFileName = "index_" + objectJSON.id + ".bin";

								const indexEntry = zipContents.entries[ indexFileName ];
								if ( ! indexEntry ) {

									onResult( "ZIP does not contain index file." );
									return;

								}

								indexEntry.arrayBuffer().then( ( indexArray ) => {

									const geometrySerialized = {
										position: new Float32Array( verticesArray ),
										uv: new Float32Array( uvsArray ),
										index: new Uint32Array( indexArray ),
										groups: objectJSON.groups
									}

									finishObject( geometrySerialized );

								} );
							}
							else {

								const geometrySerialized = {
									position: new Float32Array( verticesArray ),
									uv: new Float32Array( uvsArray ),
									index: null,
									groups: objectJSON.groups
								}

								finishObject( geometrySerialized );
							}

							function finishObject( geometrySerialized ) {

								const geometry = GeometrySerializer.deserialize( geometrySerialized );
								const mesh = new Mesh( geometry, minceSlicer.createModelMaterial() );

								const slicerObject = minceSlicer.createNewSlicerObject(
									project,
									mesh,
									objectJSON.originalFileName,
									objectJSON.displayName,
									objectJSON.id
								);

								const objConfig = objectJSON.config;

								slicerObject.config.heightAboveBuildplate = objConfig.heightAboveBuildplate;

								slicerObject.dummyTransformObject.position.set(
									objConfig.buildplatePosition[ 0 ],
									0,
									objConfig.buildplatePosition[ 1 ]
								);

								slicerObject.dummyTransformObject.quaternion.set(
									objConfig.rotationQuaternion[ 0 ],
									objConfig.rotationQuaternion[ 1 ],
									objConfig.rotationQuaternion[ 2 ],
									objConfig.rotationQuaternion[ 3 ]
								);

								slicerObject.dummyTransformObject.scale.set(
									objConfig.scale[ 0 ],
									objConfig.scale[ 1 ],
									objConfig.scale[ 2 ]
								);

								minceSlicer.objectTransformChanged( slicerObject );

								onProgress( ++ progress, total );

								loadObject( objectIndex + 1 );

							}

						} );

					} );

				}

				function loadImage( imageIndex ) {

					if ( imageIndex >= numImages ) {

						finish();
						return;

					}

					const imageJSON = projectJSON.images[ imagesNames[ imageIndex ] ];

					const imageDataFileName = "image_" + imageJSON.name + ".bin";
					const imageDataEntry = zipContents.entries[ imageDataFileName ];
					if ( ! imageDataEntry ) {

						onResult( "ZIP does not contain image file." );
						return;

					}

					imageDataEntry.arrayBuffer().then( ( imageDataArray ) => {

						imageJSON.isImage = true;
						imageJSON.data = new Uint8Array( imageDataArray );
						project.images[ imageJSON.name ] = imageJSON;
						minceSlicer.gui.addImageToUI( imageJSON );
						onProgress( ++ progress, total );
						loadImage( imageIndex + 1 );

					} );

				}

				function finish() {

					onResult( null, project, settings, jsonAltered );

				}

			} );

		} );

	}

	static getNoneTexture() {

		return {
			isImage: true,
			name: "None",
			fileName: "None",
			mimeType: "None",
			width: 0,
			height: 0,
			data: null
		};

	}

	static applyVersionPatches( projectJSON ) {

		// Current version: 1

		// Returns true if json was altered.

		return false;

	}
}

export { Project };
