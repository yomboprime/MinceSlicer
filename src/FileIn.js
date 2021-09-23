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
	Mesh,
	MeshPhongMaterial
} from 'three';

import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

import { Project } from './Project.js';
import { ResinPrint } from './slicing/ResinPrint.js';
import { getFilenameExtension, removeFilenameExtension } from './utils/utils.js';
import { saveFile } from './ui/uiUtils.js';

class FileIn {

	constructor( minceSlicer ) {

		this.minceSlicer = minceSlicer;

	}

	onFilesLoaded( files ) {

		if ( ! files || files.length === 0 ) return;

		if ( this.minceSlicer.jobManagerIsBusy ) {

			this.minceSlicer.gui.makeInfoDialog( 600, "Can't load files, please wait for current task.", null, "OK" );
			return;

		}

		let thereIsModel = false;
		let thereIsProject = false;

		for ( let i = 0; i < files.length; i ++ ) {

			const extension = getFilenameExtension( files[ i ].name ).toLowerCase();

			switch ( extension ) {

				case 'mince':
					thereIsProject = true;
					break;

				case 'dae':
				case 'glb':
				case 'stl':
				case 'obj':
				case 'png':
				case 'jpg':
				case 'jpeg':
				case 'jfif':
				case 'pjpeg':
				case 'pjp':
				case 'gif':
				case 'webp':
					thereIsModel = true;

					break;

				default:
					this.minceSlicer.userMessage( "Unrecognized file name extension: '" + extension + "'. File loading was aborted.", "error" );
					return;

			}

		}

		if ( thereIsModel ) {

			if ( thereIsProject ) {

				this.minceSlicer.userMessage( "You selected an asset file and a project file. Please load only one project file or multiple assets.", "error" );
				return;

			}

		}
		else {

			if ( thereIsProject && files.length > 1 ) {

				this.minceSlicer.userMessage( "You selected more than one project file. Please load only one of them.", "error" );
				return;

			}

		}

		for ( let i = 0; i < files.length; i ++ ) {

			const extension = getFilenameExtension( files[ i ].name ).toLowerCase();

			switch ( extension ) {

				case "mince":
					this.loadProjectFile( files[ i ] );
					break;

				case "dae":
				case "glb":
				case "stl":
				case "obj":
					this.loadModel( files[ i ], extension );
					break;

				case 'png':
				case 'jpg':
				case 'jpeg':
				case 'jfif':
				case 'pjpeg':
				case 'pjp':
				case 'gif':
				case 'webp':
					this.loadImage( files[ i ] );
					break;
			}

		}

	}

	loadProjectFile( file ) {

		const scope = this;

		if ( this.minceSlicer.jobManagerIsBusy ) {

			this.minceSlicer.gui.makeInfoDialog( 600, "Can't save project, please wait for current task.", null, "OK" );
			return;

		}

		this.minceSlicer.gui.makeSelectItemsFromProjectDialog( ( selectedItems ) => {

			this.minceSlicer.selectSlicerObject( null );
			if ( selectedItems.loadObjects ) this.minceSlicer.clearBuildPlate();

			const loadProjectDialog = scope.minceSlicer.gui.makeSimpleProgressDialog( "Loading '" + file.name + "' project file... " );

			Project.fromZIPFileContents(
				file,
				scope.minceSlicer,
				selectedItems.loadObjects,
				selectedItems.loadImages,
				loadProjectDialog.onProgress,
				( err, project, settings, jsonAltered ) => {

					loadProjectDialog.close();

					if ( err ) {

						scope.minceSlicer.userMessage( "Error loading file '" + file.name + "': " + err, "error" );
						return;

					}

					const newSettings = scope.minceSlicer.gui.getSettingsFromGUI();

					if ( selectedItems.loadMachineSettings ) assignSettings( scope.minceSlicer.gui.machineSettingsNames );
					if ( selectedItems.loadPrintSettings ) assignSettings( scope.minceSlicer.gui.printSettingsNames );
					if ( selectedItems.loadReliefPresets ) {

						// Merge loaded presets with existing
						Object.keys( settings.reliefPresets ).forEach( ( presetName ) => {

							newSettings.reliefPresets[ presetName ] = settings.reliefPresets[ presetName ];

						} );

					}
					newSettings[ 'fileName' ] = file.name;

					// Store the loaded project in the application
					scope.minceSlicer.gui.setSettingsToGUI( newSettings );
					scope.minceSlicer.project = project;

					scope.minceSlicer.gui.updateControllersRecursive( scope.minceSlicer.gui.folderMachineSettings );
					scope.minceSlicer.gui.updateControllersRecursive( scope.minceSlicer.gui.folderPrintSettings );
					scope.minceSlicer.gui.updateControllersRecursive( scope.minceSlicer.gui.folderGlobalSettings );

					// Update 3d ui
					scope.minceSlicer.setBuildPlateScale();
					scope.minceSlicer.setLCDResolution();

					scope.minceSlicer.userMessage( "Project file '" + file.name + "' loaded successfully." );

					function assignSettings( settingsNames ) {

						settingsNames.forEach( ( settingName ) => {

							newSettings[ settingName ] = settings[ settingName ];

						} );

					}
				}
			);

		} )

	}

	saveProjectFile() {

		if ( this.minceSlicer.jobManagerIsBusy ) {

			this.minceSlicer.gui.makeInfoDialog( 600, "Can't save project, please wait for current task.", null, "OK" );
			return;

		}

		const saveProjectDialog = this.minceSlicer.gui.makeSimpleProgressDialog( "Saving .mince project file... " );

		const settings = this.minceSlicer.gui.getSettingsFromGUI();

		this.minceSlicer.project.toZIPFileContents(
			settings,
			saveProjectDialog.onProgress,
			( zipFileContentsBlob ) => {

				saveFile( settings.fileName, zipFileContentsBlob );
				saveProjectDialog.close();
				this.minceSlicer.userMessage( "Project file saved successfully." );
			}
		);

	}

	loadZIPResinPrint( file ) {

		// This only loads the settings, not the print contents

		const scope = this;

		const resinPrint = new ResinPrint();
		resinPrint.loadSettingsFromZipFile( file, ( error ) => {

			if ( error ) {

				makeInfoDialog( 600, "Error loading ZIP file: " + error, null, "OK" );
				return;

			}

			scope.minceSlicer.gui.setSettingsToGUI( resinPrint.printSettings );

			scope.minceSlicer.setBuildPlateScale();
			scope.minceSlicer.setLCDResolution();

			const message = "Successfully loaded settings from ZIP resin print file '" + file.name + "'.";
			scope.minceSlicer.userMessage( message );
			scope.minceSlicer.gui.makeInfoDialog( 800, message, null, "OK" );

		} );

	}

	loadModel( file, extension ) {

		const scope = this;
		const reader = new FileReader();

		reader.onload = function( e ) {

			const fileContents = e.target.result;

			let mesh = null;
			switch ( extension ) {

				case 'dae':
					scope.parseColladaModel( fileContents, onModelParsed );
					break;

				case 'glb':
					scope.parseGLTFModel( fileContents, onModelParsed );
					break;

				case 'stl':
					scope.parseSTLModel( fileContents, onModelParsed );
					break;

				case 'obj':
					scope.parseOBJModel( fileContents, onModelParsed );
					break;

			}

			function onModelParsed( mesh ) {

				if ( ! mesh ) {

					scope.minceSlicer.gui.makeInfoDialog( 600, "Error parsing model file '" + file.name + "'.", null, "OK" );
					return;

				}

				if ( scope.minceSlicer.project.slicerObjects.length === 0 ) {

					scope.minceSlicer.gui.setFilename( removeFilenameExtension( file.name ) + '.mince' );

				}

				const slicerObject = scope.minceSlicer.createNewSlicerObject( scope.minceSlicer.project, mesh, file.name );

				scope.minceSlicer.gui.findObjectUI( slicerObject ).uiController.setValue( true );

				scope.minceSlicer.userMessage( "Model file '" + file.name + "' loaded." );

			}

		}

		reader.onerror = function( e ) {

			scope.minceSlicer.gui.makeInfoDialog( 600, "Error loading model file '" + file.name + "'." + error, null, "OK" );

		};

		switch ( extension ) {

			case 'glb':
			case 'stl':

				reader.readAsArrayBuffer( file );
				break;

			case 'dae':
			case 'obj':
				reader.readAsText( file );
				break;

		}

	}

	loadImage( file ) {

		this.minceSlicer.loadImage( file );

	}

	parseColladaModel( fileContents, onModelParsed ) {

		const collada = new ColladaLoader().parse( fileContents );

		const result = ( ! collada || ! collada.scene ) ? null : collada.scene;

		onModelParsed( result );

	}

	parseGLTFModel( fileContents, onModelParsed ) {

		const gltf = new GLTFLoader().parse( fileContents, "",
			( gltf ) => {

				const result = ( ! gltf ) || ( ! gltf.scene ) ? null : gltf.scene;
				onModelParsed( result );

			},
			( error ) => {

				onModelParsed( null );

			}
		);

	}

	parseSTLModel( fileContents, onModelParsed ) {

		const geometry = new STLLoader().parse( fileContents );

		if ( ! geometry ) {

			onModelParsed( null );
			return;

		}

		geometry.rotateX( - Math.PI * 0.5 );

		const mesh = new Mesh( geometry, new MeshPhongMaterial() );

		onModelParsed( mesh );

	}

	parseOBJModel( fileContents, onModelParsed ) {

		const mesh = new OBJLoader().parse( fileContents );

		if ( ! mesh ) {

			onModelParsed( null );
			return;

		}

		onModelParsed( mesh );

	}

}

export { FileIn };