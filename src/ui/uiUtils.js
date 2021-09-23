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

import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

// Utility functions

function saveFile( fileName, blob ) {

	const link = window.document.createElement( "a" );
	link.href = window.URL.createObjectURL( blob );
	link.download = fileName;
	document.body.appendChild( link );
	link.click();
	document.body.removeChild( link );

}

function makeButton( gui, buttonLabel, theFunction ) {

	// Returns the button controller

	if ( ! theFunction ) theFunction = () => { };

	const buttonData = {
		button: theFunction
	};

	return gui.add( buttonData, 'button' ).name( buttonLabel );

}

function makeCheckbox( gui, checkboxLabel, theFunction, data, property ) {

	// Returns the checkbox controller

	if ( ! data ) {

		if ( ! property ) property = 'checked';

		data = { };
		data[ property ] = false;

	}

	const controller = gui.add( data, property ).name( checkboxLabel );
	if ( theFunction ) controller.onChange( theFunction );

	return controller;

}

function makeProgressBar( gui, label ) {

	// Returns object with properties

	const progressBarData = {
		progress: 0
	};

	const controller = makeControllerReadOnly( gui.add( progressBarData, 'progress', 0, 100, 0.1 ).name( label ) );

	function setProgress( percentage ) {

		controller.setValue( percentage );

	}

	return {
		controller: controller,
		setProgress: setProgress
	};

}

function makeControllerReadOnly( controller, alpha ) {

	controller.domElement.style.pointerEvents = "none"
	controller.domElement.style.opacity = alpha === undefined ? .85 : alpha;

	return controller;

}

function makePanelUI( width ) {

	const uiController = new GUI( { autoPlace: false, hideable: false } );
	uiController.width = width;

	const div = document.createElement( 'div' );
	div.appendChild( uiController.domElement );
	div.style.position = "absolute";
	div.style.top = "50%";
	div.style.left = "50%";
	div.style.transform = "translate(-50%, -50%)";

	return {
		div: div,
		uiController: uiController
	};

}

function deletePanelUI( panelUI ) {

	panelUI.uiController.destroy();

}


export {
	saveFile,
	makeButton,
	makeCheckbox,
	makeProgressBar,
	makeControllerReadOnly,
	makePanelUI,
	deletePanelUI
};