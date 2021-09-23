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

class ResinGCode {

	constructor( gcodeText ) {

		this.gcodeText = gcodeText || "";

		this.settingsNames = [
			'fileName',
			'machineType',
			'estimatedPrintTime',
			'volume',
			'resin',
			'weight',
			'price',
			'layerHeight',
			'resolutionX',
			'resolutionY',
			'machineX',
			'machineY',
			'machineZ',
			'projectType',
			'normalExposureTime',
			'bottomLayExposureTime',
			'bottomLayerExposureTime',
			'normalDropSpeed',
			'normalLayerLiftHeight',
			'zSlowUpDistance',
			'normalLayerLiftSpeed',
			'bottomLayCount',
			'bottomLayerCount',
			'mirror',
			'totalLayer',
			'bottomLayerLiftHeight',
			'bottomLayerLiftSpeed',
			'bottomLightOffTime',
			'lightOffTime'
		];

	}

	getSettings() {

		const settings = { };

		for ( let i = 0; i < this.settingsNames.length; i ++ ) {

			const settingName = this.settingsNames[ i ];
			settings[ settingName ] = this.getSettingValue( settingName );

		}

		function settingValueToInt( settingName ) {

			settings[ settingName ] = parseInt( settings[ settingName ] );

		}

		function settingValueToFloat( settingName ) {

			settings[ settingName ] = parseFloat( settings[ settingName ] );

		}

		function settingValueToFloat2( settingName ) {

			settings[ settingName ] = Math.round( parseFloat( settings[ settingName ] ) * 100 ) / 100;

		}

		//'fileName',
		//'machineType',
		settingValueToFloat2( 'estimatedPrintTime' );
		settingValueToFloat2( 'volume' );
		settingValueToFloat2( 'weight' );
		settingValueToFloat2( 'price' );
		settingValueToFloat2( 'layerHeight' );
		settingValueToInt( 'resolutionX' );
		settingValueToInt( 'resolutionY' );
		settingValueToFloat2( 'machineX' );
		settingValueToFloat2( 'machineY' );
		settingValueToFloat2( 'machineZ' );
		//'projectType',
		settingValueToFloat2( 'normalExposureTime' );
		settingValueToFloat2( 'bottomLayExposureTime' );
		settingValueToFloat2( 'bottomLayerExposureTime' );
		settingValueToFloat2( 'normalDropSpeed' );
		settingValueToFloat2( 'normalLayerLiftHeight' );
		settingValueToFloat2( 'zSlowUpDistance' );
		settingValueToFloat2( 'normalLayerLiftSpeed' );
		settingValueToInt( 'bottomLayCount' );
		settingValueToInt( 'bottomLayerCount' );
		settingValueToInt( 'mirror' );
		settingValueToInt( 'totalLayer' );
		settingValueToFloat2( 'bottomLayerLiftHeight' );
		settingValueToFloat2( 'bottomLayerLiftSpeed' );
		settingValueToFloat2( 'bottomLightOffTime' );
		settingValueToFloat2( 'lightOffTime' );

		return settings;

	}

	setSettings( settings ) {

		for ( let i = 0; i < this.settingsNames.length; i ++ ) {

			const settingName = this.settingsNames[ i ];
			this.setSettingValue( settingName, settings[ settingName ] );

		}

	}

	checkSettings( settings ) {

		// Returns error string or null if OK

		function settingError( settingName ) {

			return "Setting named '" + settingName + "'";

		}

		function checkNumericSettingIsPositive( settingName, canBeZero ) {

			const value = settings[ settingName ];

			if ( isNaN( value ) ) {

				return settingError( settingName ) + " is not a number.";

			}
			if ( value < 0 ) {

				return settingError( settingName ) + " is negative (value: " + settings[ settingName ] + ")";

			}
			else if ( value === 0 && ! canBeZero ) {

				return settingError( settingName ) + " is zero.";

			}

			return null;

		}

		for ( let i = 0; i < this.settingsNames.length; i ++ ) {

			const settingName = this.settingsNames[ i ];
			const settingValue = settings[ settingName ];

			if ( settingValue === null ) return settingError( settingName ) + " has null value.";
			if ( settingValue === undefined ) return settingError( settingName ) + " is undefined.";

		}

		let err;
		err = checkNumericSettingIsPositive( 'estimatedPrintTime', true );	if ( err ) return err;
		err = checkNumericSettingIsPositive( 'volume', true );				if ( err ) return err;
		err = checkNumericSettingIsPositive( 'weight', true );				if ( err ) return err;
		err = checkNumericSettingIsPositive( 'price', true );				if ( err ) return err;
		err = checkNumericSettingIsPositive( 'layerHeight' );				if ( err ) return err;
		err = checkNumericSettingIsPositive( 'resolutionX' );				if ( err ) return err;
		err = checkNumericSettingIsPositive( 'resolutionY' );				if ( err ) return err;
		err = checkNumericSettingIsPositive( 'normalExposureTime' );		if ( err ) return err;
		err = checkNumericSettingIsPositive( 'bottomLayExposureTime' );		if ( err ) return err;
		err = checkNumericSettingIsPositive( 'bottomLayerExposureTime' );	if ( err ) return err;
		err = checkNumericSettingIsPositive( 'normalDropSpeed' );			if ( err ) return err;
		err = checkNumericSettingIsPositive( 'normalLayerLiftHeight' );		if ( err ) return err;
		err = checkNumericSettingIsPositive( 'zSlowUpDistance', true );		if ( err ) return err;
		err = checkNumericSettingIsPositive( 'normalLayerLiftSpeed' );		if ( err ) return err;
		err = checkNumericSettingIsPositive( 'bottomLayCount', true );		if ( err ) return err;
		err = checkNumericSettingIsPositive( 'bottomLayerCount', true );	if ( err ) return err;
		err = checkNumericSettingIsPositive( 'totalLayer', true );			if ( err ) return err;
		err = checkNumericSettingIsPositive( 'bottomLayerLiftHeight' );		if ( err ) return err;
		err = checkNumericSettingIsPositive( 'bottomLayerLiftSpeed' );		if ( err ) return err;
		err = checkNumericSettingIsPositive( 'bottomLightOffTime', true );	if ( err ) return err;
		err = checkNumericSettingIsPositive( 'lightOffTime', true );		if ( err ) return err;

		if ( settings.machineZ < settings.totalLayer * settings.layerHeight ) {

			return "Number of layers * layer height (" +
				( settings.totalLayer * settings.layerHeight ) +
				") exceeds maximum machine Z build volume (" +
				settings.machineZ +
				")";

		}


		return null;

	}

	printSettingsToString( settings ) {

		let s = "";

		for ( let i = 0, il = this.settingsNames.length; i < il; i ++ ) {

			const settingName = this.settingsNames[ i ];
			s += ";" + settingName + ":" + settings[ settingName ] + ( i < il - 1 ? '\n' : '');

		}

		return s;

	}

	getSettingValue( settingName ) {

		const searchString = ";" + settingName + ":";

		const posSetting = this.gcodeText.indexOf( searchString );
		if ( posSetting < 0 ) return null;

		const posStartValue = posSetting + searchString.length;
		const posLineEnd = this.gcodeText.indexOf( '\n', posStartValue );

		return this.gcodeText.substring( posStartValue, posLineEnd < 0 ? undefined : posLineEnd );

	}

	setSettingValue( settingName, settingValue ) {

		const searchString = ";" + settingName + ":";

		const posSetting = this.gcodeText.indexOf( searchString );
		if ( posSetting < 0 ) {

			this.gcodeText += "\n" + searchString + settingValue;
			return;
		}

		const posLineEnd = this.gcodeText.indexOf( '\n', posSetting );

		this.gcodeText = this.stringReplaceAt( this.gcodeText, posSetting, posLineEnd < 0 ? this.gcodeText.length : posLineEnd - posSetting, searchString + settingValue );

	}


	stringReplaceAt( str, index, length, replacement ) {

		return str.substring( 0, index ) + replacement + str.substr( index + length );

	}

}

export { ResinGCode };
