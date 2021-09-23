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

import * as Constants from './Constants.js';
import { reliefNodeClasses } from './reliefNodeClasses.js';

class ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		this.isReliefNode = true;

		this.name = name;
		this.parameterValues = parameterValues;

		if ( parameterSignatures.length > 0 && parameterSignatures[ 0 ].name === 'Mode' ) {

			this.mode = parameterValues[ 0 ];
			switch ( this.mode ) {

				case Constants.RELIEF:
					this.ceil = 1;
					this.floor = 0;
					break;

				case Constants.EMBOSS:
					this.ceil = 0;
					this.floor = - 1;
					break;

				case Constants.RELIEF_EMBOSS:
				default:
					this.ceil = 1;
					this.floor = - 1;
					break;			}

		}

		this.context = context;

	}

	evaluate( uv, pos, normal, materialIndex ) {

		return 0;

	}

	isValid() {

		// Returns null on success or error string

		const reliefNodeClass = reliefNodeClasses[ this.className ];

		if ( ! reliefNodeClass ) return "Unknown node class '" + this.className + "'.";

		if ( reliefNodeClass.parameters.length !== this.parameterValues.length ) {

			return "Node of class '" +
				this.className + "' inited with wrong number of arguments (expected " + reliefNodeClass.parameters.length +
				", but " + this.parameterValues.length + " were provided)";

		}

		for ( let i = 0, il = reliefNodeClass.parameters.length; i < il; i ++ ) {

			const err = this.isParameterValid( reliefNodeClass.parameters[ i ], this.parameterValues[ i ] );
			if ( err ) return "(In node class '" + this.className + "', parameter " + i + ") --> " + err;

		}

		return null;

	}

	isParameterValid( parameterDefinition, value ) {

		// Returns null on success or error string

		let err = null;

		switch( parameterDefinition.type ) {

			case 'boolean':
				return ( typeof value === 'boolean' ) ? null : "Expected boolean value for '" + parameterDefinition.name + "' parameter, but '" + ( typeof value ) + "' was provided.";

			case 'string':
				return ( typeof value === 'string' ) ? null : "Expected string value for '" + parameterDefinition.name + "' parameter, but '" + ( typeof value ) + "' was provided.";

			case 'number':
				return ( typeof value === 'number' ) ? null : "Expected number value for '" + parameterDefinition.name + "' parameter, but '" + ( typeof value ) + "' was provided.";

			case 'node':
				if ( ! value || ! value.isReliefNode ) return "Expected node value, but '" + ( typeof value ) + "' was provided.";
				err = value.isValid();
				if ( err ) return "Node parameter '" + parameterDefinition.name + "' is not Valid: " + err;
				return null;

			case 'nodearray':
				if ( ! value || ! Array.isArray( value ) ) return "Expected node array value, but '" + ( typeof value ) + "' was provided.";
				for ( let i = 0; i < value.length; i ++ ) {

					err = value[ i ].isValid();
					if ( err ) return "Node parameter '" + parameterDefinition.name + "[ " + i + " ]' is not Valid: " + err;

				}
				return null;

			case 'image':
				//return ( ( value !== null ) && ! value.isImage ) ? null : "Expected image value for '" + parameterDefinition.name + "' parameter, but '" + ( typeof value ) + "' was provided.";
				return ( typeof value === 'string' ) ? null : "Expected image name string value for '" + parameterDefinition.name + "' parameter, but '" + ( typeof value ) + "' was provided.";

			case 'preset':
				if ( ! value || ! value.isReliefNode ) return "Expected preset node value, but '" + ( typeof value ) + "' was provided.";
				err = value.isValid();
				if ( err ) return "Preset node parameter '" + parameterDefinition.name + "' is not Valid: " + err;
				return null;

			default:
				return null;

		}

	}

	static makeReliefTreeFromJSON( json, context ) {

		function makeNode( json ) {

			if ( ! json || typeof json !== 'object' ) return null;
			const reliefClassDefinition = reliefNodeClasses[ json.className ];
			if ( typeof reliefClassDefinition !== 'object' ) return null;
			const classObject = reliefClassDefinition.classObject;
			if ( ! Array.isArray( json.parameterValues ) ) return null;
			const parameterValues = [ ];
			for ( let i = 0, il = json.parameterValues.length; i < il; i ++ ) {

				const parameterType = reliefClassDefinition.parameters[ i ].type;

				let paramValueJSON = json.parameterValues[ i ];
				let value = paramValueJSON;

				switch ( parameterType ) {

					case 'node':
						if ( paramValueJSON && typeof paramValueJSON === 'object' && ! paramValueJSON.isImage && ! paramValueJSON.reliefNodeJSON ) {

							value = makeNode( paramValueJSON );

						}
						break;

					case 'nodearray':
						if ( paramValueJSON && Array.isArray( paramValueJSON ) ) {

							value = [ ];
							for ( let i = 0; i < paramValueJSON.length; i ++ ) {

								value.push( makeNode( paramValueJSON[ i ] ) );

							}

						}
						break;

					case 'preset':
console.log( "amem 1" );
						if ( paramValueJSON && typeof paramValueJSON === 'string' ) {
console.log( "amem 2" );
							const preset = context.presets[ paramValueJSON ];
							if ( preset && preset.reliefNodeJSON ) value = makeNode( preset.reliefNodeJSON );

						}

						break;
				}

				parameterValues.push( value );
			}

			const node = new classObject( json.name, reliefClassDefinition.parameters, parameterValues, context );

			return node;

		}

		return makeNode( json );

	}

}

export { ReliefNode };
