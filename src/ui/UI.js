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
	Object3D
} from 'three';

import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

import { removeFilenameExtension, timeInSecondsToHumanString } from '../utils/utils.js';

import {
	saveFile,
	makeButton,
	makeCheckbox,
	makeProgressBar,
	makeControllerReadOnly,
	makePanelUI,
	deletePanelUI
} from './uiUtils.js';

import * as Constants from '../nodes/Constants.js';
import { reliefNodeClasses } from '../nodes/reliefNodeClasses.js';
import { Slicer } from '../slicing/Slicer.js';
import { ReliefNode } from '../nodes/ReliefNode.js';

class MinceSlicerUI {

	constructor( minceSlicer ) {

		this.minceSlicer = minceSlicer;

		this.coresList = [ 1, 2, 3, 4, 5, 6, 7, 15, 23, 31, 63, 127 ];

		this.data = this.loadGUIDataFromLocalStorage();

		if ( this.data === null ) {

			this.data = this.getDefaultUIData();
			this.saveGUIDataToLocalStorage();

		}

		this.machineSettingsNames = [
			"machineType",
			"projectType",
			"layerHeight",
			"resolutionX",
			"resolutionY",
			"machineX",
			"machineY",
			"machineZ",
			"mirror"
		];

		this.printSettingsNames = [
			"resin",
			"resinDensity",
			"resinPriceKg",
			"normalExposureTime",
			"bottomLayExposureTime",
			"bottomLayerExposureTime",
			"normalDropSpeed",
			"normalLayerLiftHeight",
			"zSlowUpDistance",
			"normalLayerLiftSpeed",
			"bottomLayCount",
			"bottomLayerCount",
			"bottomLayerLiftHeight",
			"bottomLayerLiftSpeed",
			"bottomLightOffTime",
			"lightOffTime",
			"antialiasingLevel",
			"reliefEnabled",
			"reliefPresetName"
		];

		this.globalSettingsNames = [
			"maxWorkers",
			"maxDistance"
		];

		this.otherSettingsNames = [
			"fileName",
		];

		this.folderMachineSettings = null;
		this.folderPrintSettings = null;
		this.folderGlobalSettings  = null;

		this.objectListFolderController = null;
		this.objectListUIItems = [ ];

		this.imageListFolderController = null;
		this.imageListUIItems = [ ];

		this.mainUI = null;

		this.theInputFiles = document.getElementById( "theInputFiles" );

		this.infoText = document.getElementById( "infoText" );

		this.fileNameController = null;

		//this.dialogShown = false;

		this.restoreSettingsDialogShown = false;
		this.selectItemsFromProjectDialogShown = false;
		this.objectCopiesDialogShown = false;
		this.saveResinPrintDialogShown = false;
		this.reliefDialogShown = false;

		this.vec21 = new Vector2();
		this.vec31 = new Vector3();
		this.vec32 = new Vector3();

		const scope = this;

		this.theInputFiles.addEventListener( 'change', ( event ) => { scope.inputFilesSelected( event.target.files ); }, false );
		this.minceSlicer.container.addEventListener( 'dragover', ( event ) => { scope.handleDragOver( event ); }, false );
		this.minceSlicer.container.addEventListener( 'drop', ( event ) => { scope.handleDropIn( event ); }, false );

	}

	getDefaultUIData() {

		const data = {
			fileName: 'Nonamed.mince',
			machineType: 'default',
			resin: 'normal',
			resinDensity: 1.1,
			resinPriceKg: 0,

			machineX: 82.62,
			machineY: 130.56,
			machineZ: 160,

			layerHeight: 0.05,
			resolutionX: 1620,
			resolutionY: 2560,

			projectType: 'mirror_LCD',
			normalExposureTime: 2.5,
			bottomLayerExposureTime: 12,
			normalDropSpeed: 210,
			normalLayerLiftHeight: 5,
			zSlowUpDistance: 6,
			normalLayerLiftSpeed: 80,
			bottomLayerCount: 5,
			mirror: 1,
			bottomLayerLiftHeight: 10,
			bottomLayerLiftSpeed: 60,
			bottomLightOffTime: 0,
			lightOffTime: 0,

			maxWorkers: 1,
			maxDistance: 2500,

			antialiasingLevel: 1,

			reliefEnabled: false,
			reliefPresetName: 'Wood (circular)',
			reliefPresets: {
				'Wood (circular)': {
					maxHeight: 0.4,
					randomSeed: 0.12345,
					reliefNodeJSON:
					{
						className: 'Evaluate',
						parameterValues: [
							{
								className: 'Circles',
								parameterValues: [
									Constants.RELIEF_EMBOSS,
									15,
									{
										className: 'Constant',
										parameterValues: [
											-0.5
										]
									},
									{
										className: 'Constant',
										parameterValues: [
											-0.5
										]
									}
								]
							},
							{
								className: 'Add',
								parameterValues: [
									{
										className: 'GetU',
										parameterValues: [ ]
									},
									{
										className: 'Multiply',
										parameterValues: [
											{
												className: 'Constant',
												parameterValues: [
													0.02
												]
											},
											{
												className: 'SimplexUV',
												parameterValues: [
													Constants.RELIEF,
													{
														className: 'Constant',
														parameterValues: [
															5
														]
													},
													{
														className: 'Constant',
														parameterValues: [
															5
														]
													}
												]
											}
										]
									}
								]
							},
							{
								className: 'Add',
								parameterValues: [
									{
										className: 'Multiply',
										parameterValues: [
											{
												className: 'Constant',
												parameterValues: [
													0.7
												]
											},
											{
												className: 'GetV',
												parameterValues: [ ]
											},
										]
									},
									{
										className: 'Multiply',
										parameterValues: [
											{
												className: 'Constant',
												parameterValues: [
													0.03
												]
											},
											{
												className: 'SimplexUV',
												parameterValues: [
													Constants.RELIEF,
													{
														className: 'Constant',
														parameterValues: [
															5
														]
													},
													{
														className: 'Constant',
														parameterValues: [
															5
														]
													}
												]
											}
										]
									}
								]
							}
						]
					}
				},
				'Wood (lineal)': {
					name: 'Wood (lineal)',
					maxHeight: 0.4,
					randomSeed: 0.12345,
					reliefNodeJSON:
					{
						className: 'Evaluate',
						parameterValues: [
							{
								className: 'Checkered',
								parameterValues: [
									Constants.RELIEF_EMBOSS,
									{
										className: 'Constant',
										parameterValues: [
											0
										]
									},
									{
										className: 'Constant',
										parameterValues: [
											0.05
										]
									},
									{
										className: 'Constant',
										parameterValues: [
											0
										]
									},
									{
										className: 'Constant',
										parameterValues: [
											0
										]
									}
								]
							},
							{
								className: 'Add',
								parameterValues: [
									{
										className: 'GetU',
										parameterValues: [ ]
									},
									{
										className: 'Multiply',
										parameterValues: [
											{
												className: 'Constant',
												parameterValues: [
													0.02
												]
											},
											{
												className: 'SimplexUV',
												parameterValues: [
													Constants.RELIEF,
													{
														className: 'Constant',
														parameterValues: [
															5
														]
													},
													{
														className: 'Constant',
														parameterValues: [
															5
														]
													}
												]
											}
										]
									}
								]
							},
							{
								className: 'Add',
								parameterValues: [
									{
										className: 'Multiply',
										parameterValues: [
											{
												className: 'Constant',
												parameterValues: [
													0.7
												]
											},
											{
												className: 'GetV',
												parameterValues: [ ]
											},
										]
									},
									{
										className: 'Multiply',
										parameterValues: [
											{
												className: 'Constant',
												parameterValues: [
													0.03
												]
											},
											{
												className: 'SimplexUV',
												parameterValues: [
													Constants.RELIEF,
													{
														className: 'Constant',
														parameterValues: [
															5
														]
													},
													{
														className: 'Constant',
														parameterValues: [
															5
														]
													}
												]
											}
										]
									}
								]
							}
						]
					}
				},
				'Checker board': {
					name: 'Checker board',
					maxHeight: 0.4,
					randomSeed: 0.12345,
					reliefNodeJSON:
					{
						className: 'Checkered',
						parameterValues: [
							Constants.RELIEF_EMBOSS,
							{
								className: 'Constant',
								parameterValues: [
									0.05
								]
							},
							{
								className: 'Constant',
								parameterValues: [
									0.05
								]
							},
							{
								className: 'Constant',
								parameterValues: [
									0.0
								]
							},
							{
								className: 'Constant',
								parameterValues: [
									0.0
								]
							}
						]
					}
				},
				'Image': {
					name: 'Image',
					maxHeight: 0.4,
					randomSeed: 0.12345,
					reliefNodeJSON:
					{
						className: 'ImageUV',
						parameterValues: [
							Constants.RELIEF,
							1,
							1,
							0,
							0,
							"None"
						]
					}
				},
				'ImageTiled': {
					name: 'Tiled image',
					maxHeight: 0.4,
					randomSeed: 0.12345,
					reliefNodeJSON:
					{
						className: 'ImageTiledUV',
						parameterValues: [
							Constants.RELIEF,
							{
								className: 'Constant',
								parameterValues: [
									0.1
								]
							},
							{
								className: 'Constant',
								parameterValues: [
									0.1
								]
							},
							2,
							2,
							-1,
							-1,
							"None"
						]
					}
				},
				'Horizontal stripes': {
					name: 'Horizontal stripes',
					maxHeight: 0.4,
					randomSeed: 0.12345,
					reliefNodeJSON:
					{
						className: 'Checkered',
						parameterValues: [
							Constants.RELIEF_EMBOSS,
							{
								className: 'Constant',
								parameterValues: [
									0
								]
							},
							{
								className: 'Constant',
								parameterValues: [
									0.05
								]
							},
							{
								className: 'Constant',
								parameterValues: [
									0
								]
							},
							{
								className: 'Constant',
								parameterValues: [
									0
								]
							}
						]
					}
				},
				'Vertical stripes': {
					name: 'Vertical stripes',
					maxHeight: 0.4,
					randomSeed: 0.12345,
					reliefNodeJSON:
					{
						className: 'Checkered',
						parameterValues: [
							Constants.RELIEF_EMBOSS,
							{
								className: 'Constant',
								parameterValues: [
									0.05
								]
							},
							{
								className: 'Constant',
								parameterValues: [
									0
								]
							},
							{
								className: 'Constant',
								parameterValues: [
									0
								]
							},
							{
								className: 'Constant',
								parameterValues: [
									0
								]
							}
						]
					}
				},
				'Horizontal waves': {
					name: 'Horizontal waves',
					maxHeight: 0.4,
					randomSeed: 0.12345,
					reliefNodeJSON:
					{
						className: 'Evaluate',
						parameterValues: [
							{
								className: 'Checkered',
								parameterValues: [
									Constants.RELIEF_EMBOSS,
									{
										className: 'Constant',
										parameterValues: [
											0
										]
									},
									{
										className: 'Constant',
										parameterValues: [
											0.15
										]
									},
									{
										className: 'Constant',
										parameterValues: [
											0
										]
									},
									{
										className: 'Constant',
										parameterValues: [
											0
										]
									}
								]
							},
							{
								className: 'GetU',
								parameterValues: [ ]
							},
							{
								className: 'Add',
								parameterValues: [
									{
										className: 'Multiply',
										parameterValues: [
											{
												className: 'Constant',
												parameterValues: [
													0.2
												]
											},
											{
												className: 'Sin',
												parameterValues: [
													Constants.RELIEF,
													{
														className: 'Multiply',
														parameterValues: [
															{
																className: 'Constant',
																parameterValues: [
																	20
																]
															},
															{
																className: 'GetU',
																parameterValues: [ ]
															}
														]
													}
												]
											}
										]
									},
									{
										className: 'GetV',
										parameterValues: [ ]
									}
								]
							}
						]
					}
				},
				'Vertical waves': {
					name: 'Vertical waves',
					maxHeight: 0.4,
					randomSeed: 0.12345,
					reliefNodeJSON:
					{
						className: 'Evaluate',
						parameterValues: [
							{
								className: 'Checkered',
								parameterValues: [
									Constants.RELIEF_EMBOSS,
									{
										className: 'Constant',
										parameterValues: [
											0.15
										]
									},
									{
										className: 'Constant',
										parameterValues: [
											0
										]
									},
									{
										className: 'Constant',
										parameterValues: [
											0
										]
									},
									{
										className: 'Constant',
										parameterValues: [
											0
										]
									}
								]
							},
							{
								className: 'Add',
								parameterValues: [
									{
										className: 'Multiply',
										parameterValues: [
											{
												className: 'Constant',
												parameterValues: [
													0.2
												]
											},
											{
												className: 'Sin',
												parameterValues: [
													Constants.RELIEF,
													{
														className: 'Multiply',
														parameterValues: [
															{
																className: 'Constant',
																parameterValues: [
																	20
																]
															},
															{
																className: 'GetV',
																parameterValues: [ ]
															}
														]
													}
												]
											}
										]
									},
									{
										className: 'GetU',
										parameterValues: [ ]
									}
								]
							},
														{
								className: 'GetV',
								parameterValues: [ ]
							}
						]
					}
				},
				'Spots': {
					name: 'Spots',
					maxHeight: 0.4,
					randomSeed: 0.12345,
					reliefNodeJSON:
					{
						className: 'Spots',
						parameterValues: [
							Constants.RELIEF,
							{
								className: 'Constant',
								parameterValues: [
									0.05
								]
							},
							{
								className: 'Constant',
								parameterValues: [
									0.05
								]
							},
							{
								className: 'Constant',
								parameterValues: [
									0.3
								]
							}
						]
					}
				},
				'Sandpaper': {
					name: 'Sandpaper',
					maxHeight: 0.4,
					randomSeed: 0.12345,
					reliefNodeJSON:
					{
						className: 'Add',
						parameterValues: [
							{
								className: 'Constant',
								parameterValues: [
									1 / 3
								]
							},
							{
								className: 'Multiply',
								parameterValues: [
									{
										className: 'Constant',
										parameterValues: [
											2 / 3
										]
									},
									{
										className: 'Max',
										parameterValues: [
											{
												className: 'Constant',
												parameterValues: [
													- 0.5
												]
											},
											{
												className: 'SimplexUV',
												parameterValues: [
													Constants.RELIEF_EMBOSS,
													{
														className: 'Constant',
														parameterValues: [
															50
														]
													},
													{
														className: 'Constant',
														parameterValues: [
															50
														]
													}
												]
											}
										]
									}
								]
							}
						]
					}
				},
				'Tiles': {
					name: 'Tiles',
					maxHeight: 0.4,
					randomSeed: 0.12345,
					reliefNodeJSON:
					{
						className: 'Tiles',
						parameterValues: [
							Constants.RELIEF_EMBOSS,
							{
								className: 'Constant',
								parameterValues: [
									0.2
								]
							},
							{
								className: 'Constant',
								parameterValues: [
									0.2
								]
							},
							{
								className: 'Constant',
								parameterValues: [
									0.1
								]
							},
							false
						]
					}
				},
				'Bricks': {
					name: 'Bricks',
					maxHeight: 0.4,
					randomSeed: 0.12345,
					reliefNodeJSON:
					{
						className: 'Tiles',
						parameterValues: [
							Constants.RELIEF_EMBOSS,
							{
								className: 'Constant',
								parameterValues: [
									0.2
								]
							},
							{
								className: 'Constant',
								parameterValues: [
									0.1
								]
							},
							{
								className: 'Constant',
								parameterValues: [
									0.1
								]
							},
							true
						]
					}
				},
				'Grip': {
					name: 'Grip',
					maxHeight: 0.4,
					randomSeed: 0.12345,
					reliefNodeJSON:
					{
						className: 'Multiply',
						parameterValues: [
							{
								className: 'Tiles',
								parameterValues: [
									Constants.RELIEF,
									{
										className: 'Constant',
										parameterValues: [
											0.1
										]
									},
									{
										className: 'Constant',
										parameterValues: [
											0.05
										]
									},
									{
										className: 'Constant',
										parameterValues: [
											1
										]
									},
									false
								]
							},
							{
								className: 'Constant',
								parameterValues: [
									2
								]
							}
						]
					}
				},
				'Halftones': {
					name: 'Halftones',
					maxHeight: 0.4,
					randomSeed: 0.12345,
					reliefNodeJSON:
					{
						className: 'Spots',
						parameterValues: [
							Constants.RELIEF,
							{
								className: 'Constant',
								parameterValues: [
									0.01
								]
							},
							{
								className: 'Constant',
								parameterValues: [
									0.01
								]
							},
							{
								className: 'ImageUV',
								parameterValues: [
									Constants.RELIEF,
									1,
									1,
									0,
									0,
									"None"
								]
							}
						]
					}
				}
			},

			showBuildVolumeBox: false,
			isLicenseAccepted: false

		};

		function constantNode( constant ) {

			return {
				class: 'Constant',
				parameterValues: [
					constant
				]
			}		}

		const numCores = navigator ? Math.max( navigator.hardwareConcurrency - 1, 1 ) : 1;
		if ( this.coresList.includes( numCores ) ) data.maxWorkers = numCores;

		return data;

	}

	createMainUI() {

		const scope = this;

		if ( this.mainUI ) this.mainUI.destroy();
		this.mainUI = new GUI();
		this.mainUI.width = 600;


		// Add tool buttons

		function makeToolButton( index ) {

			const toolName = scope.minceSlicer.tools.toolNames[ index ];

			makeButton( scope.mainUI, "Tool " + toolName, () => {

				scope.minceSlicer.tools.selectTool( toolName );

			} );

		}
		for ( let i = 1, l = scope.minceSlicer.tools.toolNames.length; i < l; i ++ ) makeToolButton( i );

		// Add view slice preview checkbox

		makeCheckbox( scope.mainUI, "View slice preview", ( enabled ) => {

			if ( enabled ) {

				scope.minceSlicer.layerPlaneView.visible = true;
				scope.minceSlicer.layerClippingTransformControls.enabled = true;
				scope.minceSlicer.layerClippingTransformControls.visible = true;

			}
			else {

				scope.minceSlicer.layerPlaneView.visible = false;
				scope.minceSlicer.layerClippingTransformControls.enabled = false;
				scope.minceSlicer.layerClippingTransformControls.visible = false;
				scope.minceSlicer.layerClippingPlane.constant = +Infinity;

			}

			scope.minceSlicer.layerPlaneViewIsDirty = true;
			scope.minceSlicer.render();

		} );

		// Add "Show build volume box" checkbox

		makeCheckbox( this.mainUI, "Show build volume box", ( value ) => {

			scope.minceSlicer.buildPlateBBoxHelper.visible = value;
			scope.minceSlicer.render();

		}, this.data, "showBuildVolumeBox" );

		// Add "Reset view" button

		makeButton( this.mainUI, "Reset view", () => {

			scope.minceSlicer.resetView();
			scope.minceSlicer.render();

		} );

		// Add machine settings folder

		this.folderMachineSettings = this.mainUI.addFolder( "Machine settings" );

		this.folderMachineSettings.add( this.data, 'machineType' ).name( "Machine type: " );

		this.folderMachineSettings.add( this.data, 'machineX', 1, undefined, 0.01 )
			.name( "Build area X size, blue axis (mm): " )
			.onFinishChange( () => {
				scope.minceSlicer.setBuildPlateScale();
				}
			);

		this.folderMachineSettings.add( this.data, 'machineY', 1, undefined, 0.01 )
			.name( "Build area Y size, red axis (mm): " )
			.onFinishChange( () => {
				scope.minceSlicer.setBuildPlateScale();
				}
			);

		this.folderMachineSettings.add( this.data, 'machineZ', 1, undefined, 0.01 )
			.name( "Build area Z size, green axis (mm): " )
			.onFinishChange( () => {
				scope.minceSlicer.setBuildPlateScale();
				}
			);

		this.folderMachineSettings.add( this.data, 'layerHeight', 0, undefined, 0.01 )
			.name( "Layer height (mm): " )
			.onFinishChange( () => {
				scope.minceSlicer.setBuildPlateScale();
				}
			);

		this.folderMachineSettings.add( this.data, 'resolutionX', 1 )
			.step( 1 )
			.name( "Resolution X (pixels): " )
			.onFinishChange( () => {
				scope.minceSlicer.setLCDResolution();
				}
			);

		this.folderMachineSettings.add( this.data, 'resolutionY', 1 )
			.step( 1 )
			.name( "Resolution Y (pixels): " )
			.onFinishChange( () => {
				scope.minceSlicer.setLCDResolution();
				}
			);

		this.folderMachineSettings.add( this.data, 'mirror' ).name( "Mirror: " );

		// Add print settings folder

		this.folderPrintSettings = this.mainUI.addFolder( "Print settings" );
		this.folderPrintSettings.close();

		this.folderPrintSettings.add( this.data, 'bottomLayerCount', 0 )
			.step( 1 )
			.name( "Number of bottom layers: " );

		this.folderPrintSettings.add( this.data, 'normalExposureTime', 0, undefined, 0.01 )
			.name( "Normal layer exposure (seconds): " );

		this.folderPrintSettings.add( this.data, 'bottomLayerExposureTime', 0, undefined, 0.01 )
			.name( "Bottom layer exposure (seconds): " );

		this.folderPrintSettings.add( this.data, 'normalLayerLiftSpeed', 0, undefined, 0.01 )
			.name( "Normal layer lift speed (mm/minute): " );

		this.folderPrintSettings.add( this.data, 'bottomLayerLiftSpeed', 0, undefined, 0.01 )
			.name( "Bottom layer lift speed (mm/minute): " );

		this.folderPrintSettings.add( this.data, 'normalDropSpeed', 0, undefined, 0.01 )
			.name( "Drop speed (mm/minute): " );

		this.folderPrintSettings.add( this.data, 'normalLayerLiftHeight', 0, undefined, 0.01 )
			.name( "Normal layer lift height (mm): " );

		this.folderPrintSettings.add( this.data, 'bottomLayerLiftHeight', 0, undefined, 0.01 )
			.name( "Bottom layer lift height (mm): " );

		this.folderPrintSettings.add( this.data, 'zSlowUpDistance', 0, undefined, 0.01 )
			.name( "Z slow up distance (mm): " );

		this.folderPrintSettings.add( this.data, 'bottomLightOffTime', 0, undefined, 0.01 )
			.name( "Bottom layer light off time (seconds): " );

		this.folderPrintSettings.add( this.data, 'lightOffTime', 0, undefined, 0.01 )
			.name( "Normal layer light off time (seconds): " );

		this.folderPrintSettings.add( this.data, 'resinDensity', 0, undefined, 0.01 )
			.name( "Resin density (g/cm³): " );

		this.folderPrintSettings.add( this.data, 'resinPriceKg', 0, undefined, 0.01 )
			.name( "Resin price per Kg: " );

		this.folderPrintSettings.add( this.data, 'antialiasingLevel', 1, 4, 1 )
			.name( "Anti-aliasing level (1 to 4): " )
			.onFinishChange( () => {

				scope.minceSlicer.layerPlaneViewIsDirty = true;
				scope.minceSlicer.render();

			} );

		// Add global settings folder

		this.folderGlobalSettings = this.mainUI.addFolder( "Global settings" );
		this.folderGlobalSettings.close();

		this.folderGlobalSettings.add( this.data, 'maxWorkers', this.coresList )
			.name( "Max. number of workers: " )
			.onFinishChange( ( value ) => {

				scope.minceSlicer.jobManager.setNumWorkers( value );

			}
		);

		const controllerMaxDistance = this.folderGlobalSettings.add( this.data, 'maxDistance', 1 )
			.step( 1 )
			.name( "Max. distance in mm: " )
			.onFinishChange( ( value ) => {

				scope.minceSlicer.setMaxDistance( value );

			}
		);

		// Add the Relief/Emboss open dialog button

		makeButton( this.mainUI, "Relief / emboss...", () => {

			scope.createReliefEmbossDialog();

		} );

		// Add the Slice button

		makeButton( this.mainUI, "Slice", () => {

			scope.minceSlicer.getPreviewImagesAndSlice();

		} );

		// Add clear buildplate button

		makeButton( this.mainUI, "Clear build plate", () => {

			scope.makeYesNoDialog( "Clear buildplate?", "Yes, delete all objects", "No, return", () => {

				scope.minceSlicer.clearBuildPlate();

				scope.minceSlicer.userMessage( "Buildplate was cleared." );

			} );

		} );

		// Add save project button

		makeButton( this.mainUI, "Save project", () => {

			scope.minceSlicer.fileIn.saveProjectFile();

		} );

		// Add save settings button

		makeButton( this.mainUI, "Save settings", () => {

			scope.saveGUIDataToLocalStorage();

			scope.makeInfoDialog( 600, "Settings were saved.", null, "OK" );

		} );

		// Add restore settings to default button

		makeButton( this.mainUI, "Restore settings to defaults", () => {

			scope.makeRestoreSettingsToDefaultDialog();

		} );

		// Add file name edit box

		this.fileNameController = this.mainUI.add( this.data, 'fileName' ).name( "File name" );

		// Add "Reset selected object rotation" button

		makeButton( this.mainUI, "Reset selected object rotation", () => {

			const object = scope.minceSlicer.selectedSlicerObject;
			if ( object === null ) return;

			scope.minceSlicer.resetSlicerObjectRotation( object );

		} );

		// Add "Make copies of selected object" button

		makeButton( this.mainUI, "Make copies of selected object", () => {

			const object = scope.minceSlicer.selectedSlicerObject;
			if ( object === null ) return;

			scope.makeObjectCopiesDialog( object );

		} );

		// Add "Delete selected object" button

		makeButton( this.mainUI, "Delete selected object", () => {

			const object = scope.minceSlicer.selectedSlicerObject;
			if ( object === null ) return;

			scope.makeYesNoDialog(
				"Confirm delete object " + object.displayName + "?",
				"Yes, DELETE.",
				"Cancel",
				() => {

					scope.minceSlicer.deleteSlicerObject( object );

					scope.minceSlicer.userMessage( "Object " + object.displayName + " was deleted." );

				}
			);

		} );

		// Add objects list

		this.objectListFolderController = this.mainUI.addFolder( "Objects list" );
		this.objectListFolderController.open();

		// Add "Delete selected image" button

		makeButton( this.mainUI, "Delete selected image", () => {

			const image = scope.minceSlicer.selectedImage;
			if ( image === null ) return;

			scope.makeYesNoDialog(
				"Confirm delete image " + image.name + "?",
				"Yes, DELETE.",
				"Cancel",
				() => {

					scope.minceSlicer.deleteImage( image );

					scope.minceSlicer.userMessage( "Image " + image.name + " was deleted." );

				}
			);

		} );

		// Add images list

		this.imageListFolderController = this.mainUI.addFolder( "Images list" );
		this.imageListFolderController.open();


		// --

		// Confirm exit handler

		addEventListener( 'beforeunload', function( event ) {

			if ( scope.minceSlicer.jobManagerIsBusy ) event.returnValue = "Slicing is in progress. Are you sure to quit?";
			if ( scope.saveResinPrintDialogShown ) event.returnValue = "Slice print is not saved. Are you sure to quit?";

		} );


		// Key handlers

		window.addEventListener( 'keydown', function ( event ) {

			const currentTool = scope.minceSlicer.tools.currentTool;

			switch ( event.keyCode ) {

				// G
				case 71:
					scope.minceSlicer.tools.selectTool( 'Move (g)' );
					break;

				// R
				case 82:
					scope.minceSlicer.tools.selectTool( 'Rotate (r)' );
					break;

				// S
				case 83:
					scope.minceSlicer.tools.selectTool( 'Scale (s)' );
					break;

				// F
				case 70:
					scope.minceSlicer.tools.selectTool( 'Sit Model On Face (f)' );
					break;

				// Control
				case 17:
					if ( currentTool && currentTool.setSnapEnabled ) {

						currentTool.setSnapEnabled( true );

					}
					break;

			}

		} );

		window.addEventListener( 'keyup', function ( event ) {

			const currentTool = scope.minceSlicer.tools.currentTool;

			switch ( event.keyCode ) {

				// Control
				case 17:
					if ( currentTool && currentTool.setSnapEnabled ) {

						currentTool.setSnapEnabled( false );

					}
					break;

			}

		} );

		this.createLicenseAcceptDialog();

	}

	addObjectToUI( slicerObject ) {

		const scope = this;

		// Check object is not already in the UI
		if ( this.findObjectUI( slicerObject ) !== null ) {

			console.error( "Slicer object named '" + slicerObject.originalFileName + "' is already in the UI objects list." );
			return null;

		}

		const uiController = makeCheckbox(
			this.objectListFolderController,
			slicerObject.displayName,
			localOnObjectSelected
		);

		const objectUI = {
			slicerObject: slicerObject,
			uiController: uiController
		};

		this.objectListUIItems.push( objectUI );

		function localOnObjectSelected() {

			scope.onObjectSelected( objectUI )

		}

		return objectUI;

	}

	removeObjectFromUI( slicerObject ) {

		// Check object is in the UI
		const uiItem = this.findObjectUI( slicerObject )
		if ( uiItem === null ) {

			console.error( "Slicer object named '" + slicerObject.originalFileName + "' not found in the UI objects list." );
			return;

		}

		this.objectListFolderController.remove( uiItem.uiController );

		this.objectListUIItems.splice( this.objectListUIItems.indexOf( uiItem ), 1 );

	}

	findObjectUI( slicerObject ) {

		// Returns objectListUIItems element or null if not found.

		if ( ! slicerObject ) return null;

		for ( let i = 0, l = this.objectListUIItems.length; i < l; i ++ ) {

			if ( this.objectListUIItems[ i ].slicerObject.id === slicerObject.id ) {

				return this.objectListUIItems[ i ];

			}

		}

		return null;

	}

	findObjectUIByName( displayName ) {

		// Returns index or null if not found.

		for ( let i = 0, l = this.objectListUIItems.length; i < l; i ++ ) {

			if ( this.objectListUIItems[ i ].slicerObject.displayName === displayName ) {

				return i;

			}

		}

		return null;

	}

	onObjectSelected( objectUI ) {

		if ( objectUI.uiController.getValue() ) {

			const previouslySelected = this.findObjectUI( this.minceSlicer.selectedSlicerObject );
			if ( previouslySelected !== null ) {

				previouslySelected.uiController.setValue( false );

			}

			//objectUI.uiController.setValue( true );
			objectUI.uiController.object[ objectUI.uiController.property ] = true;
			objectUI.uiController.updateDisplay();

			this.minceSlicer.selectSlicerObject( objectUI.slicerObject );

		}
		else {

			this.minceSlicer.selectSlicerObject( null );

		}

	}

	addImageToUI( image ) {

		const scope = this;

		// Check image is not already in the UI
		if ( this.findImageUI( image ) !== null ) {

			console.error( "Image named '" + image.name + "' is already in the UI objects list." );
			return null;

		}

		const uiController = makeCheckbox(
			this.imageListFolderController,
			image.name,
			localOnImageSelected
		);

		const imageUI = {
			image: image,
			uiController: uiController
		};

		this.imageListUIItems.push( imageUI );

		function localOnImageSelected() {

			scope.onImageSelected( imageUI );

		}

		return imageUI;

	}

	removeImageFromUI( image ) {

		// Check object is in the UI
		const uiItem = this.findImageUI( image )
		if ( uiItem === null ) {

			console.error( "Image named '" + image.name + "' not found in the UI images list." );
			return;

		}

		this.imageListFolderController.remove( uiItem.uiController );

		this.imageListUIItems.splice( this.imageListUIItems.indexOf( uiItem ), 1 );

	}

	findImageUI( image ) {

		// Returns imageListUIItems element or null if not found.

		if ( ! image ) return null;

		for ( let i = 0, l = this.imageListUIItems.length; i < l; i ++ ) {

			if ( this.imageListUIItems[ i ].image.name === image.name ) {

				return this.imageListUIItems[ i ];

			}

		}

		return null;

	}

	onImageSelected( imageUI ) {

		if ( imageUI.uiController.getValue() ) {

			const previouslySelected = this.findImageUI( this.minceSlicer.selectedImage );
			if ( previouslySelected !== null ) {

				previouslySelected.uiController.setValue( false );

			}

			imageUI.image[ imageUI.uiController.property ] = true;
			imageUI.uiController.updateDisplay();

			this.minceSlicer.selectImage( imageUI.image );

		}
		else {

			this.minceSlicer.selectImage( null );

		}

	}

	setFilename( fileName ) {

		this.fileNameController.setValue( fileName );

	}

	userMessageInfo( message ) {

		this.infoText.innerHTML = message;
		this.infoText.style.color = 'white';

	}

	userMessageWarning( message ) {

		this.infoText.innerHTML = message;
		this.infoText.style.color = 'orange';

	}

	userMessageError( message ) {

		this.infoText.innerHTML = message;
		this.infoText.style.color = 'red';

	}

	handleDropIn( event ) {

		event.stopPropagation();
		event.preventDefault();

		this.inputFilesSelected( event.dataTransfer.files );

	}

	handleDragOver( event ) {

		event.stopPropagation();
		event.preventDefault();
		// Explicitly show this is a copy
		event.dataTransfer.dropEffect = 'copy';

	}

	inputFilesSelected( files ) {

		this.minceSlicer.fileIn.onFilesLoaded( files );

	}

	getSettingsFromGUI() {

		return {
			fileName: this.data.fileName,
			machineType: this.data.machineType,
			estimatedPrintTime: 0,
			volume: 0,
			resin: this.data.resin,
			weight: 0,
			price: 0,
			resinDensity: this.data.resinDensity,
			resinPriceKg: this.data.resinPriceKg,

			projectType: this.data.projectType,
			layerHeight: this.data.layerHeight,
			resolutionX: this.data.resolutionX,
			resolutionY: this.data.resolutionY,
			machineX: this.data.machineX,
			machineY: this.data.machineY,
			machineZ: this.data.machineZ,

			normalExposureTime: this.data.normalExposureTime,
			bottomLayExposureTime: this.data.bottomLayerExposureTime,
			bottomLayerExposureTime: this.data.bottomLayerExposureTime,
			normalDropSpeed: this.data.normalDropSpeed,
			normalLayerLiftHeight: this.data.normalLayerLiftHeight,
			zSlowUpDistance: this.data.zSlowUpDistance,
			normalLayerLiftSpeed: this.data.normalLayerLiftSpeed,
			bottomLayCount: this.data.bottomLayerCount,
			bottomLayerCount: this.data.bottomLayerCount,
			mirror: this.data.mirror,
			totalLayer: 0,
			bottomLayerLiftHeight: this.data.bottomLayerLiftHeight,
			bottomLayerLiftSpeed: this.data.bottomLayerLiftSpeed,
			bottomLightOffTime: this.data.bottomLightOffTime,
			lightOffTime: this.data.lightOffTime,

			maxWorkers: this.data.maxWorkers,
			maxDistance: this.data.maxDistance,

			antialiasingLevel: this.data.antialiasingLevel,

			reliefEnabled: this.data.reliefEnabled,
			reliefPresetName: this.data.reliefPresetName,
			reliefPresets: this.data.reliefPresets,

			showBuildVolumeBox: this.data.showBuildVolumeBox,
			isLicenseAccepted: this.data.isLicenseAccepted

		};

	}

	setSettingsToGUI( settings ) {

		this.data.fileName = settings.fileName;
		this.data.machineType = settings.machineType;
		this.data.resin = settings.resin;
		if ( settings.resinDensity !== undefined ) this.data.resinDensity = settings.resinDensity;
		if ( settings.resinPriceKg !== undefined ) this.data.resinPriceKg = settings.resinPriceKg;

		this.data.projectType = settings.projectType;
		this.data.layerHeight = settings.layerHeight;
		this.data.resolutionX = settings.resolutionX;
		this.data.resolutionY = settings.resolutionY;
		this.data.machineX = settings.machineX;
		this.data.machineY = settings.machineY;
		this.data.machineZ = settings.machineZ;

		this.data.normalExposureTime = settings.normalExposureTime;
		this.data.bottomLayExposureTime = settings.bottomLayERExposureTime;
		this.data.bottomLayerExposureTime = settings.bottomLayerExposureTime;
		this.data.normalDropSpeed = settings.normalDropSpeed;
		this.data.normalLayerLiftHeight = settings.normalLayerLiftHeight;
		this.data.zSlowUpDistance = settings.zSlowUpDistance;
		this.data.normalLayerLiftSpeed = settings.normalLayerLiftSpeed;
		this.data.bottomLayCount = settings.bottomLayerCount;
		this.data.bottomLayerCount = settings.bottomLayerCount;
		this.data.mirror = settings.mirror;
		this.data.totalLayer = settings.totalLayer;
		this.data.bottomLayerLiftHeight = settings.bottomLayerLiftHeight;
		this.data.bottomLayerLiftSpeed = settings.bottomLayerLiftSpeed;
		this.data.bottomLightOffTime = settings.bottomLightOffTime;
		this.data.lightOffTime = settings.lightOffTime;

		if ( settings.maxWorkers !== undefined ) this.data.maxWorkers = settings.maxWorkers;
		if ( settings.maxDistance !== undefined ) this.data.maxDistance = settings.maxDistance;
		if ( settings.antialiasingLevel !== undefined ) this.data.antialiasingLevel = settings.antialiasingLevel;

		if ( settings.reliefEnabled !== undefined ) this.data.reliefEnabled = settings.reliefEnabled;
		if ( settings.reliefPresetName !== undefined ) this.data.reliefPresetName = settings.reliefPresetName;
		if ( settings.reliefPresets !== undefined ) this.data.reliefPresets = settings.reliefPresets;

		if ( settings.showBuildVolumeBox !== undefined ) this.data.showBuildVolumeBox = settings.showBuildVolumeBox;
		if ( settings.isLicenseAccepted !== undefined ) this.data.isLicenseAccepted = settings.isLicenseAccepted;

	}

	saveGUIDataToLocalStorage() {

		const dataToSave = this.getSettingsFromGUI();

		window.localStorage.setItem( 'minceSettings', JSON.stringify( dataToSave ) );

	}

	loadGUIDataFromLocalStorage() {

		// Load settings
		var str = window.localStorage.getItem( 'minceSettings' );
		if ( ! str ) return null;

		// Parse JSON settings
		var dataLoaded = JSON.parse( str );
		if ( ! dataLoaded ) return null;

		// Set default values if undefined
		const defaultData = this.getDefaultUIData();
		Object.keys( defaultData ).forEach( ( settingName ) => {

			if ( dataLoaded[ settingName ] === undefined ) {

				dataLoaded[ settingName ] = defaultData[ settingName ];

			}

		} );

		return dataLoaded;

	}

	restoreSettingsToDefaults( restoreSettingTypes ) {

		const defaultSettings = this.getDefaultUIData();
		const currentSettings = this.getSettingsFromGUI();

		if ( restoreSettingTypes.restoreMachineSettings ) restoreSettings( this.machineSettingsNames );
		if ( restoreSettingTypes.restorePrintSettings ) restoreSettings( this.printSettingsNames );
		if ( restoreSettingTypes.restoreGlobalSettings ) restoreSettings( this.globalSettingsNames );
		restoreSettings( this.otherSettingsNames );

		if ( restoreSettingTypes.restoreReliefPresets ) {

			Object.keys( defaultSettings.reliefPresets ).forEach( ( presetName ) => {

				delete currentSettings.reliefPresets[ presetName ];
				currentSettings.reliefPresets[ presetName ] = defaultSettings.reliefPresets[ presetName ];

			} );

		}

		function restoreSettings( settingsNames ) {

			settingsNames.forEach( ( settingName ) => {

				currentSettings[ settingName ] = defaultSettings[ settingName ];

			} );
		}

		this.setSettingsToGUI( currentSettings );
		this.saveGUIDataToLocalStorage();
		this.updateControllersRecursive( this.folderMachineSettings );
		this.updateControllersRecursive( this.folderPrintSettings );
		this.updateControllersRecursive( this.folderGlobalSettings );

		this.userMessageInfo( "Settings were restored." );

		this.minceSlicer.setBuildPlateScale();
		this.minceSlicer.setLCDResolution();

	}

	updateControllersRecursive( folder ) {

		for ( let i = 0, l = folder.__controllers.length; i < l; i ++ ) {

			folder.__controllers[ i ].updateDisplay();

		}

		Object.keys( folder.__folders ).forEach( ( folderName ) => {

			const f = folder.__folders[ folderName ];
			if ( f ) this.updateControllersRecursive( f );

		} );


	}

	makeYesNoDialog( question, okLabel, cancelLabel, onOk, onCancel ) {

		//if ( this.dialogShown ) return;
		//this.dialogShown = true;

		const scope = this;

		// Show question
		const yesNoPanelUI = makePanelUI( 600 );
		document.body.appendChild( yesNoPanelUI.div );

		// Question label
		makeControllerReadOnly( makeButton( yesNoPanelUI.uiController, question ) );

		// Ok button
		makeButton( yesNoPanelUI.uiController, okLabel, () => {

			//scope.dialogShown = false;
			deletePanelUI( yesNoPanelUI );
			document.body.removeChild( yesNoPanelUI.div );
			if ( onOk ) onOk();

		} );

		// Cancel button
		makeButton( yesNoPanelUI.uiController, cancelLabel, () => {

			//scope.dialogShown = false;
			deletePanelUI( yesNoPanelUI );
			document.body.removeChild( yesNoPanelUI.div );
			if ( onCancel ) onCancel();

		} );

	}

	makeInfoDialog( width, info, info2, okLabel, onOk ) {

		//if ( this.dialogShown ) return;
		//this.dialogShown = true;

		const scope = this;

		const infoPanelUI = makePanelUI( width );
		document.body.appendChild( infoPanelUI.div );

		// Info label
		makeControllerReadOnly( makeButton( infoPanelUI.uiController, info ) );

		// Info label 2
		if ( info2 ) makeControllerReadOnly( makeButton( infoPanelUI.uiController, info2 ) );

		// Ok button
		if ( okLabel ) {

			makeButton( infoPanelUI.uiController, okLabel, () => {

				//scope.dialogShown = false;
				deletePanelUI( infoPanelUI );
				document.body.removeChild( infoPanelUI.div );
				if ( onOk ) onOk();

			} );

		}

		return infoPanelUI;

	}

	makeQuestionDialog( question, defaultAnswer, okLabel, cancelLabel, onOk, onCancel ) {

		const scope = this;

		// Show question
		const questionPanelUI = makePanelUI( 600 );
		document.body.appendChild( questionPanelUI.div );

		// Question label
		makeControllerReadOnly( makeButton( questionPanelUI.uiController, question ) );

		// Show answer edit box
		const data = {
			answer: defaultAnswer
		};
		questionPanelUI.uiController.add( data, 'answer' ).name( "" );

		// Ok button
		makeButton( questionPanelUI.uiController, okLabel, () => {

			deletePanelUI( questionPanelUI );
			document.body.removeChild( questionPanelUI.div );
			if ( onOk ) onOk( data.answer );

		} );

		// Cancel button
		makeButton( questionPanelUI.uiController, cancelLabel, () => {

			//scope.dialogShown = false;
			deletePanelUI( questionPanelUI );
			document.body.removeChild( questionPanelUI.div );
			if ( onCancel ) onCancel();

		} );

	}

	makeSimpleProgressDialog( infoLabelText ) {

		const panelUI = makePanelUI( 600 );
		document.body.appendChild( panelUI.div );

		// Info label
		const infoLabel = makeControllerReadOnly( makeButton( panelUI.uiController, infoLabelText ) );

		// Progress bar
		const progressBar = makeProgressBar( panelUI.uiController, "Completed %" );

		function onProgress( completed, total ) {

			progressBar.setProgress( 100 * completed / total );

		}

		let closed = false;
		function close() {

			if ( ! closed ) {

				deletePanelUI( panelUI );
				document.body.removeChild( panelUI.div );
				closed = true;
			}

		}

		return {
			panelUI: panelUI,
			onProgress: onProgress,
			close: close
		};

	}

	// Application dialogs

	makeRestoreSettingsToDefaultDialog() {

		if ( this.restoreSettingsDialogShown ) return;
		this.restoreSettingsDialogShown = true;

		const scope = this;

		const panelUI = makePanelUI( 600 );
		document.body.appendChild( panelUI.div );

		makeControllerReadOnly( makeButton( panelUI.uiController, "Please select what settings to restore" ) );

		const answers = {
			restoreMachineSettings: true,
			restorePrintSettings: true,
			restoreGlobalSettings: true,
			restoreReliefPresets: true
		}

		makeCheckbox( panelUI.uiController, "Restore default machine settings", null, answers, "restoreMachineSettings" );
		makeCheckbox( panelUI.uiController, "Restore default print settings", null, answers, "restorePrintSettings" );
		makeCheckbox( panelUI.uiController, "Restore default global settings", null, answers, "restoreGlobalSettings" );
		makeCheckbox( panelUI.uiController, "Restore default relief presets", null, answers, "restoreReliefPresets" );

		makeButton( panelUI.uiController, "OK, restore settings", () => {

			scope.restoreSettingsToDefaults( answers );
			close();

		} );

		makeButton( panelUI.uiController, "CANCEL", close );

		let closed = false;
		function close() {

			if ( ! closed ) {
kk
				scope.restoreSettingsDialogShown = false;

				deletePanelUI( panelUI );
				document.body.removeChild( panelUI.div );
				closed = true;

			}

		}

	}

	makeSelectItemsFromProjectDialog( onSelected ) {

		if ( this.selectItemsFromProjectDialogShown ) return;
		this.selectItemsFromProjectDialogShown = true;

		const scope = this;

		const panelUI = makePanelUI( 600 );
		document.body.appendChild( panelUI.div );

		makeControllerReadOnly( makeButton( panelUI.uiController, "Please select what to load from project file:" ) );

		const answers = {
			loadObjects: true,
			loadImages: true,
			loadMachineSettings: false,
			loadPrintSettings: true,
			loadReliefPresets: true
		}

		makeCheckbox( panelUI.uiController, "Load models", null, answers, "loadObjects" );
		makeCheckbox( panelUI.uiController, "Load images", null, answers, "loadImages" );
		makeCheckbox( panelUI.uiController, "Load machine settings", null, answers, "loadMachineSettings" );
		makeCheckbox( panelUI.uiController, "Load print settings", null, answers, "loadPrintSettings" );
		makeCheckbox( panelUI.uiController, "Load relief presets", null, answers, "loadReliefPresets" );

		makeButton( panelUI.uiController, "OK, load selected items", () => {

			close();
			onSelected( answers );

		} );

		makeButton( panelUI.uiController, "CANCEL", close );

		let closed = false;
		function close() {

			if ( ! closed ) {

				deletePanelUI( panelUI );
				document.body.removeChild( panelUI.div );
				closed = true;

				scope.selectItemsFromProjectDialogShown = false;
			}

		}

	}

	makeObjectCopiesDialog( slicerObject ) {

		if ( this.objectCopiesDialogShown ) return;
		this.objectCopiesDialogShown = true;

		const scope = this;

		const panelUI = makePanelUI( 600 );
		document.body.appendChild( panelUI.div );

		makeControllerReadOnly( makeButton( panelUI.uiController, "Please select number of copies and separations on each axis." ) );

		const answers = {
			numCopiesX: 2,
			numCopiesZ: 2,
			separationX: 3,
			separationZ: 3
		}

		panelUI.uiController.add( answers, "numCopiesX", 1 ).name( "Copies in X" ).step( 1 );
		panelUI.uiController.add( answers, "numCopiesZ", 1 ).name( "Copies in Y" ).step( 1 );
		panelUI.uiController.add( answers, "separationZ", 0 ).name( "Separation in X (mm)" );
		panelUI.uiController.add( answers, "separationX", 0 ).name( "Separation in Y (mm)" );

		makeButton( panelUI.uiController, "OK, make copies", () => {

			close();

			scope.minceSlicer.makeSlicerObjectCopies(
				slicerObject,
				answers.numCopiesX,
				answers.numCopiesZ,
				answers.separationX,
				answers.separationZ
			);

		} );

		makeButton( panelUI.uiController, "CANCEL", close );

		let closed = false;
		function close() {

			if ( ! closed ) {

				deletePanelUI( panelUI );
				document.body.removeChild( panelUI.div );
				closed = true;

				scope.objectCopiesDialogShown = false;
			}

		}

	}

	createSliceDialog( numLayers, onCancelSlicing ) {

		const panelUI = makePanelUI( 600 );
		document.body.appendChild( panelUI.div );

		// Info label
		const infoLabel = makeControllerReadOnly( makeButton( panelUI.uiController, "Slicing 3D print... " ) );

		// Progress bar
		const progressBar = makeProgressBar( panelUI.uiController, "Completed %" );

		// Cancel button
		makeButton( panelUI.uiController, "CANCEL Slicing", () => {

			close();
			if ( onCancelSlicing ) onCancelSlicing();

		} );

		function onProgress( completed, total ) {

			infoLabel.domElement.innerHTML = "Completed layer " + completed + " of " + total;
			progressBar.setProgress( 100 * completed / total );

		}

		let closed = false;
		function close() {

			if ( ! closed ) {

				deletePanelUI( panelUI );
				document.body.removeChild( panelUI.div );
				closed = true;

			}

		}

		return {
			panelUI: panelUI,
			onProgress: onProgress,
			close: close
		};

	}

	createSliceResultDialog( resinPrint, onSave, onCancel ) {

		const scope = this;

		const settings = resinPrint.printSettings;

		this.saveResinPrintDialogShown = true;

		const previewWidth = 600;
		const previewHeight = 500;

		const panelUI = makePanelUI( previewWidth );
		document.body.appendChild( panelUI.div );

		// Layer preview slider
		const layerPreviewSliderData = {
			layerNumber: settings.totalLayer		};
		const layerController = panelUI.uiController.add( layerPreviewSliderData, 'layerNumber', 1, settings.totalLayer, 1 )
			.name( "Set layer preview: " ).
			onChange( setPreviewLayer );

		// Move up one layer button
		makeButton( panelUI.uiController, "Up one layer", () => {

			layerPreviewSliderData.layerNumber = Math.min( settings.totalLayer, layerPreviewSliderData.layerNumber + 1 );
			layerController.updateDisplay();
			setPreviewLayer( layerPreviewSliderData.layerNumber );

		} );

		// Move down one layer button
		makeButton( panelUI.uiController, "Down one layer", () => {

			layerPreviewSliderData.layerNumber = Math.max( 1, layerPreviewSliderData.layerNumber - 1 );
			layerController.updateDisplay();
			setPreviewLayer( layerPreviewSliderData.layerNumber );

		} );

		// Show number of layers
		makeControllerReadOnly( panelUI.uiController.add( settings, 'totalLayer', 1 ).step( 1 ).name( "Number of layers: " ) );

		// Show estimated print time
		makeControllerReadOnly( panelUI.uiController.add( {
			printTimeString: timeInSecondsToHumanString( settings.estimatedPrintTime )
		}, 'printTimeString' ).name( "Estimated print time: " ) );

		// Show resin volume
		makeControllerReadOnly(
			panelUI.uiController.add( { volume: settings.volume } , 'volume', 0, undefined, 0.001 )
			.name( "Resin volume (cm³, ml): " )
			.setValue( settings.volume )
		);

		// Show resin weight
		makeControllerReadOnly(
			panelUI.uiController.add( { weight: settings.weight } , 'weight', 0, undefined, 0.001 )
			.name( "Resin weight (grams): " )
			.setValue( settings.weight )
		);

		// Show resin price
		makeControllerReadOnly(
			panelUI.uiController.add( { price: settings.price } , 'price', 0, undefined, 0.01 )
			.name( "Resin price (coin units): " )
			.setValue( settings.price )
		);

		// Show layer preview image
		const previewCanvas = document.createElement( 'canvas' );
		previewCanvas.width = previewWidth;
		previewCanvas.height = previewHeight;
		const previewCanvasCtx = previewCanvas.getContext( '2d' );
		previewCanvasCtx.imageSmoothingEnabled = false;
		previewCanvasCtx.fillStyle = 'black';
		previewCanvasCtx.fillRect( 0, 0, previewCanvas.width, previewCanvas.height );
		previewCanvasCtx.strokeStyle = 'orange';
		panelUI.div.insertBefore( previewCanvas, panelUI.uiController.domElement );

		// Show save print button
		makeButton( panelUI.uiController, "SAVE resin print ZIP file...", () => {

			scope.saveResinPrintDialogShown = false;
			deletePanelUI( panelUI );
			document.body.removeChild( panelUI.div );
			onSave();

		} );

		// Show export to STL button
		makeButton( panelUI.uiController, "Export to STL file...", () => {

			const infoPanel = scope.makeInfoDialog( 600, "Generating STL file..." );

			this.vec31.set( scope.data.layerHeight, scope.data.layerHeight, scope.data.layerHeight );
			const stlContents = resinPrint.convertToSTL( this.vec31 );

			saveFile( removeFilenameExtension( scope.data.fileName ) + ".stl", new Blob( [ stlContents ], { type: "model/stl" } ) );

			deletePanelUI( infoPanel );
			document.body.removeChild( infoPanel.div );

		} );

		// Show cancel button
		let cancelDialogShown = false;
		makeButton( panelUI.uiController, "CANCEL", () => {

			if ( ! cancelDialogShown ) {

				cancelDialogShown = true;

				scope.makeYesNoDialog( "Discard slicing?", "YES, discard ", "NO, return",
					() => {

						scope.saveResinPrintDialogShown = false;
						cancelDialogShown = false;
						deletePanelUI( panelUI );
						document.body.removeChild( panelUI.div );
						onCancel();

					},
					() => {

						cancelDialogShown = false;

					},
				);

			}

		} );


		// Preview zoom and panning

		previewCanvas.addEventListener( 'mousedown', handlePreviewMouseDown, false );
		previewCanvas.addEventListener( 'mouseup', handlePreviewMouseUp, false );
		previewCanvas.addEventListener( 'mouseenter', handlePreviewMouseUp, false );
		previewCanvas.addEventListener( 'mousemove', handlePreviewMouseMove, false );
		previewCanvas.addEventListener( 'wheel', handlePreviewMouseWheel, false );

		const previewTransform = new Object3D();
		const previewMatrixInverse = new Matrix4();
		const imageResX = settings.resolutionX;
		const imageResY = settings.resolutionY;
		const imageAspect = imageResY / imageResX;
		const previewAspect = previewWidth / previewHeight;
		const x0 = - previewWidth * 0.5;
		const x1 = previewWidth * 0.5;
		const y0 = - previewHeight * 0.5;
		const y1 = previewHeight * 0.5;
		if ( imageAspect > previewAspect ) {

			const s = settings.resolutionY / previewWidth;
			previewTransform.scale.set( s, s, 1 );

		}
		else {

			const s = settings.resolutionX / previewHeight;
			previewTransform.scale.set( s, s, 1 );

		}

		const pngImage = document.createElement( 'img' );

		pngImage.addEventListener( 'load', () => {

			previewTransform.updateMatrix();
			previewMatrixInverse.copy( previewTransform.matrix ).invert();

			scope.vec31.set( x0, y0, 0 );
			scope.vec31.applyMatrix4( previewTransform.matrix );
			const x0t = scope.vec31.x;
			const y0t = scope.vec31.y;

			scope.vec31.set( x1, y1, 0 );
			scope.vec31.applyMatrix4( previewTransform.matrix );
			const x1t = scope.vec31.x;
			const y1t = scope.vec31.y;

			previewCanvasCtx.fillRect( 0, 0, previewCanvas.width, previewCanvas.height );

			previewCanvasCtx.save();
			previewCanvasCtx.translate( previewCanvas.width * 0.5, previewCanvas.height * 0.5 );
			previewCanvasCtx.scale( 1, -1 );
			previewCanvasCtx.rotate( Math.PI * 0.5 );
			previewCanvasCtx.translate( - previewCanvas.width * 0.5, - previewCanvas.height * 0.5 );

			previewCanvasCtx.drawImage(
				pngImage,
				x0t + imageResX * 0.5,
				y0t + imageResY * 0.5,
				x1t - x0t,
				y1t - y0t,
				0,
				0,
				previewWidth,
				previewHeight
			);

			scope.vec31.set( - imageResX * 0.5, - imageResY * 0.5, 0 );
			scope.vec31.applyMatrix4( previewMatrixInverse );
			const x0t2 = scope.vec31.x;
			const y0t2 = scope.vec31.y;

			scope.vec31.set( imageResX * 0.5, imageResY * 0.5, 0 );
			scope.vec31.applyMatrix4( previewMatrixInverse );
			const x1t2 = scope.vec31.x;
			const y1t2 = scope.vec31.y;

			previewCanvasCtx.strokeRect(
				x0t2 + previewWidth * 0.5,
				y0t2 + previewHeight * 0.5,
				x1t2 - x0t2,
				y1t2 - y0t2
			);

			previewCanvasCtx.restore();

		} );

		function setPreviewLayer( layerNumber ) {

			const layerIndex = layerNumber - 1;

			const pngData = resinPrint.pngLayers[ layerIndex ];

			if ( pngData ) pngImage.src = URL.createObjectURL( new Blob( [ pngData.buffer ], { type: 'image/png' } ) );

		}

		let mouseX0 = null;
		let mouseY0 = null;

		function handlePreviewMouseDown( event ) {

			mouseX0 = event.clientX;
			mouseY0 = event.clientY;

			event.preventDefault();

		}

		function handlePreviewMouseUp( event ) {

			mouseX0 = null;
			mouseY0 = null;

			event.preventDefault();

		}

		function handlePreviewMouseMove( event ) {

			if ( mouseX0 === null ) return;

			event.preventDefault();

			const mouseDX = event.clientX - mouseX0;
			const mouseDY = - ( event.clientY - mouseY0 );

			mouseX0 = event.clientX;
			mouseY0 = event.clientY;

			scope.vec31.set( - mouseDY, mouseDX, 0 ).multiplyScalar( previewTransform.scale.x );

			previewTransform.position.add( scope.vec31 );

			setPreviewLayer( layerPreviewSliderData.layerNumber );

		}

		function handlePreviewMouseWheel( event ) {

			const scaleConstant = 1.25;

			let s = event.deltaY < 0 ? 1 / scaleConstant : ( event.deltaY > 0 ? scaleConstant : 0 );
			s *= previewTransform.scale.x;
			previewTransform.scale.set( s, s, 1 );

			setPreviewLayer( layerPreviewSliderData.layerNumber );

		}

		setPreviewLayer( layerPreviewSliderData.layerNumber );

	}

	createReliefEmbossDialog() {

		const scope = this;

		if ( this.reliefDialogShown ) return;
		this.reliefDialogShown = true;

		const previewSize = 256;
		const dialogSize = 600;

		const mainDialogDiv = document.createElement( 'div' );

		const panelUI = makePanelUI( dialogSize );

		let context = createContext();

		function createContext() {

			return Slicer.createContext(
				scope.data.reliefPresets[ scope.data.reliefPresetName ].randomSeed,
				scope.minceSlicer.project.images,
				scope.data.reliefPresets
			);

		}

		// Relief enable checkbox
		panelUI.uiController.add( this.data, 'reliefEnabled' )
			.name( "Relief/emboss enabled: " )
			.onFinishChange( ( value ) => {

				// TODO

				resetPreviewPanZoom();
				updateReliefPreview();

			}
		);

		// Collect presets names list
		const presetsNames = [ ];
		Object.keys( this.data.reliefPresets ).forEach( ( presetName ) => {

			presetsNames.push( presetName );

		} );

		// Preset selection combo
		const reliefPresetNameController = panelUI.uiController.add( this.data, 'reliefPresetName', presetsNames )
			.name( "Relief preset: " )
			.onFinishChange( () => {

				makeDynamicControllers();
				updateReliefPreview();

			} );

		// Clone preset button
		makeButton( panelUI.uiController, "Clone preset", () => {

			scope.makeQuestionDialog(

				"Please enter name for cloned relief preset:",
				scope.data.reliefPresetName + "_cloned",
				"OK",
				"CANCEL",
				( newName ) => {

					if ( ! newName ) {

						scope.minceSlicer.userMessage( "Invalid name", "warning" );
						return;

					}

					if ( scope.data.reliefPresets[ newName ] ) {

						scope.minceSlicer.userMessage( "Preset name already exists.", "warning" );
						return;

					}

					presetsNames.push( newName );
					scope.data.reliefPresets[ newName ] = JSON.parse( JSON.stringify( scope.data.reliefPresets[ scope.data.reliefPresetName ] ) );
					scope.data.reliefPresetName = newName;

					reliefPresetNameController.updateDisplay();
					closeDialog();
					scope.createReliefEmbossDialog();

				}

			);

		} );

		// Delete preset button
		makeButton( panelUI.uiController, "Delete preset", () => {

			scope.makeYesNoDialog( "Delete preset '" + scope.data.reliefPresetName + "'?", "Yes, delete preset", "No", () => {

				if ( Object.keys( scope.data.reliefPresets ).length === 1 ) {

					scope.minceSlicer.userMessage( "Can't delete all the presets.", "warning" );
					return;

				}

				const reliefIndex = presetsNames.indexOf( scope.data.reliefPresetName );
				if ( reliefIndex >= 0 ) presetsNames.splice( reliefIndex, 1 );
				delete scope.data.reliefPresets[ scope.data.reliefPresetName ]
				scope.data.reliefPresetName = Object.keys( scope.data.reliefPresets )[ 0 ];

				reliefPresetNameController.updateDisplay();
				closeDialog();
				scope.createReliefEmbossDialog();

			} );

		} );

		// Show close dialog button
		makeButton( panelUI.uiController, "CLOSE", closeDialog );

		function closeDialog() {

			scope.reliefDialogShown = false;
			document.body.removeChild( mainDialogDiv );
			deletePanelUI( panelUI );

			scope.minceSlicer.layerPlaneViewIsDirty = true;
			scope.minceSlicer.render();

		}

		let maxHeightController = null;
		let randomSeedController = null;
		let reliefNodeFolder = null;

		// Collect images names list

		const imagesNamesList = Object.keys( scope.minceSlicer.project.images );
		const noneIndex = imagesNamesList.indexOf( "None" );
		if ( noneIndex >= 0 ) imagesNamesList.splice( noneIndex, 1 );
		imagesNamesList.sort();
		imagesNamesList.unshift( "None" );

		// Collect node classes names list

		const nodeClassesNames = Object.keys( reliefNodeClasses ).sort();

		// Make controllers that depend on the preset

		makeDynamicControllers();

		function makeDynamicControllers() {

			const preset = scope.data.reliefPresets[ scope.data.reliefPresetName ];

			// Max relief height
			if ( maxHeightController ) panelUI.uiController.remove( maxHeightController );
			maxHeightController = panelUI.uiController.add(	preset, 'maxHeight' )
				.name( "Max. relief height/emboss depth (mm): " )
				.onFinishChange( ( value ) => {

				}
			);

			// Random seed
			if ( randomSeedController ) panelUI.uiController.remove( randomSeedController );
			randomSeedController = panelUI.uiController.add( preset, 'randomSeed', 0, 1, 0.0001 )
				.name( "Random seed (float): " )
				.onFinishChange( updateReliefPreview );

			if ( reliefNodeFolder ) panelUI.uiController.removeFolder( reliefNodeFolder );
			reliefNodeFolder = panelUI.uiController.addFolder( "Relief texture tree: " );
			makeReliefNodeController( reliefNodeFolder, preset, 'reliefNodeJSON' );
			reliefNodeFolder.open();

		}

		function makeReliefNodeController( parentFolderController, reliefNodeJSONObject, reliefNodeJSONProperty, reliefNodeJSONIndex ) {

			let reliefNodeJSON = reliefNodeJSONObject[ reliefNodeJSONProperty ];
			if ( reliefNodeJSONIndex !== undefined ) reliefNodeJSON = reliefNodeJSON[ reliefNodeJSONIndex ];

			const paramClass = reliefNodeClasses[ reliefNodeJSON.className ];
			if ( ! paramClass ) {

				scope.minceSlicer.userMessage( "Error creating nodes gui: Node class '" + reliefNodeJSON.className + "' not found.", "error" );
				return;

			}

			parentFolderController.add( reliefNodeJSON, 'className', nodeClassesNames )
				.name( "Node type: " )
				.onFinishChange( ( value ) => {

					// Get new node class
					const newParamClass = reliefNodeClasses[ reliefNodeJSON.className ];
					if ( ! newParamClass ) {

						scope.minceSlicer.userMessage( "Error creating default node gui: Node class '" + reliefNodeJSON.className + "' not found.", "error" );
						return;

					}

					// Remove all controllers and folders under parentFolderController
					while ( parentFolderController.__controllers.length > 0 ) {

						const c = parentFolderController.__controllers[ 0 ];
						parentFolderController.remove( c );

					}
					Object.keys( parentFolderController.__folders ).forEach( ( folderName ) => {

						const f = parentFolderController.__folders[ folderName ];
						if ( f ) parentFolderController.removeFolder( f );

					} );

					// Assign new node json object
					const newNodeValue = JSON.parse( JSON.stringify( newParamClass.defaultNodeValue ) );
					if ( reliefNodeJSONIndex !== undefined ) {

						reliefNodeJSONObject[ reliefNodeJSONProperty ][ reliefNodeJSONIndex ] = newNodeValue;

					}
					else {

						reliefNodeJSONObject[ reliefNodeJSONProperty ] = newNodeValue;

					}

					// Create ui controls for new node
					makeReliefNodeController( parentFolderController, reliefNodeJSONObject, reliefNodeJSONProperty, reliefNodeJSONIndex );

					updateReliefPreview();

				} );

			const numParametersDefinitions = paramClass.parameters.length;
			const numParametersValues = reliefNodeJSON.parameterValues.length;

			if ( numParametersDefinitions !== numParametersValues ) {

				scope.minceSlicer.userMessage( "Error creating nodes gui (Node class " + paramClass.className + "): Expected " + numParametersDefinitions +
					" parameters values, but received " + numParametersValues + ".", "error" );
				return;

			}

			let nodeFolder = null;

			for ( let i = 0; i < numParametersDefinitions; i ++ ) {

				const paramDefinition = paramClass.parameters[ i ];

				switch ( paramDefinition.type ) {

					case 'string':

						if ( i === 0 && paramDefinition.name === 'Mode' ) {

							parentFolderController.add( reliefNodeJSON.parameterValues, i,
									[ Constants.RELIEF, Constants.EMBOSS, Constants.RELIEF_EMBOSS ]
								)
							.name( paramDefinition.name + ":" )
							.onFinishChange( controllerValueChanged );

						}
						else {

							parentFolderController.add(	reliefNodeJSON.parameterValues, i )
								.name( paramDefinition.name + ":" )
								.onFinishChange( controllerValueChanged );

						}
						break;

					case 'boolean':
					case 'number':

						parentFolderController.add(	reliefNodeJSON.parameterValues, i )
							.name( paramDefinition.name + ":" )
							.onFinishChange( controllerValueChanged );
						break;

					case 'node':

						nodeFolder = parentFolderController.addFolder( paramDefinition.name + ":" );
						makeReliefNodeController( nodeFolder, reliefNodeJSON, 'parameterValues', i );
						break;

					case 'nodearray':

						nodeFolder = parentFolderController.addFolder( paramDefinition.name + ":" );
						createNodeArrayController( nodeFolder, paramDefinition, reliefNodeJSON.parameterValues, i );
						break;

					case 'image':

						parentFolderController.add(	reliefNodeJSON.parameterValues, i, imagesNamesList )
								.name( paramDefinition.name + ":" )
								.onFinishChange( controllerValueChanged );

						break;

					case 'preset':

						parentFolderController.add(	reliefNodeJSON.parameterValues, i, presetsNames )
								.name( paramDefinition.name + ":" )
								.onFinishChange( controllerValueChanged );

						break;

					default:
						break;

				}

			}

			function controllerValueChanged() {

				updateReliefPreview();

			}

			function createNodeArrayController( nodeFolder, paramDefinition, parameterValues, parameterIndex ) {

				// Remove all controllers and folders under nodeFolder
				while ( nodeFolder.__controllers.length > 0 ) {

					const c = nodeFolder.__controllers[ 0 ];
					nodeFolder.remove( c );

				}
				Object.keys( nodeFolder.__folders ).forEach( ( folderName ) => {

					const f = nodeFolder.__folders[ folderName ];
					if ( f ) nodeFolder.removeFolder( f );

				} );

				// Create controller for number of nodes

				const numberOfNodesData = {
					numberOfNodes: parameterValues[ parameterIndex ].length
				};

				nodeFolder.add(	numberOfNodesData, "numberOfNodes", 0, 20, 1 )
					.name( "Number of " + paramDefinition.name + ":" )
					.onFinishChange( () => {

						// Reset nodes array
						parameterValues[ parameterIndex ] = [ ];
						for ( let i = 0; i < numberOfNodesData.numberOfNodes; i ++ ) {

							parameterValues[ parameterIndex ].push( {
								className: 'Constant',
								parameterValues: [ 0 ]
							} );

						}

						// Re-create controllers
						createNodeArrayController( nodeFolder, paramDefinition, parameterValues, parameterIndex );

					}
				);

				// Create array nodes controllers

				for ( let j = 0, jl = parameterValues[ parameterIndex ].length; j < jl; j ++ ) {

					const subNodeFolder = nodeFolder.addFolder( paramDefinition.name + "[ " + j + " ]:" );
					makeReliefNodeController( subNodeFolder, parameterValues, parameterIndex, j );

				}
			}

		}

		// Layer preview image

		const previewCanvas = document.createElement( 'canvas' );
		previewCanvas.width = previewSize;
		previewCanvas.height = previewSize;
		previewCanvas.style.left = "50%";
		previewCanvas.style.top = "0px";
		previewCanvas.style.transform = "translate(50%, 0%)";
		const previewCanvasCtx = previewCanvas.getContext( '2d' );
		previewCanvasCtx.imageSmoothingEnabled = false;
		previewCanvasCtx.fillStyle = 'black';
		previewCanvasCtx.fillRect( 0, 0, previewCanvas.width, previewCanvas.height );

		// Compose dialog

		mainDialogDiv.style.position = "absolute";
		mainDialogDiv.style.width = dialogSize + "px";
		mainDialogDiv.style.top = "24px";
		mainDialogDiv.style.bottom = "0px";
		mainDialogDiv.style.left = "50%";
		mainDialogDiv.style.transform = "translate(-50%, 0%)";


		panelUI.div.style.backgroundColor = "#303030";
		panelUI.div.style.overflowX = "hidden";
		panelUI.div.style.overflowY = "scroll";
		panelUI.div.style.top = previewSize + "px";
		panelUI.div.style.bottom = "0px";
		panelUI.div.style.transform = "translate(-50%, 0%)";

		mainDialogDiv.appendChild( previewCanvas );
		mainDialogDiv.appendChild( panelUI.div );
		document.body.appendChild( mainDialogDiv );

		// Preview zoom and panning

		previewCanvas.addEventListener( 'mousedown', handlePreviewMouseDown, false );
		previewCanvas.addEventListener( 'mouseup', handlePreviewMouseUp, false );
		previewCanvas.addEventListener( 'mouseenter', handlePreviewMouseUp, false );
		previewCanvas.addEventListener( 'mousemove', handlePreviewMouseMove, false );
		previewCanvas.addEventListener( 'wheel', handlePreviewMouseWheel, false );

		const previewTransform = new Object3D();
		const previewMatrixInverse = new Matrix4();
		const tempMatrix = new Matrix4().compose( this.vec31.set( -1, -1, 0 ), new Quaternion(), this.vec32.set( 2, 2, 1 ) );

		function updateReliefPreview() {

			if ( ! scope.data.reliefEnabled ) {

				previewCanvasCtx.fillRect( 0, 0, previewCanvas.width, previewCanvas.height );
				return;

			}

			const preset = scope.data.reliefPresets[ scope.data.reliefPresetName ];

			context.images = scope.minceSlicer.project.images;
			context.presets = scope.data.reliefPresets;
			const reliefNode = ReliefNode.makeReliefTreeFromJSON( preset.reliefNodeJSON, context );

			if ( ! reliefNode ) {

				previewCanvasCtx.fillRect( 0, 0, previewCanvas.width, previewCanvas.height );
				return;

			}

			previewTransform.updateMatrix();
			previewMatrixInverse.copy( previewTransform.matrix ).multiply( tempMatrix ).invert();

			const imageData = previewCanvasCtx.getImageData( 0, 0, previewCanvas.width, previewCanvas.height );
			const data = imageData.data;

			scope.vec32.set( 0, 1, 0 );

			let p = 0;
			for ( let j = 0, jl = previewCanvas.height; j < jl; j ++ ) {
				for ( let i = 0, il = previewCanvas.width; i < il; i ++ ) {

					const x = 2 * i / il - 1;
					const y = 2 * ( jl - j ) / jl - 1;

					scope.vec31.set( x, y, 0 );
					scope.vec31.applyMatrix4( previewMatrixInverse );

					scope.vec21.copy( scope.vec31 );
					const u = scope.vec21.x;
					const v = scope.vec21.y;

					let r = 30;
					let g = 40;
					let b = 75;

					if ( u >= 0 && v >= 0 && u <= 1 && v <= 1 ) {

						const reliefValue = Math.floor( 255 * reliefNode.evaluate( scope.vec21, scope.vec31, scope.vec32, 0 ) );

						if ( reliefValue < 0 ) {

							r = 0;
							g = - reliefValue;
							b = 0;

						}
						else {

							r = g = b = reliefValue;

						}

					}

					data[ p ++ ] = r;
					data[ p ++ ] = g;
					data[ p ++ ] = b;
					data[ p ++ ] = 255;

				}
			}

			previewCanvasCtx.putImageData( imageData, 0, 0 );

		}

		function resetPreviewPanZoom() {

			previewTransform.position.set( 0, 0, 0 );
			previewTransform.scale.set( 1, 1, 1 );

		}

		let mouseX0 = null;
		let mouseY0 = null;

		function handlePreviewMouseDown( event ) {

			if ( event.button !== 0 ) return;

			mouseX0 = event.clientX;
			mouseY0 = event.clientY;

			event.preventDefault();

		}

		function handlePreviewMouseUp( event ) {

			if ( event.button !== 0 ) return;

			mouseX0 = null;
			mouseY0 = null;

			event.preventDefault();

		}

		function handlePreviewMouseMove( event ) {

			if ( event.button !== 0 || mouseX0 === null ) return;

			event.preventDefault();

			const mouseDX = 2 * ( event.clientX - mouseX0 ) / previewCanvas.width;
			const mouseDY = - 2 * ( event.clientY - mouseY0 ) / previewCanvas.height;

			mouseX0 = event.clientX;
			mouseY0 = event.clientY;

			scope.vec31.set( mouseDX, mouseDY, 0 );

			previewTransform.position.add( scope.vec31 );

			updateReliefPreview();

		}

		function handlePreviewMouseWheel( event ) {

			const scaleConstant = 1.25;

			let s = event.deltaY < 0 ? scaleConstant : ( event.deltaY > 0 ? 1 / scaleConstant : 0 );

			previewTransform.position.multiplyScalar( s );

			s *= previewTransform.scale.x;
			previewTransform.scale.set( s, s, 1 );

			updateReliefPreview();

		}

		updateReliefPreview();

	}

	createLicenseAcceptDialog() {

		if ( this.data.isLicenseAccepted ) return;

		const scope = this;

		const width = 700;
		const height = 400;

		const panelUI = makePanelUI( width );
		document.body.appendChild( panelUI.div );

		makeCheckbox( panelUI.uiController, "I understand, do not show this license message again.", null, this.data, 'isLicenseAccepted' );
		makeButton( panelUI.uiController, "Accept the MIT License.", () => {

			scope.saveGUIDataToLocalStorage();
			deletePanelUI( panelUI );
			document.body.removeChild( panelUI.div );

		} );

		const licenseText =
`
Welcome to Mince Slicer!

Keep in mind this is experimental software and its use may destroy your printer.

By using this software you accept its MIT License. The MIT License text is reproduced below.

---

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

`;

		const licenseDiv = document.createElement( 'div' );

		const paragraphs = licenseText.split( '\n' );

		for ( let i = 0; i < paragraphs.length; i ++ ) {

			const paragraph = document.createElement( 'p' );
			paragraph.innerHTML = paragraphs[ i ];
			licenseDiv.appendChild( paragraph );

		}

		const scrolledDiv = document.createElement( 'div' );
		scrolledDiv.style.overflowY = "scroll";
		scrolledDiv.style.width = width + "px";
		scrolledDiv.style.height = height + "px";
		scrolledDiv.style.backgroundColor = "#303030";

		scrolledDiv.appendChild( licenseDiv );

		panelUI.div.insertBefore( scrolledDiv, panelUI.uiController.domElement );

	}

}

export { MinceSlicerUI };
