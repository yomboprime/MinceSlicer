/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 729:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {


// EXTERNAL MODULE: ./node_modules/fast-png/lib-esm/index.js
var lib_esm = __webpack_require__(470);
// EXTERNAL MODULE: ./node_modules/three/build/three.module.js
var three_module = __webpack_require__(212);
// EXTERNAL MODULE: ./node_modules/three/examples/jsm/utils/BufferGeometryUtils.js
var BufferGeometryUtils = __webpack_require__(140);
// EXTERNAL MODULE: ./node_modules/three-mesh-bvh/src/MeshBVH.js
var MeshBVH = __webpack_require__(716);
// EXTERNAL MODULE: ./node_modules/three/examples/jsm/math/SimplexNoise.js
var SimplexNoise = __webpack_require__(866);
;// CONCATENATED MODULE: ./src/utils/Random.js
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

class RandomGenerator {

	constructor() {

	}

	random() {

		return null;

	}

	getSeed() {

		return null;

	}

	setSeed( seed ) { }

}


class MathRandomGenerator {

	constructor() {

	}

	random() {

		return Math.random();

	}

}

const pnrgLimit = 1E+7;

class PseudoRandomGenerator {

	constructor() {

		this.state1 = 0;
		this.state2 = 0;

		this.mod1 = 4294967087;
		this.mul1 = 65539;
		this.mod2 = 4294965887;
		this.mul2 = 65537;

	}

	random() {

        do {

			this.state1 = ( this.state1 * this.mul1 ) % this.mod1;
			this.state2 = ( this.state2 * this.mul2 ) % this.mod2;

        } while (
			this.state1 < pnrgLimit &&
			this.state2 < pnrgLimit &&
			this.state1 < this.mod1 % pnrgLimit &&
			this.state2 < this.mod2 % pnrgLimit
		);

        return ( ( this.state1 + this.state2 ) % pnrgLimit  ) / pnrgLimit ;

	}

	getSeed() {

		return ( this.state1 % pnrgLimit  ) / pnrgLimit;

	}

	setSeed( seed ) {

		this.state1 = Math.floor( seed * pnrgLimit  ) % ( this.mod1 - 1 ) + 1;
		this.state2 = Math.floor( seed * pnrgLimit  ) % ( this.mod2 - 1 ) + 1;

	}

}

class CachedRandomGenerator {

	constructor( size, generator, seed ) {

		this.seeds = [ ];
		this.size = size;

		generator.setSeed( seed );
		for ( let i = 0; i < size; i ++ ) {

			this.seeds.push( generator.random() );
		}

		this.currentSeedPos = 0;

	}

	random() {

		const value = this.seeds[ this.currentSeedPos ];

		this.currentSeedPos = ( this.currentSeedPos + 1 ) % this.size;

		return value;

	}

	getSeed() {

		return this.currentSeedPos / this.size;

	}

	setSeed( seed ) {

		this.currentSeedPos = Math.floor( seed * this.size ) % this.size;

	}

}



;// CONCATENATED MODULE: ./src/nodes/Constants.js
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

const RELIEF = 'Relief (0..1)';
const EMBOSS = 'Emboss (-1..0)';
const RELIEF_EMBOSS = 'Both (-1..1)';

;// CONCATENATED MODULE: ./src/nodes/ReliefNode.js
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




class ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		this.isReliefNode = true;

		this.name = name;
		this.parameterValues = parameterValues;

		if ( parameterSignatures.length > 0 && parameterSignatures[ 0 ].name === 'Mode' ) {

			this.mode = parameterValues[ 0 ];
			switch ( this.mode ) {

				case RELIEF:
					this.ceil = 1;
					this.floor = 0;
					break;

				case EMBOSS:
					this.ceil = 0;
					this.floor = - 1;
					break;

				case RELIEF_EMBOSS:
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



;// CONCATENATED MODULE: ./src/nodes/ReliefNodeConstant.js
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



class ReliefNodeConstant extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'Constant';

		this.theConstant = parameterValues[ 0 ];

	}

	evaluate( uv, pos, normal, materialIndex ) { return this.theConstant; }

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodeImageUV.js
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



class ReliefNodeImageUV extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'ImageUV';

		this.imageSizeU = parameterValues[ 1 ];
		this.imageSizeV = parameterValues[ 2 ];

		this.offsetU = parameterValues[ 3 ];
		this.offsetV = parameterValues[ 4 ];

		const image = this.context.images[ parameterValues[ 5 ] ];

		this.imageValid = ( image != null ) && image.isImage && ( image.data !== null );
		this.imageData = this.imageValid ? image.data : null;
		this.width = this.imageValid ? image.width : null;
		this.height = this.imageValid ? image.height : null;

		this.range = this.ceil - this.floor;
		this.grayScaleConstant = this.range / 255;

	}

	evaluate( uv, pos, normal, materialIndex ) {

		if ( ! this.imageValid ) return 0;

		const u = ( uv.x - this.offsetU ) / this.imageSizeU;
		const v = 1 - ( uv.y - this.offsetV ) / this.imageSizeV;

		if ( u < 0 || u > 1 || v < 0 || v > 1 ) return 0;

		const p = Math.floor( v * this.height ) * this.width + Math.floor( u * this.width );

		return this.imageData[ p ] * this.grayScaleConstant + this.floor;

	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodeCell.js
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



class ReliefNodeCell extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.sizeU = parameterValues[ 1 ];
		this.sizeV = parameterValues[ 2 ];

	}

	static coordinateToCell( x, size, normal ) {

		return ( ( x % size ) / size - 0.5 ) * 2;

	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodeImageTiledUV.js
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



class ReliefNodeImageTiledUV extends ReliefNodeCell {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'ImageTiledUV';

		this.imageSizeU = parameterValues[ 3 ];
		this.imageSizeV = parameterValues[ 4 ];

		this.offsetU = parameterValues[ 5 ];
		this.offsetV = parameterValues[ 6 ];

		const image = this.context.images[ parameterValues[ 7 ] ];

		this.imageValid = ( image != null ) && image.isImage && ( image.data !== null );
		this.imageData = this.imageValid ? image.data : null;
		this.width = this.imageValid ? image.width : null;
		this.height = this.imageValid ? image.height : null;

		this.range = this.ceil - this.floor;
		this.grayScaleConstant = this.range / 255;

	}

	evaluate( uv, pos, normal, materialIndex ) {

		if ( ! this.imageValid ) return 0;

		const sizeU = this.sizeU.evaluate( uv, pos, normal, materialIndex );
		const sizeV = this.sizeV.evaluate( uv, pos, normal, materialIndex );

		const u = ( ReliefNodeCell.coordinateToCell( uv.x, sizeU ) - this.offsetU ) / this.imageSizeU;
		const v = 1 - ( ReliefNodeCell.coordinateToCell( uv.y, sizeV ) - this.offsetV ) / this.imageSizeV;

		if ( u < 0 || u > 1 || v < 0 || v > 1 ) return 0;

		const p = Math.floor( v * this.height ) * this.width + Math.floor( u * this.width );

		return this.imageData[ p ] * this.grayScaleConstant + this.floor;

	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodeAdd.js
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



class ReliefNodeAdd extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'Add';

		this.aNode = parameterValues[ 0 ];
		this.bNode = parameterValues[ 1 ];

	}

	evaluate( uv, pos, normal, materialIndex ) {

		return this.aNode.evaluate( uv, pos, normal, materialIndex  ) + this.bNode.evaluate( uv, pos, normal, materialIndex  );

	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodeNegate.js
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



class ReliefNodeNegate extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'Negate';

		this.aNode = parameterValues[ 0 ];

	}

	evaluate( uv, pos, normal, materialIndex ) {

		return - this.aNode.evaluate( uv, pos, normal, materialIndex );

	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodeMultiply.js
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



class ReliefNodeMultiply extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'Multiply';

		this.aNode = parameterValues[ 0 ];
		this.bNode = parameterValues[ 1 ];

	}

	evaluate( uv, pos, normal, materialIndex ) {

		return this.aNode.evaluate( uv, pos, normal, materialIndex ) * this.bNode.evaluate( uv, pos, normal, materialIndex );

	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodeDivide.js
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



class ReliefNodeDivide extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'Divide';

		this.aNode = parameterValues[ 0 ];
		this.bNode = parameterValues[ 1 ];

	}

	evaluate( uv, pos, normal, materialIndex ) {

		return this.aNode.evaluate( uv, pos, normal, materialIndex ) / this.bNode.evaluate( uv, pos, normal, materialIndex );

	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodePower.js
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



class ReliefNodePower extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'Power';

		this.aNode = parameterValues[ 0 ];
		this.bNode = parameterValues[ 1 ];

	}

	evaluate( uv, pos, normal, materialIndex ) {

		return Math.pow( this.aNode.evaluate( uv, pos, normal, materialIndex ), this.bNode.evaluate( uv, pos, normal, materialIndex ) );

	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodeSin.js
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



class ReliefNodeSin extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'Sin';

		this.aNode = parameterValues[ 1 ];

		this.range = this.ceil - this.floor;

	}

	evaluate( uv, pos, normal, materialIndex ) {

		return this.floor + this.range * ( 0.5 * Math.sin( this.aNode.evaluate( uv, pos, normal, materialIndex ) ) + 0.5 );

	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodeCos.js
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



class ReliefNodeCos extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'Cos';

		this.aNode = parameterValues[ 0 ];

	}

	evaluate( uv, pos, normal, materialIndex ) {

		return this.floor + this.range * ( 0.5 * Math.cos( this.aNode.evaluate( uv, pos, normal, materialIndex ) ) + 0.5 );

	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodeMix.js
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



class ReliefNodeMix extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'Mix';

		this.aNode = parameterValues[ 0 ];
		this.bNode = parameterValues[ 1 ];
		this.factorNode = parameterValues[ 2 ];

	}

	evaluate( uv, pos, normal, materialIndex ) {

		const factor = Math.min( 1, Math.max( 0, this.factorNode.evaluate( uv, pos ) ) );

		return factor * this.aNode.evaluate( uv, pos, normal, materialIndex ) + ( 1 - factor ) * this.bNode.evaluate( uv, pos, normal, materialIndex );

	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodeMin.js
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



class ReliefNodeMin extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'Min';

		this.aNode = parameterValues[ 0 ];
		this.bNode = parameterValues[ 1 ];

	}

	evaluate( uv, pos, normal, materialIndex ) {

		return Math.min( this.aNode.evaluate( uv, pos, normal, materialIndex ), this.bNode.evaluate( uv, pos, normal, materialIndex ) );

	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodeMax.js
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



class ReliefNodeMax extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'Max';

		this.aNode = parameterValues[ 0 ];
		this.bNode = parameterValues[ 1 ];

	}

	evaluate( uv, pos, normal, materialIndex ) {

		return Math.max( this.aNode.evaluate( uv, pos, normal, materialIndex ), this.bNode.evaluate( uv, pos, normal, materialIndex ) );

	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodeLessThan.js
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



class ReliefNodeLessThan extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'LessThan';

		this.aNode = parameterValues[ 0 ];
		this.bNode = parameterValues[ 1 ];

	}

	evaluate( uv, pos, normal, materialIndex ) {

		return ( this.aNode.evaluate( uv, pos, normal, materialIndex ) < this.bNode.evaluate( uv, pos, normal, materialIndex ) ) ? 1 : 0;

	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodeNotBottom.js
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



class ReliefNodeNotBottom extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'NotBottom';

	}

	evaluate( uv, pos, normal, materialIndex ) {

		return normal.y >= 0 ? 1 : 0;

	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodeQuantize.js
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



class ReliefNodeQuantize extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'Quantize';

		this.aNode = parameterValues[ 1 ];

		this.size = parameterValues[ 2 ];

		this.range = this.ceil - this.floor;

	}

	evaluate( uv, pos, normal, materialIndex ) {

		const value = this.floor + this.range * this.aNode.evaluate( uv, pos, normal, materialIndex );

		const size = this.size.evaluate( uv, pos, normal, materialIndex );

		return value - value % size;

	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodeEvaluate.js
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





class ReliefNodeEvaluate extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'Evaluate';

		this.aNode = parameterValues[ 0 ];
		this.uNode = parameterValues[ 1 ];
		this.vNode = parameterValues[ 2 ];

		this.uv = new three_module/* Vector2 */.FM8();

	}

	evaluate( uv, pos, normal, materialIndex ) {

		this.uv.set(
			this.uNode.evaluate( uv, pos, normal, materialIndex ),
			this.vNode.evaluate( uv, pos, normal, materialIndex )
		);

		return this.aNode.evaluate( this.uv, pos, normal, materialIndex );

	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodeGetU.js
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



class ReliefNodeGetU extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'GetU';

	}

	evaluate( uv, pos, normal, materialIndex ) {

		return uv.x;

	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodeGetV.js
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



class ReliefNodeGetV extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'GetV';

	}

	evaluate( uv, pos, normal, materialIndex ) {

		return uv.y;

	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodeGetX.js
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



class ReliefNodeGetX extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'GetX';

	}

	evaluate( uv, pos, normal, materialIndex ) {

		return pos.x;

	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodeGetY.js
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



class ReliefNodeGetY extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'GetY';

	}

	evaluate( uv, pos, normal, materialIndex ) {

		return pos.y;

	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodeGetZ.js
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



class ReliefNodeGetZ extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'GetZ';

	}

	evaluate( uv, pos, normal, materialIndex ) {

		return pos.z;

	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodeCheckered.js
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



class ReliefNodeCheckered extends ReliefNodeCell {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'Checkered';

		this.checkerFractionU = parameterValues[ 3 ];
		this.checkerFractionV = parameterValues[ 4 ];

	}

	evaluate( uv, pos, normal, materialIndex  ) {

		const checkerFractionU = this.checkerFractionU.evaluate( uv, pos, normal, materialIndex  );
		const checkerFractionV = this.checkerFractionV.evaluate( uv, pos, normal, materialIndex  );

		const sizeU = this.sizeU.evaluate( uv, pos, normal, materialIndex  );
		const sizeV = this.sizeV.evaluate( uv, pos, normal, materialIndex  );

		const raisedU = ReliefNodeCell.coordinateToCell( uv.x, sizeU ) >= checkerFractionU;
		const raisedV = ReliefNodeCell.coordinateToCell( uv.y, sizeV ) >= checkerFractionV;

		return raisedU !== raisedV ? this.ceil : this.floor;

	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodeTiles.js
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



class ReliefNodeTiles extends ReliefNodeCell {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'Tiles';

		this.bevelFraction = parameterValues[ 3 ];

		this.alternatedBricks = parameterValues[ 4 ];

		this.range = this.ceil - this.floor;

	}

	evaluate( uv, pos, normal, materialIndex ) {

		const bevelFraction = this.bevelFraction.evaluate( uv, pos, normal, materialIndex );
		const tileFraction = 1 - bevelFraction;

		const sizeU = this.sizeU.evaluate( uv, pos, normal, materialIndex );
		const sizeV = this.sizeV.evaluate( uv, pos, normal, materialIndex );

		let u = uv.x;

		if ( this.alternatedBricks ) {

			const brickRow = Math.floor( uv.y / sizeV );
			if ( brickRow & 1 ) u -= 0.5 * sizeU;

			u = Math.abs( ReliefNodeCell.coordinateToCell( Math.abs( u ), sizeU ) );

		}
		else u = Math.abs( ReliefNodeCell.coordinateToCell( u, sizeU ) );

		const v = Math.abs( ReliefNodeCell.coordinateToCell( uv.y, sizeV ) );

		const a = sizeU / sizeV;
		if ( u < tileFraction && v < 1 - bevelFraction * a ) return this.ceil;

		const vLine = 1 - a + a * u;

		if ( v < vLine ) {

			return - this.range * ( u - 1 + bevelFraction ) / bevelFraction + this.ceil;

		}
		else {

			return - this.range * ( v - 1 + bevelFraction * a ) / ( bevelFraction * a ) + this.ceil;

		}

	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodeSimplexUV.js
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



class ReliefNodeSimplexUV extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'SimplexUV';

		this.scaleU = parameterValues[ 1 ];
		this.scaleV = parameterValues[ 2 ];
		this.simplex = context.simplex;

		this.range = this.ceil - this.floor;

	}

	evaluate( uv, pos, normal, materialIndex ) {

		const scaleU = this.scaleU.evaluate( uv, pos, normal, materialIndex );
		const scaleV = this.scaleV.evaluate( uv, pos, normal, materialIndex );

		return this.floor + this.range * ( this.simplex.noise( scaleU * uv.x, scaleV * uv.y ) * 0.5 + 0.5 );

	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodePerlinUV.js
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





class ReliefNodePerlinUV extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'PerlinUV';

		this.numIterations = parameterValues[ 1 ];
		this.size = parameterValues[ 2 ];
		this.multSize = parameterValues[ 3 ];
		this.multContribution = parameterValues[ 4 ];

		this.simplex = context.simplex;

		this.range = this.ceil - this.floor;

		this.vec21 = new three_module/* Vector2 */.FM8();

	}

	evaluate( uv, pos, normal, materialIndex ) {

		const size = this.size.evaluate( uv, pos, normal, materialIndex );

		const multSize = this.multSize.evaluate( uv, pos, normal, materialIndex );
		const multContribution = this.multContribution.evaluate( uv, pos, normal, materialIndex );

		let value = 0;
		let maxValue = 0;
		let multContrib = 1;
		const vec21 = this.vec21;
		vec21.set( 0.5, 0.5 ).add( uv ).multiplyScalar( size );
		for ( let i = 0, l = this.numIterations; i < l; i ++ ) {

			vec21.multiplyScalar( multSize );
			multContrib *= multContribution;
			maxValue += multContrib;

			value += multContrib * this.simplex.noise( vec21.x, vec21.y );

		}

		value /= maxValue;

		return this.floor + this.range * ( value * 0.5 + 0.5 );

	}

}



/*
vec2 ruido3d( vec3 pos, int numIterations, float size, float multSize, float multContribution )
{
  // Obtain a vec2 noise (0..1 in the 2 dimensions) based on model position
  float multContrib = 1.0;
  float maxValue = 0.0;
  vec2 noise = vec2( 0.0 );
  for ( int i = 1; i <= numIterations; i++ ) {
    size *= multSize;
    multContrib *= multContribution;
    maxValue += multContrib;
    vec2 n = texture( sampler0, size * pos.xyz ).xy;
    n.x = abs( 2.0 * n.x -1.0 );
    n.y = abs( 2.0 * n.y -1.0 );
    noise += multContrib * ( n );
  }
  noise /= maxValue;
  return noise;
}
*/

;// CONCATENATED MODULE: ./src/nodes/ReliefNodeVoronoiUV.js
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




class ReliefNodeVoronoiUV extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'VoronoiUV';

		this.numPoints = parameterValues[ 1 ];
		this.lineThickness = parameterValues[ 2 ];

		this.prng = context.prng;
		this.range = this.ceil - this.floor;

		this.points = [ ];
		for ( let i = 0; i < this.numPoints; i ++ ) {

			this.points.push( new three_module/* Vector2 */.FM8( this.prng.random(), this.prng.random() ) );

		}

		this.vec21 = new three_module/* Vector2 */.FM8();
		this.vec22 = new three_module/* Vector2 */.FM8();


	}

	evaluate( uv, pos, normal, materialIndex ) {

		const lineThickness = this.lineThickness.evaluate( uv, pos, normal, materialIndex );
		const lineThickness2 = lineThickness * 0.5;

		let minDist1 = + Infinity;
		let minIndex1 = - 1;
		for ( let i = 0; i < this.numPoints; i ++ ) {

			this.vec21.subVectors( uv, this.points[ i ] );
			const dist = this.vec21.length();

			if ( dist < minDist1 ) {

				minDist1 = dist;
				minIndex1 = i;

			}

		}

		this.vec22.subVectors( uv, this.points[ minIndex1 ] ).normalize().multiplyScalar( lineThickness2 ).add( uv );

		let minDist2 = + Infinity;
		let minIndex2 = - 1;
		for ( let i = 0; i < this.numPoints; i ++ ) {

			this.vec21.subVectors( this.vec22, this.points[ i ] );
			const dist = this.vec21.length();

			if ( dist < minDist2 ) {

				minDist2 = dist;
				minIndex2 = i;

			}

		}

		const distToVoronoi = Math.abs( minDist2 - minDist1 );

		const isInLine = ( distToVoronoi < lineThickness2 ) && ( minIndex1 !== minIndex2 );

		//return this.floor + this.range * ( isInLine ? Math.max( 0, distToVoronoi / lineThickness2 ) : 1  );
		return this.floor + this.range * ( isInLine ? 0 : 1  );

	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodeCircles.js
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



class ReliefNodeCircles extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'Circles';

		this.numCircles = parameterValues[ 1 ] * 2;

		this.offsetU = parameterValues[ 2 ];
		this.offsetV = parameterValues[ 3 ];

		this.range = this.ceil - this.floor;

	}

	evaluate( uv, pos, normal, materialIndex ) {

		const u = uv.x + this.offsetU.evaluate( uv, pos, normal, materialIndex );
		const v = uv.y + this.offsetV.evaluate( uv, pos, normal, materialIndex );

		const r = Math.sqrt( u * u + v * v );

		return this.floor + this.range * ( Math.floor( r * this.numCircles ) & 1 ? 1 : 0 );


	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodeSpots.js
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



class ReliefNodeSpots extends ReliefNodeCell {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'Spots';

		this.spotRadius = parameterValues[ 3 ];

		this.range = this.ceil - this.floor;

	}

	evaluate( uv, pos, normal, materialIndex ) {

		const sizeU = this.sizeU.evaluate( uv, pos, normal, materialIndex );
		const sizeV = this.sizeV.evaluate( uv, pos, normal, materialIndex );

		const cellU = ReliefNodeCell.coordinateToCell( uv.x, sizeU );
		const cellV = ReliefNodeCell.coordinateToCell( uv.y, sizeV );

		uv.x -= ( cellU * 0.5 + 0.5 ) * sizeU;
		uv.y -= ( cellV * 0.5 + 0.5 ) * sizeV;

		const radius = this.spotRadius.evaluate( uv, pos, normal, materialIndex );

		const r = Math.sqrt( cellU * cellU + cellV * cellV );

		if ( r > radius ) return this.floor;

		const h = 1 - r / radius;

		return this.floor + this.range * h;

	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodePreset.js
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



class ReliefNodePreset extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'Preset';

		this.preset = parameterValues[ 0 ];

	}

	evaluate( uv, pos, normal, materialIndex ) {

		if ( ! this.preset ) return 0;

		return this.preset.evaluate( uv, pos, normal, materialIndex );

	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodeMaterialSelector.js
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



class ReliefNodeMaterialSelector extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'MaterialSelector';

		this.materials = parameterValues[ 0 ];

	}

	evaluate( uv, pos, normal, materialIndex ) {

		if ( materialIndex >= this.materials.length ) return 0;

		return this.materials[ materialIndex ].evaluate( uv, pos, normal, materialIndex  );

	}

}



;// CONCATENATED MODULE: ./src/nodes/ReliefNodeMultiplex.js
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



class ReliefNodeMultiplex extends ReliefNode {

	constructor( name, parameterSignatures, parameterValues, context ) {

		super( name, parameterSignatures, parameterValues, context );

		this.className = 'Multiplex';

		this.nodes = parameterValues[ 0 ];

		this.indexNode = parameterValues[ 1 ];

	}

	evaluate( uv, pos, normal, materialIndex ) {

		const index = Math.floor( this.indexNode.evaluate( uv, pos, normal, materialIndex ) );

		if ( index < 0 || index >= this.nodes.length ) return 0;

		return this.nodes[ index ].evaluate( uv, pos, normal, materialIndex  );

	}

}



;// CONCATENATED MODULE: ./src/nodes/reliefNodeClasses.js
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



































function getModeParameterSignature() {

	return {
		name: 'Mode',
		type: 'string',
	};

}

function getConstantValueNode( value ) {

	return {
		className: 'Constant',
		parameterValues: [ value ]
	};

}

const reliefNodeClasses = {
	'Constant': {
		classObject: ReliefNodeConstant,
		parameters: [
			{
				name: 'Value',
				type: 'number'
			}
		],
		defaultNodeValue: {
			parameterValues: [
				0
			]
		}
	},
	'ImageUV': {
		classObject: ReliefNodeImageUV,
		parameters: [
			getModeParameterSignature(),
			{
				name: 'Image size U',
				type: 'number'
			},
			{
				name: 'Image size V',
				type: 'number'
			},
			{
				name: 'Offset U',
				type: 'number'
			},
			{
				name: 'Offset V',
				type: 'number'
			},
			{
				name: 'Image',
				type: 'image'
			}
		],
		defaultNodeValue: {
			parameterValues: [
				RELIEF_EMBOSS,
				1,
				1,
				0,
				0,
				"None"
			]
		}
	},
	'ImageTiledUV': {
		classObject: ReliefNodeImageTiledUV,
		parameters: [
			getModeParameterSignature(),
			{
				name: 'Size U',
				type: 'node'
			},
			{
				name: 'Size V',
				type: 'node'
			},
			{
				name: 'Image size U',
				type: 'number'
			},
			{
				name: 'Image size V',
				type: 'number'
			},
			{
				name: 'Offset U',
				type: 'number'
			},
			{
				name: 'Offset V',
				type: 'number'
			},
			{
				name: 'Image',
				type: 'image'
			}
		],
		defaultNodeValue: {
			parameterValues: [
				RELIEF_EMBOSS,
				getConstantValueNode( 0.1 ),
				getConstantValueNode( 0.1 ),
				2,
				2,
				-1,
				-1,
				"None"
			]
		}
	},
	'Add': {
		classObject: ReliefNodeAdd,
		parameters: [
			{
				name: 'A',
				type: 'node'
			},
			{
				name: 'B',
				type: 'node'
			}
		],
		defaultNodeValue: {
			parameterValues: [
				getConstantValueNode( 0 ),
				getConstantValueNode( 0 )
			]
		}
	},
	'Negate': {
		classObject: ReliefNodeNegate,
		parameters: [
			{
				name: 'A',
				type: 'node'
			}
		],
		defaultNodeValue: {
			parameterValues: [
				getConstantValueNode( 0 )
			]
		}
	},
	'Multiply': {
		classObject: ReliefNodeMultiply,
		parameters: [
			{
				name: 'A',
				type: 'node'
			},
			{
				name: 'B',
				type: 'node'
			}
		],
		defaultNodeValue: {
			parameterValues: [
				getConstantValueNode( 1 ),
				getConstantValueNode( 1 )
			]
		}
	},
	'Mix': {
		classObject: ReliefNodeMix,
		parameters: [
			{
				name: 'A',
				type: 'node'
			},
			{
				name: 'B',
				type: 'node'
			},
			{
				name: 'Factor',
				type: 'node',
			}
		],
		defaultNodeValue: {
			parameterValues: [
				getConstantValueNode( 0 ),
				getConstantValueNode( 0 ),
				getConstantValueNode( 0.5 )
			]
		}
	},
	'Min': {
		classObject: ReliefNodeMin,
		parameters: [
			{
				name: 'A',
				type: 'node'
			},
			{
				name: 'B',
				type: 'node'
			}
		],
		defaultNodeValue: {
			parameterValues: [
				getConstantValueNode( 0 ),
				getConstantValueNode( 0 )
			]
		}
	},
	'Max': {
		classObject: ReliefNodeMax,
		parameters: [
			{
				name: 'A',
				type: 'node'
			},
			{
				name: 'B',
				type: 'node'
			}
		],
		defaultNodeValue: {
			parameterValues: [
				getConstantValueNode( 0 ),
				getConstantValueNode( 0 )
			]
		}
	},
	'LessThan': {
		classObject: ReliefNodeLessThan,
		parameters: [
			{
				name: 'A',
				type: 'node'
			},
			{
				name: 'B',
				type: 'node'
			}
		],
		defaultNodeValue: {
			parameterValues: [
				getConstantValueNode( 0 ),
				getConstantValueNode( 0 )
			]
		}
	},
	'NotBottom': {
		classObject: ReliefNodeNotBottom,
		parameters: [ ],
		defaultNodeValue: {
			parameterValues: [ ]
		}
	},
	'Divide': {
		classObject: ReliefNodeDivide,
		parameters: [
			{
				name: 'A',
				type: 'node'
			},
			{
				name: 'B',
				type: 'node'
			}
		],
		defaultNodeValue: {
			parameterValues: [
				getConstantValueNode( 0 ),
				getConstantValueNode( 0 )
			]
		}
	},
	'Power': {
		classObject: ReliefNodePower,
		parameters: [
			{
				name: 'A',
				type: 'node'
			},
			{
				name: 'B',
				type: 'node'
			}
		],
		defaultNodeValue: {
			parameterValues: [
				getConstantValueNode( 0 ),
				getConstantValueNode( 0 )
			]
		}
	},
	'Sin': {
		classObject: ReliefNodeSin,
		parameters: [
			getModeParameterSignature(),
			{
				name: 'A',
				type: 'node'
			}
		],
		defaultNodeValue: {
			parameterValues: [
				RELIEF_EMBOSS,
				getConstantValueNode( 0 )
			]
		}
	},
	'Cos': {
		classObject: ReliefNodeCos,
		parameters: [
			getModeParameterSignature(),
			{
				name: 'A',
				type: 'node'
			}
		],
		defaultNodeValue: {
			parameterValues: [
				RELIEF_EMBOSS,
				getConstantValueNode( 0 )
			]
		}
	},
	'Quantize': {
		classObject: ReliefNodeQuantize,
		parameters: [
			getModeParameterSignature(),
			{
				name: 'A',
				type: 'node'
			},
			{
				name: 'Step size',
				type: 'node'
			}
		],
		defaultNodeValue: {
			parameterValues: [
				RELIEF_EMBOSS,
				getConstantValueNode( 0 ),
				getConstantValueNode( 0.1 )
			]
		}
	},
	'Evaluate': {
		classObject: ReliefNodeEvaluate,
		parameters: [
			{
				name: 'A',
				type: 'node'
			},
			{
				name: 'U',
				type: 'node'
			},
			{
				name: 'V',
				type: 'node'
			},
		],
		defaultNodeValue: {
			parameterValues: [
				getConstantValueNode( 0 ),
				{
					className: 'GetU',
					parameterValues: [ ]
				},
				{
					className: 'GetV',
					parameterValues: [ ]
				}
			]
		}
	},
	'GetU': {
		classObject: ReliefNodeGetU,
		parameters: [
		],
		defaultNodeValue: {
			parameterValues: [ ]
		}
	},
	'GetV': {
		classObject: ReliefNodeGetV,
		parameters: [
		],
		defaultNodeValue: {
			parameterValues: [ ]
		}
	},
	'GetX': {
		classObject: ReliefNodeGetX,
		parameters: [
		],
		defaultNodeValue: {
			parameterValues: [ ]
		}
	},
	'GetY': {
		classObject: ReliefNodeGetY,
		parameters: [
		],
		defaultNodeValue: {
			parameterValues: [ ]
		}
	},
	'GetZ': {
		classObject: ReliefNodeGetZ,
		parameters: [
		],
		defaultNodeValue: {
			parameterValues: [ ]
		}
	},
	'Checkered': {
		classObject: ReliefNodeCheckered,
		parameters: [
			getModeParameterSignature(),
			{
				name: 'Size U',
				type: 'node'
			},
			{
				name: 'Size V',
				type: 'node'
			},
			{
				name: 'Checker fraction U',
				type: 'node'
			},
			{
				name: 'Checker fraction V',
				type: 'node'
			}
		],
		defaultNodeValue: {
			parameterValues: [
				RELIEF_EMBOSS,
				getConstantValueNode( 0.05 ),
				getConstantValueNode( 0.05 ),
				getConstantValueNode( 0 ),
				getConstantValueNode( 0 )
			]
		}
	},
	'Tiles': {
		classObject: ReliefNodeTiles,
		parameters: [
			getModeParameterSignature(),
			{
				name: 'Size U',
				type: 'node'
			},
			{
				name: 'Size V',
				type: 'node'
			},
			{
				name: 'Bevel fraction',
				type: 'node'
			},
			{
				name: 'Alternated bricks',
				type: 'boolean'
			}
		],
		defaultNodeValue: {
			parameterValues: [
				RELIEF_EMBOSS,
				getConstantValueNode( 0.2 ),
				getConstantValueNode( 0.2 ),
				getConstantValueNode( 0.3 ),
				false
			]
		}
	},
	'SimplexUV': {
		classObject: ReliefNodeSimplexUV,
		parameters: [
			getModeParameterSignature(),
			{
				name: 'Scale U',
				type: 'node'
			},
			{
				name: 'Scale V',
				type: 'node'
			}
		],
		defaultNodeValue: {
			parameterValues: [
				RELIEF_EMBOSS,
				getConstantValueNode( 5 ),
				getConstantValueNode( 5 )
			]
		}
	},
	'PerlinUV': {
		classObject: ReliefNodePerlinUV,
		parameters: [
			getModeParameterSignature(),
			{
				name: 'Number of iterations',
				type: 'number'
			},
			{
				name: 'Size',
				type: 'node'
			},
			{
				name: 'Size multiplier',
				type: 'node'
			},
			{
				name: 'Contribution multiplier',
				type: 'node'
			}
		],
		defaultNodeValue: {
			parameterValues: [
				RELIEF,
				10,
				getConstantValueNode( 5 ),
				getConstantValueNode( 1.5 ),
				getConstantValueNode( 0.8 )
			]
		}
	},
	'VoronoiUV': {
		classObject: ReliefNodeVoronoiUV,
		parameters: [
			getModeParameterSignature(),
			{
				name: 'Number of points',
				type: 'number'
			},
			{
				name: 'Line thickness',
				type: 'node'
			}
		],
		defaultNodeValue: {
			parameterValues: [
				RELIEF_EMBOSS,
				50,
				getConstantValueNode( 0.01 )
			]
		}
	},
	'Circles': {
		classObject: ReliefNodeCircles,
		parameters: [
			getModeParameterSignature(),
			{
				name: 'Number of circles',
				type: 'number'
			},
			{
				name: 'Offset U',
				type: 'node'
			},
			{
				name: 'Offset V',
				type: 'node'
			}
		],
		defaultNodeValue: {
			parameterValues: [
				RELIEF_EMBOSS,
				10,
				getConstantValueNode( - 0.5 ),
				getConstantValueNode( - 0.5 )
			]
		}
	},
	'Spots': {
		classObject: ReliefNodeSpots,
		parameters: [
			getModeParameterSignature(),
			{
				name: 'Size U',
				type: 'node'
			},
			{
				name: 'Size V',
				type: 'node'
			},
			{
				name: 'Spot radius',
				type: 'node'
			}
		],
		defaultNodeValue: {
			parameterValues: [
				RELIEF_EMBOSS,
				getConstantValueNode( 0.1 ),
				getConstantValueNode( 0.1 ),
				getConstantValueNode( 0.3 ),
			]
		}
	},
	'Preset': {
		classObject: ReliefNodePreset,
		parameters: [
			{
				name: 'Preset name',
				type: 'preset'
			}
		],
		defaultNodeValue: {
			parameterValues: [
				""
			]
		}
	},
	'MaterialSelector': {
		classObject: ReliefNodeMaterialSelector,
		parameters: [
			{
				name: 'Materials',
				type: 'nodearray'
			}
		],
		defaultNodeValue: {
			parameterValues: [
				[ ]
			]
		}
	},
	'Multiplex': {
		classObject: ReliefNodeMultiplex,
		parameters: [
			{
				name: 'Nodes',
				type: 'nodearray'
			},
			{
				name: 'Index',
				type: 'node'
			}
		],
		defaultNodeValue: {
			parameterValues: [
				[ ],
				getConstantValueNode( 0 )
			]
		}
	}

};

Object.keys( reliefNodeClasses ).forEach( ( className ) => {

	reliefNodeClasses[ className ].className = className;
	reliefNodeClasses[ className ].defaultNodeValue.className = className;

} );



;// CONCATENATED MODULE: ./src/slicing/Slicer.js
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











class Slicer {

	constructor() {

		this.mesh = null;
		this.bvh = null;
		this.settings = null;
		this.raycaster = new three_module/* Raycaster */.iMs( new three_module/* Vector3 */.Pa4(), new three_module/* Vector3 */.Pa4( 0, 0, 1 ) );
		this.reliefPreset = null;
		this.reliefNode = null;

		// Temp variables

		this.voxelPosition = new three_module/* Vector3 */.Pa4();
		this.closestPoint = new three_module/* Vector3 */.Pa4();
		this.closestUVDistance = new three_module/* Vector3 */.Pa4();
		this.closestNormal = new three_module/* Vector3 */.Pa4();
		this.uvCoords = new three_module/* Vector2 */.FM8();
		this.box3 = new three_module/* Box3 */.ZzF();
		this.matrix4Identity = new three_module/* Matrix4 */.yGw().identity();
		this.vec31 = new three_module/* Vector3 */.Pa4();

		this.indices = null;
		this.positions = null;
		this.uvs = null;

		this.vA = new three_module/* Vector3 */.Pa4();
		this.vB = new three_module/* Vector3 */.Pa4();
		this.vC = new three_module/* Vector3 */.Pa4();

		this.uvA = new three_module/* Vector2 */.FM8();
		this.uvB = new three_module/* Vector2 */.FM8();
		this.uvC = new three_module/* Vector2 */.FM8();

		this.groups = null;

		this.insideSolidDirection = new three_module/* Vector3 */.Pa4( 1.23456789, 0.123456789, 0.567891234 ).normalize();

	}

	setupPrint( geometry, images, settings ) {

		this.mesh = new three_module/* Mesh */.Kj0( geometry, new three_module/* MeshPhongMaterial */.xoR( { side: three_module/* DoubleSide */.ehD } ) );

		this.bvh = 	new MeshBVH/* default */.Z( geometry );

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
				reliefNodeClasses.Constant.parameters,
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
		const simplex = new SimplexNoise/* SimplexNoise */.L( cachedPrng );

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

		three_module/* Triangle.getUV */.CJI.getUV(
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

		three_module/* Triangle.getNormal */.CJI.getNormal( this.vA, this.vB, this.vC, targetNormal );

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

		const mergedGeometry = new three_module/* BufferGeometry */.u9r();

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

			const mergedAttribute = BufferGeometryUtils/* BufferGeometryUtils.mergeBufferAttributes */.O.mergeBufferAttributes( attributes[ name ] );

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



;// CONCATENATED MODULE: ./src/utils/GeometrySerializer.js
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




class GeometrySerializer {

	static serialize( bufferGeometry ) {

		// The geometry must have position and uv attributes.
		// Returns JSON object

		const index = bufferGeometry.getIndex();

		return {

			index: index !== null ? index.array : null,

			position: bufferGeometry.getAttribute( 'position' ).array,

			uv: bufferGeometry.getAttribute( 'uv' ).array,

			groups: GeometrySerializer.serializeGroups( bufferGeometry )

		};

	}

	static serializeGroups( bufferGeometry ) {

		const groups = [ ];
		for ( let i = 0, il = bufferGeometry.groups.length; i < il; i ++ ) {

			const g = bufferGeometry.groups[ i ];

			groups.push( {
				start: g.start,
				count: g.count,
				materialIndex: g.materialIndex
			} );

		}

		return groups;

	}

	static deserialize( serializedData ) {

		// Returns BufferGeometry

		const bufferGeometry = new three_module/* BufferGeometry */.u9r();

		if ( serializedData.index !== null ) bufferGeometry.setIndex( serializedData.index );
		bufferGeometry.setAttribute( 'position', new three_module/* BufferAttribute */.TlE( serializedData.position, 3 ) );
		bufferGeometry.setAttribute( 'uv', new three_module/* BufferAttribute */.TlE( serializedData.uv, 2 ) );

		for ( let i = 0, il = serializedData.groups.length; i < il; i ++ ) {

			const g = serializedData.groups[ i ];

			bufferGeometry.addGroup( g.start, g.count, g.materialIndex );

		}

		return bufferGeometry;

	}

}


;// CONCATENATED MODULE: ./src/SlicerWorker.js
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







let myWorkerIndex = null;


const slicer = new Slicer();
let resolutionX = 0;
let resolutionY = 0;
let SlicerWorker_image = null;
let imagePNG = null;

self.onmessage = ( event ) => {

	switch ( event.data.type ) {

		case 'initIndex':
			myWorkerIndex = event.data.workerIndex;
			break;

		case 'initWorker':
			onInitWorkerMessage( event.data );
			break;

		case 'job':

			const parameters = event.data.parameters;

			const result = executeJob( parameters );

			self.postMessage( {
				type: "jobResult",
				workerIndex: myWorkerIndex,
				result: result
			} );

		break;

	}

};

function onInitWorkerMessage( message ) {

	initPrint( message );

}

function executeJob( parameters ) {

	switch ( parameters.jobType ) {

		case 'sliceLayer':
			return sliceLayer( parameters );

	}

	return null;

}

function initPrint( parameters ) {

	const geometry = GeometrySerializer.deserialize( parameters.geometry );

	slicer.setupPrint( geometry, parameters.images, parameters.printSettings );

	resolutionX = parameters.printSettings.resolutionX;
	resolutionY = parameters.printSettings.resolutionY;

	SlicerWorker_image = Slicer.createImage( resolutionX, resolutionY );

	imagePNG = {
		width: resolutionX,
		height: resolutionY,
		data: SlicerWorker_image,
		depth: 8,
		channels: 1
	};

}

function sliceLayer( parameters ) {

	slicer.sliceLayer( parameters.layerIndex, SlicerWorker_image );

	if ( parameters.resultTypePNGContent ) {

		const pngLayerData = (0,lib_esm/* encode */.cv)( imagePNG );

		return {
			layerIndex: parameters.layerIndex,
			numNonZeroPixels: slicer.countPixelsInImage( SlicerWorker_image ),
			pngLayerData: pngLayerData
		};

	}
	else {

		return {
			layerIndex: parameters.layerIndex,
			image: SlicerWorker_image
		};

	}
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// the startup function
/******/ 	__webpack_require__.x = () => {
/******/ 		// Load entry module and return exports
/******/ 		// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, [534], () => (__webpack_require__(729)))
/******/ 		__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 		return __webpack_exports__;
/******/ 	};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks and sibling chunks for the entrypoint
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".main.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/importScripts chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "already loaded"
/******/ 		var installedChunks = {
/******/ 			729: 1
/******/ 		};
/******/ 		
/******/ 		// importScripts chunk loading
/******/ 		var installChunk = (data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			while(chunkIds.length)
/******/ 				installedChunks[chunkIds.pop()] = 1;
/******/ 			parentChunkLoadingFunction(data);
/******/ 		};
/******/ 		__webpack_require__.f.i = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					importScripts(__webpack_require__.p + __webpack_require__.u(chunkId));
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkMinceSlicer"] = self["webpackChunkMinceSlicer"] || [];
/******/ 		var parentChunkLoadingFunction = chunkLoadingGlobal.push.bind(chunkLoadingGlobal);
/******/ 		chunkLoadingGlobal.push = installChunk;
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/startup chunk dependencies */
/******/ 	(() => {
/******/ 		var next = __webpack_require__.x;
/******/ 		__webpack_require__.x = () => {
/******/ 			return __webpack_require__.e(534).then(next);
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUUyQjs7O0FDbEQzQjtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUU4Qzs7QUFFOUMsNEJBQTRCLFVBQVU7O0FBRXRDOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUV5Qjs7O0FDbkR6QjtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUU4Qzs7QUFFOUMsNEJBQTRCLFVBQVU7O0FBRXRDOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUV5Qjs7O0FDakR6QjtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUU2Qzs7QUFFN0MsNEJBQTRCLFVBQVU7O0FBRXRDOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFeUI7OztBQ3JEekI7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFNkM7O0FBRTdDLDRCQUE0QixVQUFVOztBQUV0Qzs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUV5Qjs7O0FDbER6QjtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUU2Qzs7QUFFN0MsNEJBQTRCLFVBQVU7O0FBRXRDOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRXlCOzs7QUNsRHpCO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRTZDOztBQUU3QyxpQ0FBaUMsVUFBVTs7QUFFM0M7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFOEI7OztBQ2xEOUI7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFNkM7O0FBRTdDLGtDQUFrQyxVQUFVOztBQUU1Qzs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFK0I7OztBQy9DL0I7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFNkM7O0FBRTdDLGlDQUFpQyxVQUFVOztBQUUzQzs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFOEI7OztBQ3pEOUI7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFZ0M7O0FBRWE7O0FBRTdDLGlDQUFpQyxVQUFVOztBQUUzQzs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsZ0JBQWdCLDZCQUFPOztBQUV2Qjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFOEI7OztBQzVEOUI7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFNkM7O0FBRTdDLDZCQUE2QixVQUFVOztBQUV2Qzs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFMEI7OztBQy9DMUI7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFNkM7O0FBRTdDLDZCQUE2QixVQUFVOztBQUV2Qzs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFMEI7OztBQy9DMUI7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFNkM7O0FBRTdDLDZCQUE2QixVQUFVOztBQUV2Qzs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFMEI7OztBQy9DMUI7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFNkM7O0FBRTdDLDZCQUE2QixVQUFVOztBQUV2Qzs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7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Q0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBLGVBQWUsYUFBYTtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0EsZUFBZSxhQUFhO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQSxlQUFlLGtCQUFrQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0EsZUFBZSxtQkFBbUI7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQSxlQUFlLGdCQUFnQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0EsZUFBZSxlQUFlO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQSxlQUFlLGFBQWE7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxhQUF1QjtBQUMzQjtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQSxlQUFlLGFBQWE7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QTtXQUNBO1dBQ0E7V0FDQSwrQkFBK0Isd0NBQXdDO1dBQ3ZFO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUJBQWlCLHFCQUFxQjtXQUN0QztXQUNBO1dBQ0Esa0JBQWtCLHFCQUFxQjtXQUN2QztXQUNBO1dBQ0EsS0FBSztXQUNMO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0MzQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEVBQUU7V0FDRjs7Ozs7V0NSQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQ0pBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsR0FBRztXQUNIO1dBQ0E7V0FDQSxDQUFDOzs7OztXQ1BEOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQ2ZBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxhQUFhO1dBQ2I7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOztXQUVBOztXQUVBOzs7OztXQ3BDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7VUVIQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvLi9zcmMvdXRpbHMvUmFuZG9tLmpzIiwid2VicGFjazovL01pbmNlU2xpY2VyLy4vc3JjL25vZGVzL0NvbnN0YW50cy5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9ub2Rlcy9SZWxpZWZOb2RlLmpzIiwid2VicGFjazovL01pbmNlU2xpY2VyLy4vc3JjL25vZGVzL1JlbGllZk5vZGVDb25zdGFudC5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9ub2Rlcy9SZWxpZWZOb2RlSW1hZ2VVVi5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9ub2Rlcy9SZWxpZWZOb2RlQ2VsbC5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9ub2Rlcy9SZWxpZWZOb2RlSW1hZ2VUaWxlZFVWLmpzIiwid2VicGFjazovL01pbmNlU2xpY2VyLy4vc3JjL25vZGVzL1JlbGllZk5vZGVBZGQuanMiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvLi9zcmMvbm9kZXMvUmVsaWVmTm9kZU5lZ2F0ZS5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9ub2Rlcy9SZWxpZWZOb2RlTXVsdGlwbHkuanMiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvLi9zcmMvbm9kZXMvUmVsaWVmTm9kZURpdmlkZS5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9ub2Rlcy9SZWxpZWZOb2RlUG93ZXIuanMiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvLi9zcmMvbm9kZXMvUmVsaWVmTm9kZVNpbi5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9ub2Rlcy9SZWxpZWZOb2RlQ29zLmpzIiwid2VicGFjazovL01pbmNlU2xpY2VyLy4vc3JjL25vZGVzL1JlbGllZk5vZGVNaXguanMiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvLi9zcmMvbm9kZXMvUmVsaWVmTm9kZU1pbi5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9ub2Rlcy9SZWxpZWZOb2RlTWF4LmpzIiwid2VicGFjazovL01pbmNlU2xpY2VyLy4vc3JjL25vZGVzL1JlbGllZk5vZGVMZXNzVGhhbi5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9ub2Rlcy9SZWxpZWZOb2RlTm90Qm90dG9tLmpzIiwid2VicGFjazovL01pbmNlU2xpY2VyLy4vc3JjL25vZGVzL1JlbGllZk5vZGVRdWFudGl6ZS5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9ub2Rlcy9SZWxpZWZOb2RlRXZhbHVhdGUuanMiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvLi9zcmMvbm9kZXMvUmVsaWVmTm9kZUdldFUuanMiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvLi9zcmMvbm9kZXMvUmVsaWVmTm9kZUdldFYuanMiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvLi9zcmMvbm9kZXMvUmVsaWVmTm9kZUdldFguanMiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvLi9zcmMvbm9kZXMvUmVsaWVmTm9kZUdldFkuanMiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvLi9zcmMvbm9kZXMvUmVsaWVmTm9kZUdldFouanMiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvLi9zcmMvbm9kZXMvUmVsaWVmTm9kZUNoZWNrZXJlZC5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9ub2Rlcy9SZWxpZWZOb2RlVGlsZXMuanMiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvLi9zcmMvbm9kZXMvUmVsaWVmTm9kZVNpbXBsZXhVVi5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9ub2Rlcy9SZWxpZWZOb2RlUGVybGluVVYuanMiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvLi9zcmMvbm9kZXMvUmVsaWVmTm9kZVZvcm9ub2lVVi5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9ub2Rlcy9SZWxpZWZOb2RlQ2lyY2xlcy5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9ub2Rlcy9SZWxpZWZOb2RlU3BvdHMuanMiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvLi9zcmMvbm9kZXMvUmVsaWVmTm9kZVByZXNldC5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9ub2Rlcy9SZWxpZWZOb2RlTWF0ZXJpYWxTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9ub2Rlcy9SZWxpZWZOb2RlTXVsdGlwbGV4LmpzIiwid2VicGFjazovL01pbmNlU2xpY2VyLy4vc3JjL25vZGVzL3JlbGllZk5vZGVDbGFzc2VzLmpzIiwid2VicGFjazovL01pbmNlU2xpY2VyLy4vc3JjL3NsaWNpbmcvU2xpY2VyLmpzIiwid2VicGFjazovL01pbmNlU2xpY2VyLy4vc3JjL3V0aWxzL0dlb21ldHJ5U2VyaWFsaXplci5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9TbGljZXJXb3JrZXIuanMiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvd2VicGFjay9ydW50aW1lL2Vuc3VyZSBjaHVuayIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci93ZWJwYWNrL3J1bnRpbWUvZ2V0IGphdmFzY3JpcHQgY2h1bmsgZmlsZW5hbWUiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL01pbmNlU2xpY2VyL3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL01pbmNlU2xpY2VyL3dlYnBhY2svcnVudGltZS9pbXBvcnRTY3JpcHRzIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvd2VicGFjay9ydW50aW1lL3N0YXJ0dXAgY2h1bmsgZGVwZW5kZW5jaWVzIiwid2VicGFjazovL01pbmNlU2xpY2VyL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL01pbmNlU2xpY2VyL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuTWluY2UgU2xpY2VyXG5cbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAyMSBKdWFuIEpvc2UgTHVuYSBFc3Bpbm9zYVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuU09GVFdBUkUuXG5cbiovXG5cbmNsYXNzIFJhbmRvbUdlbmVyYXRvciB7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cblx0fVxuXG5cdHJhbmRvbSgpIHtcblxuXHRcdHJldHVybiBudWxsO1xuXG5cdH1cblxuXHRnZXRTZWVkKCkge1xuXG5cdFx0cmV0dXJuIG51bGw7XG5cblx0fVxuXG5cdHNldFNlZWQoIHNlZWQgKSB7IH1cblxufVxuXG5cbmNsYXNzIE1hdGhSYW5kb21HZW5lcmF0b3Ige1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXG5cdH1cblxuXHRyYW5kb20oKSB7XG5cblx0XHRyZXR1cm4gTWF0aC5yYW5kb20oKTtcblxuXHR9XG5cbn1cblxuY29uc3QgcG5yZ0xpbWl0ID0gMUUrNztcblxuY2xhc3MgUHNldWRvUmFuZG9tR2VuZXJhdG9yIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblxuXHRcdHRoaXMuc3RhdGUxID0gMDtcblx0XHR0aGlzLnN0YXRlMiA9IDA7XG5cblx0XHR0aGlzLm1vZDEgPSA0Mjk0OTY3MDg3O1xuXHRcdHRoaXMubXVsMSA9IDY1NTM5O1xuXHRcdHRoaXMubW9kMiA9IDQyOTQ5NjU4ODc7XG5cdFx0dGhpcy5tdWwyID0gNjU1Mzc7XG5cblx0fVxuXG5cdHJhbmRvbSgpIHtcblxuICAgICAgICBkbyB7XG5cblx0XHRcdHRoaXMuc3RhdGUxID0gKCB0aGlzLnN0YXRlMSAqIHRoaXMubXVsMSApICUgdGhpcy5tb2QxO1xuXHRcdFx0dGhpcy5zdGF0ZTIgPSAoIHRoaXMuc3RhdGUyICogdGhpcy5tdWwyICkgJSB0aGlzLm1vZDI7XG5cbiAgICAgICAgfSB3aGlsZSAoXG5cdFx0XHR0aGlzLnN0YXRlMSA8IHBucmdMaW1pdCAmJlxuXHRcdFx0dGhpcy5zdGF0ZTIgPCBwbnJnTGltaXQgJiZcblx0XHRcdHRoaXMuc3RhdGUxIDwgdGhpcy5tb2QxICUgcG5yZ0xpbWl0ICYmXG5cdFx0XHR0aGlzLnN0YXRlMiA8IHRoaXMubW9kMiAlIHBucmdMaW1pdFxuXHRcdCk7XG5cbiAgICAgICAgcmV0dXJuICggKCB0aGlzLnN0YXRlMSArIHRoaXMuc3RhdGUyICkgJSBwbnJnTGltaXQgICkgLyBwbnJnTGltaXQgO1xuXG5cdH1cblxuXHRnZXRTZWVkKCkge1xuXG5cdFx0cmV0dXJuICggdGhpcy5zdGF0ZTEgJSBwbnJnTGltaXQgICkgLyBwbnJnTGltaXQ7XG5cblx0fVxuXG5cdHNldFNlZWQoIHNlZWQgKSB7XG5cblx0XHR0aGlzLnN0YXRlMSA9IE1hdGguZmxvb3IoIHNlZWQgKiBwbnJnTGltaXQgICkgJSAoIHRoaXMubW9kMSAtIDEgKSArIDE7XG5cdFx0dGhpcy5zdGF0ZTIgPSBNYXRoLmZsb29yKCBzZWVkICogcG5yZ0xpbWl0ICApICUgKCB0aGlzLm1vZDIgLSAxICkgKyAxO1xuXG5cdH1cblxufVxuXG5jbGFzcyBDYWNoZWRSYW5kb21HZW5lcmF0b3Ige1xuXG5cdGNvbnN0cnVjdG9yKCBzaXplLCBnZW5lcmF0b3IsIHNlZWQgKSB7XG5cblx0XHR0aGlzLnNlZWRzID0gWyBdO1xuXHRcdHRoaXMuc2l6ZSA9IHNpemU7XG5cblx0XHRnZW5lcmF0b3Iuc2V0U2VlZCggc2VlZCApO1xuXHRcdGZvciAoIGxldCBpID0gMDsgaSA8IHNpemU7IGkgKysgKSB7XG5cblx0XHRcdHRoaXMuc2VlZHMucHVzaCggZ2VuZXJhdG9yLnJhbmRvbSgpICk7XG5cclx0XHR9XG5cblx0XHR0aGlzLmN1cnJlbnRTZWVkUG9zID0gMDtcblxuXHR9XG5cblx0cmFuZG9tKCkge1xuXG5cdFx0Y29uc3QgdmFsdWUgPSB0aGlzLnNlZWRzWyB0aGlzLmN1cnJlbnRTZWVkUG9zIF07XG5cblx0XHR0aGlzLmN1cnJlbnRTZWVkUG9zID0gKCB0aGlzLmN1cnJlbnRTZWVkUG9zICsgMSApICUgdGhpcy5zaXplO1xuXG5cdFx0cmV0dXJuIHZhbHVlO1xuXG5cdH1cblxuXHRnZXRTZWVkKCkge1xuXG5cdFx0cmV0dXJuIHRoaXMuY3VycmVudFNlZWRQb3MgLyB0aGlzLnNpemU7XG5cblx0fVxuXG5cdHNldFNlZWQoIHNlZWQgKSB7XG5cblx0XHR0aGlzLmN1cnJlbnRTZWVkUG9zID0gTWF0aC5mbG9vciggc2VlZCAqIHRoaXMuc2l6ZSApICUgdGhpcy5zaXplO1xuXG5cdH1cblxufVxuXG5leHBvcnQge1xuXHRSYW5kb21HZW5lcmF0b3IsXG5cdE1hdGhSYW5kb21HZW5lcmF0b3IsXG5cdFBzZXVkb1JhbmRvbUdlbmVyYXRvcixcblx0Q2FjaGVkUmFuZG9tR2VuZXJhdG9yLFxufTtcbiIsIi8qXG5NaW5jZSBTbGljZXJcblxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDIxIEp1YW4gSm9zZSBMdW5hIEVzcGlub3NhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cblxuKi9cblxuZXhwb3J0IGNvbnN0IFJFTElFRiA9ICdSZWxpZWYgKDAuLjEpJztcbmV4cG9ydCBjb25zdCBFTUJPU1MgPSAnRW1ib3NzICgtMS4uMCknO1xuZXhwb3J0IGNvbnN0IFJFTElFRl9FTUJPU1MgPSAnQm90aCAoLTEuLjEpJztcbiIsIi8qXG5NaW5jZSBTbGljZXJcblxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDIxIEp1YW4gSm9zZSBMdW5hIEVzcGlub3NhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cblxuKi9cblxuaW1wb3J0ICogYXMgQ29uc3RhbnRzIGZyb20gJy4vQ29uc3RhbnRzLmpzJztcbmltcG9ydCB7IHJlbGllZk5vZGVDbGFzc2VzIH0gZnJvbSAnLi9yZWxpZWZOb2RlQ2xhc3Nlcy5qcyc7XG5cbmNsYXNzIFJlbGllZk5vZGUge1xuXG5cdGNvbnN0cnVjdG9yKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKSB7XG5cblx0XHR0aGlzLmlzUmVsaWVmTm9kZSA9IHRydWU7XG5cblx0XHR0aGlzLm5hbWUgPSBuYW1lO1xuXHRcdHRoaXMucGFyYW1ldGVyVmFsdWVzID0gcGFyYW1ldGVyVmFsdWVzO1xuXG5cdFx0aWYgKCBwYXJhbWV0ZXJTaWduYXR1cmVzLmxlbmd0aCA+IDAgJiYgcGFyYW1ldGVyU2lnbmF0dXJlc1sgMCBdLm5hbWUgPT09ICdNb2RlJyApIHtcblxuXHRcdFx0dGhpcy5tb2RlID0gcGFyYW1ldGVyVmFsdWVzWyAwIF07XG5cdFx0XHRzd2l0Y2ggKCB0aGlzLm1vZGUgKSB7XG5cblx0XHRcdFx0Y2FzZSBDb25zdGFudHMuUkVMSUVGOlxuXHRcdFx0XHRcdHRoaXMuY2VpbCA9IDE7XG5cdFx0XHRcdFx0dGhpcy5mbG9vciA9IDA7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBDb25zdGFudHMuRU1CT1NTOlxuXHRcdFx0XHRcdHRoaXMuY2VpbCA9IDA7XG5cdFx0XHRcdFx0dGhpcy5mbG9vciA9IC0gMTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIENvbnN0YW50cy5SRUxJRUZfRU1CT1NTOlxuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRoaXMuY2VpbCA9IDE7XG5cdFx0XHRcdFx0dGhpcy5mbG9vciA9IC0gMTtcblx0XHRcdFx0XHRicmVhaztcclx0XHRcdH1cblxuXHRcdH1cblxuXHRcdHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG5cclxuXHR9XG5cblx0ZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApIHtcblxuXHRcdHJldHVybiAwO1xuXG5cdH1cblxuXHRpc1ZhbGlkKCkge1xuXG5cdFx0Ly8gUmV0dXJucyBudWxsIG9uIHN1Y2Nlc3Mgb3IgZXJyb3Igc3RyaW5nXG5cblx0XHRjb25zdCByZWxpZWZOb2RlQ2xhc3MgPSByZWxpZWZOb2RlQ2xhc3Nlc1sgdGhpcy5jbGFzc05hbWUgXTtcblxuXHRcdGlmICggISByZWxpZWZOb2RlQ2xhc3MgKSByZXR1cm4gXCJVbmtub3duIG5vZGUgY2xhc3MgJ1wiICsgdGhpcy5jbGFzc05hbWUgKyBcIicuXCI7XG5cblx0XHRpZiAoIHJlbGllZk5vZGVDbGFzcy5wYXJhbWV0ZXJzLmxlbmd0aCAhPT0gdGhpcy5wYXJhbWV0ZXJWYWx1ZXMubGVuZ3RoICkge1xuXG5cdFx0XHRyZXR1cm4gXCJOb2RlIG9mIGNsYXNzICdcIiArXG5cdFx0XHRcdHRoaXMuY2xhc3NOYW1lICsgXCInIGluaXRlZCB3aXRoIHdyb25nIG51bWJlciBvZiBhcmd1bWVudHMgKGV4cGVjdGVkIFwiICsgcmVsaWVmTm9kZUNsYXNzLnBhcmFtZXRlcnMubGVuZ3RoICtcblx0XHRcdFx0XCIsIGJ1dCBcIiArIHRoaXMucGFyYW1ldGVyVmFsdWVzLmxlbmd0aCArIFwiIHdlcmUgcHJvdmlkZWQpXCI7XG5cblx0XHR9XG5cblx0XHRmb3IgKCBsZXQgaSA9IDAsIGlsID0gcmVsaWVmTm9kZUNsYXNzLnBhcmFtZXRlcnMubGVuZ3RoOyBpIDwgaWw7IGkgKysgKSB7XG5cblx0XHRcdGNvbnN0IGVyciA9IHRoaXMuaXNQYXJhbWV0ZXJWYWxpZCggcmVsaWVmTm9kZUNsYXNzLnBhcmFtZXRlcnNbIGkgXSwgdGhpcy5wYXJhbWV0ZXJWYWx1ZXNbIGkgXSApO1xuXHRcdFx0aWYgKCBlcnIgKSByZXR1cm4gXCIoSW4gbm9kZSBjbGFzcyAnXCIgKyB0aGlzLmNsYXNzTmFtZSArIFwiJywgcGFyYW1ldGVyIFwiICsgaSArIFwiKSAtLT4gXCIgKyBlcnI7XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblxuXHR9XG5cblx0aXNQYXJhbWV0ZXJWYWxpZCggcGFyYW1ldGVyRGVmaW5pdGlvbiwgdmFsdWUgKSB7XG5cblx0XHQvLyBSZXR1cm5zIG51bGwgb24gc3VjY2VzcyBvciBlcnJvciBzdHJpbmdcblxuXHRcdGxldCBlcnIgPSBudWxsO1xuXG5cdFx0c3dpdGNoKCBwYXJhbWV0ZXJEZWZpbml0aW9uLnR5cGUgKSB7XG5cblx0XHRcdGNhc2UgJ2Jvb2xlYW4nOlxuXHRcdFx0XHRyZXR1cm4gKCB0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJyApID8gbnVsbCA6IFwiRXhwZWN0ZWQgYm9vbGVhbiB2YWx1ZSBmb3IgJ1wiICsgcGFyYW1ldGVyRGVmaW5pdGlvbi5uYW1lICsgXCInIHBhcmFtZXRlciwgYnV0ICdcIiArICggdHlwZW9mIHZhbHVlICkgKyBcIicgd2FzIHByb3ZpZGVkLlwiO1xuXG5cdFx0XHRjYXNlICdzdHJpbmcnOlxuXHRcdFx0XHRyZXR1cm4gKCB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICkgPyBudWxsIDogXCJFeHBlY3RlZCBzdHJpbmcgdmFsdWUgZm9yICdcIiArIHBhcmFtZXRlckRlZmluaXRpb24ubmFtZSArIFwiJyBwYXJhbWV0ZXIsIGJ1dCAnXCIgKyAoIHR5cGVvZiB2YWx1ZSApICsgXCInIHdhcyBwcm92aWRlZC5cIjtcblxuXHRcdFx0Y2FzZSAnbnVtYmVyJzpcblx0XHRcdFx0cmV0dXJuICggdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyApID8gbnVsbCA6IFwiRXhwZWN0ZWQgbnVtYmVyIHZhbHVlIGZvciAnXCIgKyBwYXJhbWV0ZXJEZWZpbml0aW9uLm5hbWUgKyBcIicgcGFyYW1ldGVyLCBidXQgJ1wiICsgKCB0eXBlb2YgdmFsdWUgKSArIFwiJyB3YXMgcHJvdmlkZWQuXCI7XG5cblx0XHRcdGNhc2UgJ25vZGUnOlxuXHRcdFx0XHRpZiAoICEgdmFsdWUgfHwgISB2YWx1ZS5pc1JlbGllZk5vZGUgKSByZXR1cm4gXCJFeHBlY3RlZCBub2RlIHZhbHVlLCBidXQgJ1wiICsgKCB0eXBlb2YgdmFsdWUgKSArIFwiJyB3YXMgcHJvdmlkZWQuXCI7XG5cdFx0XHRcdGVyciA9IHZhbHVlLmlzVmFsaWQoKTtcblx0XHRcdFx0aWYgKCBlcnIgKSByZXR1cm4gXCJOb2RlIHBhcmFtZXRlciAnXCIgKyBwYXJhbWV0ZXJEZWZpbml0aW9uLm5hbWUgKyBcIicgaXMgbm90IFZhbGlkOiBcIiArIGVycjtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHRcdGNhc2UgJ25vZGVhcnJheSc6XG5cdFx0XHRcdGlmICggISB2YWx1ZSB8fCAhIEFycmF5LmlzQXJyYXkoIHZhbHVlICkgKSByZXR1cm4gXCJFeHBlY3RlZCBub2RlIGFycmF5IHZhbHVlLCBidXQgJ1wiICsgKCB0eXBlb2YgdmFsdWUgKSArIFwiJyB3YXMgcHJvdmlkZWQuXCI7XG5cdFx0XHRcdGZvciAoIGxldCBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSArKyApIHtcblxuXHRcdFx0XHRcdGVyciA9IHZhbHVlWyBpIF0uaXNWYWxpZCgpO1xuXHRcdFx0XHRcdGlmICggZXJyICkgcmV0dXJuIFwiTm9kZSBwYXJhbWV0ZXIgJ1wiICsgcGFyYW1ldGVyRGVmaW5pdGlvbi5uYW1lICsgXCJbIFwiICsgaSArIFwiIF0nIGlzIG5vdCBWYWxpZDogXCIgKyBlcnI7XG5cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdFx0Y2FzZSAnaW1hZ2UnOlxuXHRcdFx0XHQvL3JldHVybiAoICggdmFsdWUgIT09IG51bGwgKSAmJiAhIHZhbHVlLmlzSW1hZ2UgKSA/IG51bGwgOiBcIkV4cGVjdGVkIGltYWdlIHZhbHVlIGZvciAnXCIgKyBwYXJhbWV0ZXJEZWZpbml0aW9uLm5hbWUgKyBcIicgcGFyYW1ldGVyLCBidXQgJ1wiICsgKCB0eXBlb2YgdmFsdWUgKSArIFwiJyB3YXMgcHJvdmlkZWQuXCI7XG5cdFx0XHRcdHJldHVybiAoIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgKSA/IG51bGwgOiBcIkV4cGVjdGVkIGltYWdlIG5hbWUgc3RyaW5nIHZhbHVlIGZvciAnXCIgKyBwYXJhbWV0ZXJEZWZpbml0aW9uLm5hbWUgKyBcIicgcGFyYW1ldGVyLCBidXQgJ1wiICsgKCB0eXBlb2YgdmFsdWUgKSArIFwiJyB3YXMgcHJvdmlkZWQuXCI7XG5cblx0XHRcdGNhc2UgJ3ByZXNldCc6XG5cdFx0XHRcdGlmICggISB2YWx1ZSB8fCAhIHZhbHVlLmlzUmVsaWVmTm9kZSApIHJldHVybiBcIkV4cGVjdGVkIHByZXNldCBub2RlIHZhbHVlLCBidXQgJ1wiICsgKCB0eXBlb2YgdmFsdWUgKSArIFwiJyB3YXMgcHJvdmlkZWQuXCI7XG5cdFx0XHRcdGVyciA9IHZhbHVlLmlzVmFsaWQoKTtcblx0XHRcdFx0aWYgKCBlcnIgKSByZXR1cm4gXCJQcmVzZXQgbm9kZSBwYXJhbWV0ZXIgJ1wiICsgcGFyYW1ldGVyRGVmaW5pdGlvbi5uYW1lICsgXCInIGlzIG5vdCBWYWxpZDogXCIgKyBlcnI7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdH1cblxuXHR9XG5cblx0c3RhdGljIG1ha2VSZWxpZWZUcmVlRnJvbUpTT04oIGpzb24sIGNvbnRleHQgKSB7XG5cblx0XHRmdW5jdGlvbiBtYWtlTm9kZSgganNvbiApIHtcblxuXHRcdFx0aWYgKCAhIGpzb24gfHwgdHlwZW9mIGpzb24gIT09ICdvYmplY3QnICkgcmV0dXJuIG51bGw7XG5cdFx0XHRjb25zdCByZWxpZWZDbGFzc0RlZmluaXRpb24gPSByZWxpZWZOb2RlQ2xhc3Nlc1sganNvbi5jbGFzc05hbWUgXTtcblx0XHRcdGlmICggdHlwZW9mIHJlbGllZkNsYXNzRGVmaW5pdGlvbiAhPT0gJ29iamVjdCcgKSByZXR1cm4gbnVsbDtcblx0XHRcdGNvbnN0IGNsYXNzT2JqZWN0ID0gcmVsaWVmQ2xhc3NEZWZpbml0aW9uLmNsYXNzT2JqZWN0O1xuXHRcdFx0aWYgKCAhIEFycmF5LmlzQXJyYXkoIGpzb24ucGFyYW1ldGVyVmFsdWVzICkgKSByZXR1cm4gbnVsbDtcblx0XHRcdGNvbnN0IHBhcmFtZXRlclZhbHVlcyA9IFsgXTtcblx0XHRcdGZvciAoIGxldCBpID0gMCwgaWwgPSBqc29uLnBhcmFtZXRlclZhbHVlcy5sZW5ndGg7IGkgPCBpbDsgaSArKyApIHtcblxuXHRcdFx0XHRjb25zdCBwYXJhbWV0ZXJUeXBlID0gcmVsaWVmQ2xhc3NEZWZpbml0aW9uLnBhcmFtZXRlcnNbIGkgXS50eXBlO1xuXG5cdFx0XHRcdGxldCBwYXJhbVZhbHVlSlNPTiA9IGpzb24ucGFyYW1ldGVyVmFsdWVzWyBpIF07XG5cdFx0XHRcdGxldCB2YWx1ZSA9IHBhcmFtVmFsdWVKU09OO1xuXG5cdFx0XHRcdHN3aXRjaCAoIHBhcmFtZXRlclR5cGUgKSB7XG5cblx0XHRcdFx0XHRjYXNlICdub2RlJzpcblx0XHRcdFx0XHRcdGlmICggcGFyYW1WYWx1ZUpTT04gJiYgdHlwZW9mIHBhcmFtVmFsdWVKU09OID09PSAnb2JqZWN0JyAmJiAhIHBhcmFtVmFsdWVKU09OLmlzSW1hZ2UgJiYgISBwYXJhbVZhbHVlSlNPTi5yZWxpZWZOb2RlSlNPTiApIHtcblxuXHRcdFx0XHRcdFx0XHR2YWx1ZSA9IG1ha2VOb2RlKCBwYXJhbVZhbHVlSlNPTiApO1xuXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdGNhc2UgJ25vZGVhcnJheSc6XG5cdFx0XHRcdFx0XHRpZiAoIHBhcmFtVmFsdWVKU09OICYmIEFycmF5LmlzQXJyYXkoIHBhcmFtVmFsdWVKU09OICkgKSB7XG5cblx0XHRcdFx0XHRcdFx0dmFsdWUgPSBbIF07XG5cdFx0XHRcdFx0XHRcdGZvciAoIGxldCBpID0gMDsgaSA8IHBhcmFtVmFsdWVKU09OLmxlbmd0aDsgaSArKyApIHtcblxuXHRcdFx0XHRcdFx0XHRcdHZhbHVlLnB1c2goIG1ha2VOb2RlKCBwYXJhbVZhbHVlSlNPTlsgaSBdICkgKTtcblxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAncHJlc2V0JzpcbmNvbnNvbGUubG9nKCBcImFtZW0gMVwiICk7XG5cdFx0XHRcdFx0XHRpZiAoIHBhcmFtVmFsdWVKU09OICYmIHR5cGVvZiBwYXJhbVZhbHVlSlNPTiA9PT0gJ3N0cmluZycgKSB7XG5jb25zb2xlLmxvZyggXCJhbWVtIDJcIiApO1xuXHRcdFx0XHRcdFx0XHRjb25zdCBwcmVzZXQgPSBjb250ZXh0LnByZXNldHNbIHBhcmFtVmFsdWVKU09OIF07XG5cdFx0XHRcdFx0XHRcdGlmICggcHJlc2V0ICYmIHByZXNldC5yZWxpZWZOb2RlSlNPTiApIHZhbHVlID0gbWFrZU5vZGUoIHByZXNldC5yZWxpZWZOb2RlSlNPTiApO1xuXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cGFyYW1ldGVyVmFsdWVzLnB1c2goIHZhbHVlICk7XG5cclx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgbm9kZSA9IG5ldyBjbGFzc09iamVjdCgganNvbi5uYW1lLCByZWxpZWZDbGFzc0RlZmluaXRpb24ucGFyYW1ldGVycywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICk7XG5cblx0XHRcdHJldHVybiBub2RlO1xuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIG1ha2VOb2RlKCBqc29uICk7XG5cblx0fVxuXG59XG5cbmV4cG9ydCB7IFJlbGllZk5vZGUgfTtcbiIsIi8qXG5NaW5jZSBTbGljZXJcblxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDIxIEp1YW4gSm9zZSBMdW5hIEVzcGlub3NhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cblxuKi9cblxuaW1wb3J0IHsgUmVsaWVmTm9kZSB9IGZyb20gJy4vUmVsaWVmTm9kZS5qcyc7XG5cbmNsYXNzIFJlbGllZk5vZGVDb25zdGFudCBleHRlbmRzIFJlbGllZk5vZGUge1xuXG5cdGNvbnN0cnVjdG9yKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKSB7XG5cblx0XHRzdXBlciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICk7XG5cblx0XHR0aGlzLmNsYXNzTmFtZSA9ICdDb25zdGFudCc7XG5cblx0XHR0aGlzLnRoZUNvbnN0YW50ID0gcGFyYW1ldGVyVmFsdWVzWyAwIF07XG5cblx0fVxuXG5cdGV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKSB7IHJldHVybiB0aGlzLnRoZUNvbnN0YW50OyB9XG5cbn1cblxuZXhwb3J0IHsgUmVsaWVmTm9kZUNvbnN0YW50IH07XG4iLCIvKlxuTWluY2UgU2xpY2VyXG5cbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAyMSBKdWFuIEpvc2UgTHVuYSBFc3Bpbm9zYVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuU09GVFdBUkUuXG5cbiovXG5cbmltcG9ydCB7IFJlbGllZk5vZGUgfSBmcm9tICcuL1JlbGllZk5vZGUuanMnO1xuXG5jbGFzcyBSZWxpZWZOb2RlSW1hZ2VVViBleHRlbmRzIFJlbGllZk5vZGUge1xuXG5cdGNvbnN0cnVjdG9yKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKSB7XG5cblx0XHRzdXBlciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICk7XG5cblx0XHR0aGlzLmNsYXNzTmFtZSA9ICdJbWFnZVVWJztcblxuXHRcdHRoaXMuaW1hZ2VTaXplVSA9IHBhcmFtZXRlclZhbHVlc1sgMSBdO1xuXHRcdHRoaXMuaW1hZ2VTaXplViA9IHBhcmFtZXRlclZhbHVlc1sgMiBdO1xuXG5cdFx0dGhpcy5vZmZzZXRVID0gcGFyYW1ldGVyVmFsdWVzWyAzIF07XG5cdFx0dGhpcy5vZmZzZXRWID0gcGFyYW1ldGVyVmFsdWVzWyA0IF07XG5cblx0XHRjb25zdCBpbWFnZSA9IHRoaXMuY29udGV4dC5pbWFnZXNbIHBhcmFtZXRlclZhbHVlc1sgNSBdIF07XG5cblx0XHR0aGlzLmltYWdlVmFsaWQgPSAoIGltYWdlICE9IG51bGwgKSAmJiBpbWFnZS5pc0ltYWdlICYmICggaW1hZ2UuZGF0YSAhPT0gbnVsbCApO1xuXHRcdHRoaXMuaW1hZ2VEYXRhID0gdGhpcy5pbWFnZVZhbGlkID8gaW1hZ2UuZGF0YSA6IG51bGw7XG5cdFx0dGhpcy53aWR0aCA9IHRoaXMuaW1hZ2VWYWxpZCA/IGltYWdlLndpZHRoIDogbnVsbDtcblx0XHR0aGlzLmhlaWdodCA9IHRoaXMuaW1hZ2VWYWxpZCA/IGltYWdlLmhlaWdodCA6IG51bGw7XG5cblx0XHR0aGlzLnJhbmdlID0gdGhpcy5jZWlsIC0gdGhpcy5mbG9vcjtcblx0XHR0aGlzLmdyYXlTY2FsZUNvbnN0YW50ID0gdGhpcy5yYW5nZSAvIDI1NTtcblxuXHR9XG5cblx0ZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApIHtcblxuXHRcdGlmICggISB0aGlzLmltYWdlVmFsaWQgKSByZXR1cm4gMDtcblxuXHRcdGNvbnN0IHUgPSAoIHV2LnggLSB0aGlzLm9mZnNldFUgKSAvIHRoaXMuaW1hZ2VTaXplVTtcblx0XHRjb25zdCB2ID0gMSAtICggdXYueSAtIHRoaXMub2Zmc2V0ViApIC8gdGhpcy5pbWFnZVNpemVWO1xuXG5cdFx0aWYgKCB1IDwgMCB8fCB1ID4gMSB8fCB2IDwgMCB8fCB2ID4gMSApIHJldHVybiAwO1xuXG5cdFx0Y29uc3QgcCA9IE1hdGguZmxvb3IoIHYgKiB0aGlzLmhlaWdodCApICogdGhpcy53aWR0aCArIE1hdGguZmxvb3IoIHUgKiB0aGlzLndpZHRoICk7XG5cblx0XHRyZXR1cm4gdGhpcy5pbWFnZURhdGFbIHAgXSAqIHRoaXMuZ3JheVNjYWxlQ29uc3RhbnQgKyB0aGlzLmZsb29yO1xuXG5cdH1cblxufVxuXG5leHBvcnQgeyBSZWxpZWZOb2RlSW1hZ2VVViB9O1xuIiwiLypcbk1pbmNlIFNsaWNlclxuXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMjEgSnVhbiBKb3NlIEx1bmEgRXNwaW5vc2FcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuXG4qL1xuXG5pbXBvcnQgeyBSZWxpZWZOb2RlIH0gZnJvbSAnLi9SZWxpZWZOb2RlLmpzJztcblxuY2xhc3MgUmVsaWVmTm9kZUNlbGwgZXh0ZW5kcyBSZWxpZWZOb2RlIHtcblxuXHRjb25zdHJ1Y3RvciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICkge1xuXG5cdFx0c3VwZXIoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApO1xuXG5cdFx0dGhpcy5zaXplVSA9IHBhcmFtZXRlclZhbHVlc1sgMSBdO1xuXHRcdHRoaXMuc2l6ZVYgPSBwYXJhbWV0ZXJWYWx1ZXNbIDIgXTtcblxyXG5cdH1cblxuXHRzdGF0aWMgY29vcmRpbmF0ZVRvQ2VsbCggeCwgc2l6ZSwgbm9ybWFsICkge1xuXG5cdFx0cmV0dXJuICggKCB4ICUgc2l6ZSApIC8gc2l6ZSAtIDAuNSApICogMjtcblxuXHR9XG5cbn1cblxuZXhwb3J0IHsgUmVsaWVmTm9kZUNlbGwgfTtcbiIsIi8qXG5NaW5jZSBTbGljZXJcblxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDIxIEp1YW4gSm9zZSBMdW5hIEVzcGlub3NhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cblxuKi9cblxuaW1wb3J0IHsgUmVsaWVmTm9kZUNlbGwgfSBmcm9tICcuL1JlbGllZk5vZGVDZWxsLmpzJztcblxuY2xhc3MgUmVsaWVmTm9kZUltYWdlVGlsZWRVViBleHRlbmRzIFJlbGllZk5vZGVDZWxsIHtcblxuXHRjb25zdHJ1Y3RvciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICkge1xuXG5cdFx0c3VwZXIoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApO1xuXG5cdFx0dGhpcy5jbGFzc05hbWUgPSAnSW1hZ2VUaWxlZFVWJztcblxuXHRcdHRoaXMuaW1hZ2VTaXplVSA9IHBhcmFtZXRlclZhbHVlc1sgMyBdO1xuXHRcdHRoaXMuaW1hZ2VTaXplViA9IHBhcmFtZXRlclZhbHVlc1sgNCBdO1xuXG5cdFx0dGhpcy5vZmZzZXRVID0gcGFyYW1ldGVyVmFsdWVzWyA1IF07XG5cdFx0dGhpcy5vZmZzZXRWID0gcGFyYW1ldGVyVmFsdWVzWyA2IF07XG5cblx0XHRjb25zdCBpbWFnZSA9IHRoaXMuY29udGV4dC5pbWFnZXNbIHBhcmFtZXRlclZhbHVlc1sgNyBdIF07XG5cblx0XHR0aGlzLmltYWdlVmFsaWQgPSAoIGltYWdlICE9IG51bGwgKSAmJiBpbWFnZS5pc0ltYWdlICYmICggaW1hZ2UuZGF0YSAhPT0gbnVsbCApO1xuXHRcdHRoaXMuaW1hZ2VEYXRhID0gdGhpcy5pbWFnZVZhbGlkID8gaW1hZ2UuZGF0YSA6IG51bGw7XG5cdFx0dGhpcy53aWR0aCA9IHRoaXMuaW1hZ2VWYWxpZCA/IGltYWdlLndpZHRoIDogbnVsbDtcblx0XHR0aGlzLmhlaWdodCA9IHRoaXMuaW1hZ2VWYWxpZCA/IGltYWdlLmhlaWdodCA6IG51bGw7XG5cblx0XHR0aGlzLnJhbmdlID0gdGhpcy5jZWlsIC0gdGhpcy5mbG9vcjtcblx0XHR0aGlzLmdyYXlTY2FsZUNvbnN0YW50ID0gdGhpcy5yYW5nZSAvIDI1NTtcblxuXHR9XG5cblx0ZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApIHtcblxuXHRcdGlmICggISB0aGlzLmltYWdlVmFsaWQgKSByZXR1cm4gMDtcblxuXHRcdGNvbnN0IHNpemVVID0gdGhpcy5zaXplVS5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICk7XG5cdFx0Y29uc3Qgc2l6ZVYgPSB0aGlzLnNpemVWLmV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKTtcblxuXHRcdGNvbnN0IHUgPSAoIFJlbGllZk5vZGVDZWxsLmNvb3JkaW5hdGVUb0NlbGwoIHV2LngsIHNpemVVICkgLSB0aGlzLm9mZnNldFUgKSAvIHRoaXMuaW1hZ2VTaXplVTtcblx0XHRjb25zdCB2ID0gMSAtICggUmVsaWVmTm9kZUNlbGwuY29vcmRpbmF0ZVRvQ2VsbCggdXYueSwgc2l6ZVYgKSAtIHRoaXMub2Zmc2V0ViApIC8gdGhpcy5pbWFnZVNpemVWO1xuXG5cdFx0aWYgKCB1IDwgMCB8fCB1ID4gMSB8fCB2IDwgMCB8fCB2ID4gMSApIHJldHVybiAwO1xuXG5cdFx0Y29uc3QgcCA9IE1hdGguZmxvb3IoIHYgKiB0aGlzLmhlaWdodCApICogdGhpcy53aWR0aCArIE1hdGguZmxvb3IoIHUgKiB0aGlzLndpZHRoICk7XG5cblx0XHRyZXR1cm4gdGhpcy5pbWFnZURhdGFbIHAgXSAqIHRoaXMuZ3JheVNjYWxlQ29uc3RhbnQgKyB0aGlzLmZsb29yO1xuXG5cdH1cblxufVxuXG5leHBvcnQgeyBSZWxpZWZOb2RlSW1hZ2VUaWxlZFVWIH07XG4iLCIvKlxuTWluY2UgU2xpY2VyXG5cbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAyMSBKdWFuIEpvc2UgTHVuYSBFc3Bpbm9zYVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuU09GVFdBUkUuXG5cbiovXG5cbmltcG9ydCB7IFJlbGllZk5vZGUgfSBmcm9tICcuL1JlbGllZk5vZGUuanMnO1xuXG5jbGFzcyBSZWxpZWZOb2RlQWRkIGV4dGVuZHMgUmVsaWVmTm9kZSB7XG5cblx0Y29uc3RydWN0b3IoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApIHtcblxuXHRcdHN1cGVyKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKTtcblxuXHRcdHRoaXMuY2xhc3NOYW1lID0gJ0FkZCc7XG5cblx0XHR0aGlzLmFOb2RlID0gcGFyYW1ldGVyVmFsdWVzWyAwIF07XG5cdFx0dGhpcy5iTm9kZSA9IHBhcmFtZXRlclZhbHVlc1sgMSBdO1xuXG5cdH1cblxuXHRldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICkge1xuXG5cdFx0cmV0dXJuIHRoaXMuYU5vZGUuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCAgKSArIHRoaXMuYk5vZGUuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCAgKTtcblxuXHR9XG5cbn1cblxuZXhwb3J0IHsgUmVsaWVmTm9kZUFkZCB9O1xuIiwiLypcbk1pbmNlIFNsaWNlclxuXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMjEgSnVhbiBKb3NlIEx1bmEgRXNwaW5vc2FcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuXG4qL1xuXG5pbXBvcnQgeyBSZWxpZWZOb2RlICB9IGZyb20gJy4vUmVsaWVmTm9kZS5qcyc7XG5cbmNsYXNzIFJlbGllZk5vZGVOZWdhdGUgZXh0ZW5kcyBSZWxpZWZOb2RlIHtcblxuXHRjb25zdHJ1Y3RvciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICkge1xuXG5cdFx0c3VwZXIoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApO1xuXG5cdFx0dGhpcy5jbGFzc05hbWUgPSAnTmVnYXRlJztcblxuXHRcdHRoaXMuYU5vZGUgPSBwYXJhbWV0ZXJWYWx1ZXNbIDAgXTtcblxuXHR9XG5cblx0ZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApIHtcblxuXHRcdHJldHVybiAtIHRoaXMuYU5vZGUuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApO1xuXG5cdH1cblxufVxuXG5leHBvcnQgeyBSZWxpZWZOb2RlTmVnYXRlIH07XG4iLCIvKlxuTWluY2UgU2xpY2VyXG5cbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAyMSBKdWFuIEpvc2UgTHVuYSBFc3Bpbm9zYVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuU09GVFdBUkUuXG5cbiovXG5cbmltcG9ydCB7IFJlbGllZk5vZGUgfSBmcm9tICcuL1JlbGllZk5vZGUuanMnO1xuXG5jbGFzcyBSZWxpZWZOb2RlTXVsdGlwbHkgZXh0ZW5kcyBSZWxpZWZOb2RlIHtcblxuXHRjb25zdHJ1Y3RvciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICkge1xuXG5cdFx0c3VwZXIoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApO1xuXG5cdFx0dGhpcy5jbGFzc05hbWUgPSAnTXVsdGlwbHknO1xuXG5cdFx0dGhpcy5hTm9kZSA9IHBhcmFtZXRlclZhbHVlc1sgMCBdO1xuXHRcdHRoaXMuYk5vZGUgPSBwYXJhbWV0ZXJWYWx1ZXNbIDEgXTtcblxuXHR9XG5cblx0ZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApIHtcblxuXHRcdHJldHVybiB0aGlzLmFOb2RlLmV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKSAqIHRoaXMuYk5vZGUuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApO1xuXG5cdH1cblxufVxuXG5leHBvcnQgeyBSZWxpZWZOb2RlTXVsdGlwbHkgfTtcbiIsIi8qXG5NaW5jZSBTbGljZXJcblxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDIxIEp1YW4gSm9zZSBMdW5hIEVzcGlub3NhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cblxuKi9cblxuaW1wb3J0IHsgUmVsaWVmTm9kZSB9IGZyb20gJy4vUmVsaWVmTm9kZS5qcyc7XG5cbmNsYXNzIFJlbGllZk5vZGVEaXZpZGUgZXh0ZW5kcyBSZWxpZWZOb2RlIHtcblxuXHRjb25zdHJ1Y3RvciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICkge1xuXG5cdFx0c3VwZXIoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApO1xuXG5cdFx0dGhpcy5jbGFzc05hbWUgPSAnRGl2aWRlJztcblxuXHRcdHRoaXMuYU5vZGUgPSBwYXJhbWV0ZXJWYWx1ZXNbIDAgXTtcblx0XHR0aGlzLmJOb2RlID0gcGFyYW1ldGVyVmFsdWVzWyAxIF07XG5cblx0fVxuXG5cdGV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKSB7XG5cblx0XHRyZXR1cm4gdGhpcy5hTm9kZS5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICkgLyB0aGlzLmJOb2RlLmV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKTtcblxuXHR9XG5cbn1cblxuZXhwb3J0IHsgUmVsaWVmTm9kZURpdmlkZSB9O1xuIiwiLypcbk1pbmNlIFNsaWNlclxuXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMjEgSnVhbiBKb3NlIEx1bmEgRXNwaW5vc2FcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuXG4qL1xuXG5pbXBvcnQgeyBSZWxpZWZOb2RlIH0gZnJvbSAnLi9SZWxpZWZOb2RlLmpzJztcblxuY2xhc3MgUmVsaWVmTm9kZVBvd2VyIGV4dGVuZHMgUmVsaWVmTm9kZSB7XG5cblx0Y29uc3RydWN0b3IoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApIHtcblxuXHRcdHN1cGVyKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKTtcblxuXHRcdHRoaXMuY2xhc3NOYW1lID0gJ1Bvd2VyJztcblxuXHRcdHRoaXMuYU5vZGUgPSBwYXJhbWV0ZXJWYWx1ZXNbIDAgXTtcblx0XHR0aGlzLmJOb2RlID0gcGFyYW1ldGVyVmFsdWVzWyAxIF07XG5cblx0fVxuXG5cdGV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKSB7XG5cblx0XHRyZXR1cm4gTWF0aC5wb3coIHRoaXMuYU5vZGUuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApLCB0aGlzLmJOb2RlLmV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKSApO1xuXG5cdH1cblxufVxuXG5leHBvcnQgeyBSZWxpZWZOb2RlUG93ZXIgfTtcbiIsIi8qXG5NaW5jZSBTbGljZXJcblxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDIxIEp1YW4gSm9zZSBMdW5hIEVzcGlub3NhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cblxuKi9cblxuaW1wb3J0IHsgUmVsaWVmTm9kZSAgfSBmcm9tICcuL1JlbGllZk5vZGUuanMnO1xuXG5jbGFzcyBSZWxpZWZOb2RlU2luIGV4dGVuZHMgUmVsaWVmTm9kZSB7XG5cblx0Y29uc3RydWN0b3IoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApIHtcblxuXHRcdHN1cGVyKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKTtcblxuXHRcdHRoaXMuY2xhc3NOYW1lID0gJ1Npbic7XG5cblx0XHR0aGlzLmFOb2RlID0gcGFyYW1ldGVyVmFsdWVzWyAxIF07XG5cblx0XHR0aGlzLnJhbmdlID0gdGhpcy5jZWlsIC0gdGhpcy5mbG9vcjtcblxuXHR9XG5cblx0ZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApIHtcblxuXHRcdHJldHVybiB0aGlzLmZsb29yICsgdGhpcy5yYW5nZSAqICggMC41ICogTWF0aC5zaW4oIHRoaXMuYU5vZGUuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApICkgKyAwLjUgKTtcblxuXHR9XG5cbn1cblxuZXhwb3J0IHsgUmVsaWVmTm9kZVNpbiB9O1xuIiwiLypcbk1pbmNlIFNsaWNlclxuXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMjEgSnVhbiBKb3NlIEx1bmEgRXNwaW5vc2FcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuXG4qL1xuXG5pbXBvcnQgeyBSZWxpZWZOb2RlICB9IGZyb20gJy4vUmVsaWVmTm9kZS5qcyc7XG5cbmNsYXNzIFJlbGllZk5vZGVDb3MgZXh0ZW5kcyBSZWxpZWZOb2RlIHtcblxuXHRjb25zdHJ1Y3RvciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICkge1xuXG5cdFx0c3VwZXIoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApO1xuXG5cdFx0dGhpcy5jbGFzc05hbWUgPSAnQ29zJztcblxuXHRcdHRoaXMuYU5vZGUgPSBwYXJhbWV0ZXJWYWx1ZXNbIDAgXTtcblxuXHR9XG5cblx0ZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApIHtcblxuXHRcdHJldHVybiB0aGlzLmZsb29yICsgdGhpcy5yYW5nZSAqICggMC41ICogTWF0aC5jb3MoIHRoaXMuYU5vZGUuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApICkgKyAwLjUgKTtcblxuXHR9XG5cbn1cblxuZXhwb3J0IHsgUmVsaWVmTm9kZUNvcyB9O1xuIiwiLypcbk1pbmNlIFNsaWNlclxuXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMjEgSnVhbiBKb3NlIEx1bmEgRXNwaW5vc2FcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuXG4qL1xuXG5pbXBvcnQgeyBSZWxpZWZOb2RlIH0gZnJvbSAnLi9SZWxpZWZOb2RlLmpzJztcblxuY2xhc3MgUmVsaWVmTm9kZU1peCBleHRlbmRzIFJlbGllZk5vZGUge1xuXG5cdGNvbnN0cnVjdG9yKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKSB7XG5cblx0XHRzdXBlciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICk7XG5cblx0XHR0aGlzLmNsYXNzTmFtZSA9ICdNaXgnO1xuXG5cdFx0dGhpcy5hTm9kZSA9IHBhcmFtZXRlclZhbHVlc1sgMCBdO1xuXHRcdHRoaXMuYk5vZGUgPSBwYXJhbWV0ZXJWYWx1ZXNbIDEgXTtcblx0XHR0aGlzLmZhY3Rvck5vZGUgPSBwYXJhbWV0ZXJWYWx1ZXNbIDIgXTtcblxuXHR9XG5cblx0ZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApIHtcblxuXHRcdGNvbnN0IGZhY3RvciA9IE1hdGgubWluKCAxLCBNYXRoLm1heCggMCwgdGhpcy5mYWN0b3JOb2RlLmV2YWx1YXRlKCB1diwgcG9zICkgKSApO1xuXG5cdFx0cmV0dXJuIGZhY3RvciAqIHRoaXMuYU5vZGUuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApICsgKCAxIC0gZmFjdG9yICkgKiB0aGlzLmJOb2RlLmV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKTtcblxuXHR9XG5cbn1cblxuZXhwb3J0IHsgUmVsaWVmTm9kZU1peCB9O1xuIiwiLypcbk1pbmNlIFNsaWNlclxuXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMjEgSnVhbiBKb3NlIEx1bmEgRXNwaW5vc2FcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuXG4qL1xuXG5pbXBvcnQgeyBSZWxpZWZOb2RlIH0gZnJvbSAnLi9SZWxpZWZOb2RlLmpzJztcblxuY2xhc3MgUmVsaWVmTm9kZU1pbiBleHRlbmRzIFJlbGllZk5vZGUge1xuXG5cdGNvbnN0cnVjdG9yKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKSB7XG5cblx0XHRzdXBlciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICk7XG5cblx0XHR0aGlzLmNsYXNzTmFtZSA9ICdNaW4nO1xuXG5cdFx0dGhpcy5hTm9kZSA9IHBhcmFtZXRlclZhbHVlc1sgMCBdO1xuXHRcdHRoaXMuYk5vZGUgPSBwYXJhbWV0ZXJWYWx1ZXNbIDEgXTtcblxuXHR9XG5cblx0ZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApIHtcblxuXHRcdHJldHVybiBNYXRoLm1pbiggdGhpcy5hTm9kZS5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICksIHRoaXMuYk5vZGUuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApICk7XG5cblx0fVxuXG59XG5cbmV4cG9ydCB7IFJlbGllZk5vZGVNaW4gfTtcbiIsIi8qXG5NaW5jZSBTbGljZXJcblxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDIxIEp1YW4gSm9zZSBMdW5hIEVzcGlub3NhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cblxuKi9cblxuaW1wb3J0IHsgUmVsaWVmTm9kZSB9IGZyb20gJy4vUmVsaWVmTm9kZS5qcyc7XG5cbmNsYXNzIFJlbGllZk5vZGVNYXggZXh0ZW5kcyBSZWxpZWZOb2RlIHtcblxuXHRjb25zdHJ1Y3RvciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICkge1xuXG5cdFx0c3VwZXIoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApO1xuXG5cdFx0dGhpcy5jbGFzc05hbWUgPSAnTWF4JztcblxuXHRcdHRoaXMuYU5vZGUgPSBwYXJhbWV0ZXJWYWx1ZXNbIDAgXTtcblx0XHR0aGlzLmJOb2RlID0gcGFyYW1ldGVyVmFsdWVzWyAxIF07XG5cblx0fVxuXG5cdGV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKSB7XG5cblx0XHRyZXR1cm4gTWF0aC5tYXgoIHRoaXMuYU5vZGUuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApLCB0aGlzLmJOb2RlLmV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKSApO1xuXG5cdH1cblxufVxuXG5leHBvcnQgeyBSZWxpZWZOb2RlTWF4IH07XG4iLCIvKlxuTWluY2UgU2xpY2VyXG5cbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAyMSBKdWFuIEpvc2UgTHVuYSBFc3Bpbm9zYVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuU09GVFdBUkUuXG5cbiovXG5cbmltcG9ydCB7IFJlbGllZk5vZGUgfSBmcm9tICcuL1JlbGllZk5vZGUuanMnO1xuXG5jbGFzcyBSZWxpZWZOb2RlTGVzc1RoYW4gZXh0ZW5kcyBSZWxpZWZOb2RlIHtcblxuXHRjb25zdHJ1Y3RvciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICkge1xuXG5cdFx0c3VwZXIoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApO1xuXG5cdFx0dGhpcy5jbGFzc05hbWUgPSAnTGVzc1RoYW4nO1xuXG5cdFx0dGhpcy5hTm9kZSA9IHBhcmFtZXRlclZhbHVlc1sgMCBdO1xuXHRcdHRoaXMuYk5vZGUgPSBwYXJhbWV0ZXJWYWx1ZXNbIDEgXTtcblxuXHR9XG5cblx0ZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApIHtcblxuXHRcdHJldHVybiAoIHRoaXMuYU5vZGUuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApIDwgdGhpcy5iTm9kZS5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICkgKSA/IDEgOiAwO1xuXG5cdH1cblxufVxuXG5leHBvcnQgeyBSZWxpZWZOb2RlTGVzc1RoYW4gfTtcbiIsIi8qXG5NaW5jZSBTbGljZXJcblxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDIxIEp1YW4gSm9zZSBMdW5hIEVzcGlub3NhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cblxuKi9cblxuaW1wb3J0IHsgUmVsaWVmTm9kZSB9IGZyb20gJy4vUmVsaWVmTm9kZS5qcyc7XG5cbmNsYXNzIFJlbGllZk5vZGVOb3RCb3R0b20gZXh0ZW5kcyBSZWxpZWZOb2RlIHtcblxuXHRjb25zdHJ1Y3RvciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICkge1xuXG5cdFx0c3VwZXIoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApO1xuXG5cdFx0dGhpcy5jbGFzc05hbWUgPSAnTm90Qm90dG9tJztcblxuXHR9XG5cblx0ZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApIHtcblxuXHRcdHJldHVybiBub3JtYWwueSA+PSAwID8gMSA6IDA7XG5cblx0fVxuXG59XG5cbmV4cG9ydCB7IFJlbGllZk5vZGVOb3RCb3R0b20gfTtcbiIsIi8qXG5NaW5jZSBTbGljZXJcblxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDIxIEp1YW4gSm9zZSBMdW5hIEVzcGlub3NhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cblxuKi9cblxuaW1wb3J0IHsgUmVsaWVmTm9kZSB9IGZyb20gJy4vUmVsaWVmTm9kZS5qcyc7XG5cbmNsYXNzIFJlbGllZk5vZGVRdWFudGl6ZSBleHRlbmRzIFJlbGllZk5vZGUge1xuXG5cdGNvbnN0cnVjdG9yKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKSB7XG5cblx0XHRzdXBlciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICk7XG5cblx0XHR0aGlzLmNsYXNzTmFtZSA9ICdRdWFudGl6ZSc7XG5cblx0XHR0aGlzLmFOb2RlID0gcGFyYW1ldGVyVmFsdWVzWyAxIF07XG5cblx0XHR0aGlzLnNpemUgPSBwYXJhbWV0ZXJWYWx1ZXNbIDIgXTtcblxuXHRcdHRoaXMucmFuZ2UgPSB0aGlzLmNlaWwgLSB0aGlzLmZsb29yO1xuXG5cdH1cblxuXHRldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICkge1xuXG5cdFx0Y29uc3QgdmFsdWUgPSB0aGlzLmZsb29yICsgdGhpcy5yYW5nZSAqIHRoaXMuYU5vZGUuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApO1xuXG5cdFx0Y29uc3Qgc2l6ZSA9IHRoaXMuc2l6ZS5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICk7XG5cblx0XHRyZXR1cm4gdmFsdWUgLSB2YWx1ZSAlIHNpemU7XG5cblx0fVxuXG59XG5cbmV4cG9ydCB7IFJlbGllZk5vZGVRdWFudGl6ZSB9O1xuIiwiLypcbk1pbmNlIFNsaWNlclxuXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMjEgSnVhbiBKb3NlIEx1bmEgRXNwaW5vc2FcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuXG4qL1xuXG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSAndGhyZWUnO1xuXG5pbXBvcnQgeyBSZWxpZWZOb2RlIH0gZnJvbSAnLi9SZWxpZWZOb2RlLmpzJztcblxuY2xhc3MgUmVsaWVmTm9kZUV2YWx1YXRlIGV4dGVuZHMgUmVsaWVmTm9kZSB7XG5cblx0Y29uc3RydWN0b3IoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApIHtcblxuXHRcdHN1cGVyKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKTtcblxuXHRcdHRoaXMuY2xhc3NOYW1lID0gJ0V2YWx1YXRlJztcblxuXHRcdHRoaXMuYU5vZGUgPSBwYXJhbWV0ZXJWYWx1ZXNbIDAgXTtcblx0XHR0aGlzLnVOb2RlID0gcGFyYW1ldGVyVmFsdWVzWyAxIF07XG5cdFx0dGhpcy52Tm9kZSA9IHBhcmFtZXRlclZhbHVlc1sgMiBdO1xuXG5cdFx0dGhpcy51diA9IG5ldyBWZWN0b3IyKCk7XG5cblx0fVxuXG5cdGV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKSB7XG5cblx0XHR0aGlzLnV2LnNldChcblx0XHRcdHRoaXMudU5vZGUuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApLFxuXHRcdFx0dGhpcy52Tm9kZS5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4IClcblx0XHQpO1xuXG5cdFx0cmV0dXJuIHRoaXMuYU5vZGUuZXZhbHVhdGUoIHRoaXMudXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICk7XG5cblx0fVxuXG59XG5cbmV4cG9ydCB7IFJlbGllZk5vZGVFdmFsdWF0ZSB9O1xuIiwiLypcbk1pbmNlIFNsaWNlclxuXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMjEgSnVhbiBKb3NlIEx1bmEgRXNwaW5vc2FcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuXG4qL1xuXG5pbXBvcnQgeyBSZWxpZWZOb2RlIH0gZnJvbSAnLi9SZWxpZWZOb2RlLmpzJztcblxuY2xhc3MgUmVsaWVmTm9kZUdldFUgZXh0ZW5kcyBSZWxpZWZOb2RlIHtcblxuXHRjb25zdHJ1Y3RvciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICkge1xuXG5cdFx0c3VwZXIoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApO1xuXG5cdFx0dGhpcy5jbGFzc05hbWUgPSAnR2V0VSc7XG5cblx0fVxuXG5cdGV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKSB7XG5cblx0XHRyZXR1cm4gdXYueDtcblxuXHR9XG5cbn1cblxuZXhwb3J0IHsgUmVsaWVmTm9kZUdldFUgfTtcbiIsIi8qXG5NaW5jZSBTbGljZXJcblxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDIxIEp1YW4gSm9zZSBMdW5hIEVzcGlub3NhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cblxuKi9cblxuaW1wb3J0IHsgUmVsaWVmTm9kZSB9IGZyb20gJy4vUmVsaWVmTm9kZS5qcyc7XG5cbmNsYXNzIFJlbGllZk5vZGVHZXRWIGV4dGVuZHMgUmVsaWVmTm9kZSB7XG5cblx0Y29uc3RydWN0b3IoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApIHtcblxuXHRcdHN1cGVyKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKTtcblxuXHRcdHRoaXMuY2xhc3NOYW1lID0gJ0dldFYnO1xuXG5cdH1cblxuXHRldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICkge1xuXG5cdFx0cmV0dXJuIHV2Lnk7XG5cblx0fVxuXG59XG5cbmV4cG9ydCB7IFJlbGllZk5vZGVHZXRWIH07XG4iLCIvKlxuTWluY2UgU2xpY2VyXG5cbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAyMSBKdWFuIEpvc2UgTHVuYSBFc3Bpbm9zYVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuU09GVFdBUkUuXG5cbiovXG5cbmltcG9ydCB7IFJlbGllZk5vZGUgfSBmcm9tICcuL1JlbGllZk5vZGUuanMnO1xuXG5jbGFzcyBSZWxpZWZOb2RlR2V0WCBleHRlbmRzIFJlbGllZk5vZGUge1xuXG5cdGNvbnN0cnVjdG9yKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKSB7XG5cblx0XHRzdXBlciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICk7XG5cblx0XHR0aGlzLmNsYXNzTmFtZSA9ICdHZXRYJztcblxuXHR9XG5cblx0ZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApIHtcblxuXHRcdHJldHVybiBwb3MueDtcblxuXHR9XG5cbn1cblxuZXhwb3J0IHsgUmVsaWVmTm9kZUdldFggfTtcbiIsIi8qXG5NaW5jZSBTbGljZXJcblxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDIxIEp1YW4gSm9zZSBMdW5hIEVzcGlub3NhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cblxuKi9cblxuaW1wb3J0IHsgUmVsaWVmTm9kZSB9IGZyb20gJy4vUmVsaWVmTm9kZS5qcyc7XG5cbmNsYXNzIFJlbGllZk5vZGVHZXRZIGV4dGVuZHMgUmVsaWVmTm9kZSB7XG5cblx0Y29uc3RydWN0b3IoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApIHtcblxuXHRcdHN1cGVyKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKTtcblxuXHRcdHRoaXMuY2xhc3NOYW1lID0gJ0dldFknO1xuXG5cdH1cblxuXHRldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICkge1xuXG5cdFx0cmV0dXJuIHBvcy55O1xuXG5cdH1cblxufVxuXG5leHBvcnQgeyBSZWxpZWZOb2RlR2V0WSB9O1xuIiwiLypcbk1pbmNlIFNsaWNlclxuXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMjEgSnVhbiBKb3NlIEx1bmEgRXNwaW5vc2FcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuXG4qL1xuXG5pbXBvcnQgeyBSZWxpZWZOb2RlIH0gZnJvbSAnLi9SZWxpZWZOb2RlLmpzJztcblxuY2xhc3MgUmVsaWVmTm9kZUdldFogZXh0ZW5kcyBSZWxpZWZOb2RlIHtcblxuXHRjb25zdHJ1Y3RvciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICkge1xuXG5cdFx0c3VwZXIoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApO1xuXG5cdFx0dGhpcy5jbGFzc05hbWUgPSAnR2V0Wic7XG5cblx0fVxuXG5cdGV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKSB7XG5cblx0XHRyZXR1cm4gcG9zLno7XG5cblx0fVxuXG59XG5cbmV4cG9ydCB7IFJlbGllZk5vZGVHZXRaIH07XG4iLCIvKlxuTWluY2UgU2xpY2VyXG5cbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAyMSBKdWFuIEpvc2UgTHVuYSBFc3Bpbm9zYVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuU09GVFdBUkUuXG5cbiovXG5cbmltcG9ydCB7IFJlbGllZk5vZGVDZWxsIH0gZnJvbSAnLi9SZWxpZWZOb2RlQ2VsbC5qcyc7XG5cbmNsYXNzIFJlbGllZk5vZGVDaGVja2VyZWQgZXh0ZW5kcyBSZWxpZWZOb2RlQ2VsbCB7XG5cblx0Y29uc3RydWN0b3IoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApIHtcblxuXHRcdHN1cGVyKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKTtcblxuXHRcdHRoaXMuY2xhc3NOYW1lID0gJ0NoZWNrZXJlZCc7XG5cblx0XHR0aGlzLmNoZWNrZXJGcmFjdGlvblUgPSBwYXJhbWV0ZXJWYWx1ZXNbIDMgXTtcblx0XHR0aGlzLmNoZWNrZXJGcmFjdGlvblYgPSBwYXJhbWV0ZXJWYWx1ZXNbIDQgXTtcblxuXHR9XG5cblx0ZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCAgKSB7XG5cblx0XHRjb25zdCBjaGVja2VyRnJhY3Rpb25VID0gdGhpcy5jaGVja2VyRnJhY3Rpb25VLmV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggICk7XG5cdFx0Y29uc3QgY2hlY2tlckZyYWN0aW9uViA9IHRoaXMuY2hlY2tlckZyYWN0aW9uVi5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICApO1xuXG5cdFx0Y29uc3Qgc2l6ZVUgPSB0aGlzLnNpemVVLmV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggICk7XG5cdFx0Y29uc3Qgc2l6ZVYgPSB0aGlzLnNpemVWLmV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggICk7XG5cblx0XHRjb25zdCByYWlzZWRVID0gUmVsaWVmTm9kZUNlbGwuY29vcmRpbmF0ZVRvQ2VsbCggdXYueCwgc2l6ZVUgKSA+PSBjaGVja2VyRnJhY3Rpb25VO1xuXHRcdGNvbnN0IHJhaXNlZFYgPSBSZWxpZWZOb2RlQ2VsbC5jb29yZGluYXRlVG9DZWxsKCB1di55LCBzaXplViApID49IGNoZWNrZXJGcmFjdGlvblY7XG5cblx0XHRyZXR1cm4gcmFpc2VkVSAhPT0gcmFpc2VkViA/IHRoaXMuY2VpbCA6IHRoaXMuZmxvb3I7XG5cblx0fVxuXG59XG5cbmV4cG9ydCB7IFJlbGllZk5vZGVDaGVja2VyZWQgfTtcbiIsIi8qXG5NaW5jZSBTbGljZXJcblxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDIxIEp1YW4gSm9zZSBMdW5hIEVzcGlub3NhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cblxuKi9cblxuaW1wb3J0IHsgUmVsaWVmTm9kZUNlbGwgfSBmcm9tICcuL1JlbGllZk5vZGVDZWxsLmpzJztcblxuY2xhc3MgUmVsaWVmTm9kZVRpbGVzIGV4dGVuZHMgUmVsaWVmTm9kZUNlbGwge1xuXG5cdGNvbnN0cnVjdG9yKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKSB7XG5cblx0XHRzdXBlciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICk7XG5cblx0XHR0aGlzLmNsYXNzTmFtZSA9ICdUaWxlcyc7XG5cblx0XHR0aGlzLmJldmVsRnJhY3Rpb24gPSBwYXJhbWV0ZXJWYWx1ZXNbIDMgXTtcblxuXHRcdHRoaXMuYWx0ZXJuYXRlZEJyaWNrcyA9IHBhcmFtZXRlclZhbHVlc1sgNCBdO1xuXG5cdFx0dGhpcy5yYW5nZSA9IHRoaXMuY2VpbCAtIHRoaXMuZmxvb3I7XG5cclxuXHR9XG5cblx0ZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApIHtcblxuXHRcdGNvbnN0IGJldmVsRnJhY3Rpb24gPSB0aGlzLmJldmVsRnJhY3Rpb24uZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApO1xuXHRcdGNvbnN0IHRpbGVGcmFjdGlvbiA9IDEgLSBiZXZlbEZyYWN0aW9uO1xuXG5cdFx0Y29uc3Qgc2l6ZVUgPSB0aGlzLnNpemVVLmV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKTtcblx0XHRjb25zdCBzaXplViA9IHRoaXMuc2l6ZVYuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApO1xuXG5cdFx0bGV0IHUgPSB1di54O1xuXG5cdFx0aWYgKCB0aGlzLmFsdGVybmF0ZWRCcmlja3MgKSB7XG5cblx0XHRcdGNvbnN0IGJyaWNrUm93ID0gTWF0aC5mbG9vciggdXYueSAvIHNpemVWICk7XG5cdFx0XHRpZiAoIGJyaWNrUm93ICYgMSApIHUgLT0gMC41ICogc2l6ZVU7XG5cblx0XHRcdHUgPSBNYXRoLmFicyggUmVsaWVmTm9kZUNlbGwuY29vcmRpbmF0ZVRvQ2VsbCggTWF0aC5hYnMoIHUgKSwgc2l6ZVUgKSApO1xuXG5cdFx0fVxuXHRcdGVsc2UgdSA9IE1hdGguYWJzKCBSZWxpZWZOb2RlQ2VsbC5jb29yZGluYXRlVG9DZWxsKCB1LCBzaXplVSApICk7XG5cblx0XHRjb25zdCB2ID0gTWF0aC5hYnMoIFJlbGllZk5vZGVDZWxsLmNvb3JkaW5hdGVUb0NlbGwoIHV2LnksIHNpemVWICkgKTtcblxuXHRcdGNvbnN0IGEgPSBzaXplVSAvIHNpemVWO1xuXHRcdGlmICggdSA8IHRpbGVGcmFjdGlvbiAmJiB2IDwgMSAtIGJldmVsRnJhY3Rpb24gKiBhICkgcmV0dXJuIHRoaXMuY2VpbDtcblxuXHRcdGNvbnN0IHZMaW5lID0gMSAtIGEgKyBhICogdTtcblxuXHRcdGlmICggdiA8IHZMaW5lICkge1xuXG5cdFx0XHRyZXR1cm4gLSB0aGlzLnJhbmdlICogKCB1IC0gMSArIGJldmVsRnJhY3Rpb24gKSAvIGJldmVsRnJhY3Rpb24gKyB0aGlzLmNlaWw7XG5cblx0XHR9XG5cdFx0ZWxzZSB7XG5cblx0XHRcdHJldHVybiAtIHRoaXMucmFuZ2UgKiAoIHYgLSAxICsgYmV2ZWxGcmFjdGlvbiAqIGEgKSAvICggYmV2ZWxGcmFjdGlvbiAqIGEgKSArIHRoaXMuY2VpbDtcblxuXHRcdH1cblxuXHR9XG5cbn1cblxuZXhwb3J0IHsgUmVsaWVmTm9kZVRpbGVzIH07XG4iLCIvKlxuTWluY2UgU2xpY2VyXG5cbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAyMSBKdWFuIEpvc2UgTHVuYSBFc3Bpbm9zYVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuU09GVFdBUkUuXG5cbiovXG5cbmltcG9ydCB7IFJlbGllZk5vZGUgfSBmcm9tICcuL1JlbGllZk5vZGUuanMnO1xuXG5jbGFzcyBSZWxpZWZOb2RlU2ltcGxleFVWIGV4dGVuZHMgUmVsaWVmTm9kZSB7XG5cblx0Y29uc3RydWN0b3IoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApIHtcblxuXHRcdHN1cGVyKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKTtcblxuXHRcdHRoaXMuY2xhc3NOYW1lID0gJ1NpbXBsZXhVVic7XG5cblx0XHR0aGlzLnNjYWxlVSA9IHBhcmFtZXRlclZhbHVlc1sgMSBdO1xuXHRcdHRoaXMuc2NhbGVWID0gcGFyYW1ldGVyVmFsdWVzWyAyIF07XG5cdFx0dGhpcy5zaW1wbGV4ID0gY29udGV4dC5zaW1wbGV4O1xuXG5cdFx0dGhpcy5yYW5nZSA9IHRoaXMuY2VpbCAtIHRoaXMuZmxvb3I7XG5cblx0fVxuXG5cdGV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKSB7XG5cblx0XHRjb25zdCBzY2FsZVUgPSB0aGlzLnNjYWxlVS5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICk7XG5cdFx0Y29uc3Qgc2NhbGVWID0gdGhpcy5zY2FsZVYuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApO1xuXG5cdFx0cmV0dXJuIHRoaXMuZmxvb3IgKyB0aGlzLnJhbmdlICogKCB0aGlzLnNpbXBsZXgubm9pc2UoIHNjYWxlVSAqIHV2LngsIHNjYWxlViAqIHV2LnkgKSAqIDAuNSArIDAuNSApO1xuXG5cdH1cblxufVxuXG5leHBvcnQgeyBSZWxpZWZOb2RlU2ltcGxleFVWIH07XG4iLCIvKlxuTWluY2UgU2xpY2VyXG5cbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAyMSBKdWFuIEpvc2UgTHVuYSBFc3Bpbm9zYVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuU09GVFdBUkUuXG5cbiovXG5cbmltcG9ydCB7IFZlY3RvcjIgfSBmcm9tICd0aHJlZSc7XG5cbmltcG9ydCB7IFJlbGllZk5vZGUgfSBmcm9tICcuL1JlbGllZk5vZGUuanMnO1xuXG5jbGFzcyBSZWxpZWZOb2RlUGVybGluVVYgZXh0ZW5kcyBSZWxpZWZOb2RlIHtcblxuXHRjb25zdHJ1Y3RvciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICkge1xuXG5cdFx0c3VwZXIoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApO1xuXG5cdFx0dGhpcy5jbGFzc05hbWUgPSAnUGVybGluVVYnO1xuXG5cdFx0dGhpcy5udW1JdGVyYXRpb25zID0gcGFyYW1ldGVyVmFsdWVzWyAxIF07XG5cdFx0dGhpcy5zaXplID0gcGFyYW1ldGVyVmFsdWVzWyAyIF07XG5cdFx0dGhpcy5tdWx0U2l6ZSA9IHBhcmFtZXRlclZhbHVlc1sgMyBdO1xuXHRcdHRoaXMubXVsdENvbnRyaWJ1dGlvbiA9IHBhcmFtZXRlclZhbHVlc1sgNCBdO1xuXG5cdFx0dGhpcy5zaW1wbGV4ID0gY29udGV4dC5zaW1wbGV4O1xuXG5cdFx0dGhpcy5yYW5nZSA9IHRoaXMuY2VpbCAtIHRoaXMuZmxvb3I7XG5cblx0XHR0aGlzLnZlYzIxID0gbmV3IFZlY3RvcjIoKTtcblxuXHR9XG5cblx0ZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApIHtcblxuXHRcdGNvbnN0IHNpemUgPSB0aGlzLnNpemUuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApO1xuXG5cdFx0Y29uc3QgbXVsdFNpemUgPSB0aGlzLm11bHRTaXplLmV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKTtcblx0XHRjb25zdCBtdWx0Q29udHJpYnV0aW9uID0gdGhpcy5tdWx0Q29udHJpYnV0aW9uLmV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKTtcblxuXHRcdGxldCB2YWx1ZSA9IDA7XG5cdFx0bGV0IG1heFZhbHVlID0gMDtcblx0XHRsZXQgbXVsdENvbnRyaWIgPSAxO1xuXHRcdGNvbnN0IHZlYzIxID0gdGhpcy52ZWMyMTtcblx0XHR2ZWMyMS5zZXQoIDAuNSwgMC41ICkuYWRkKCB1diApLm11bHRpcGx5U2NhbGFyKCBzaXplICk7XG5cdFx0Zm9yICggbGV0IGkgPSAwLCBsID0gdGhpcy5udW1JdGVyYXRpb25zOyBpIDwgbDsgaSArKyApIHtcblxuXHRcdFx0dmVjMjEubXVsdGlwbHlTY2FsYXIoIG11bHRTaXplICk7XG5cdFx0XHRtdWx0Q29udHJpYiAqPSBtdWx0Q29udHJpYnV0aW9uO1xuXHRcdFx0bWF4VmFsdWUgKz0gbXVsdENvbnRyaWI7XG5cblx0XHRcdHZhbHVlICs9IG11bHRDb250cmliICogdGhpcy5zaW1wbGV4Lm5vaXNlKCB2ZWMyMS54LCB2ZWMyMS55ICk7XG5cblx0XHR9XG5cblx0XHR2YWx1ZSAvPSBtYXhWYWx1ZTtcblxuXHRcdHJldHVybiB0aGlzLmZsb29yICsgdGhpcy5yYW5nZSAqICggdmFsdWUgKiAwLjUgKyAwLjUgKTtcblxuXHR9XG5cbn1cblxuZXhwb3J0IHsgUmVsaWVmTm9kZVBlcmxpblVWIH07XG5cbi8qXG52ZWMyIHJ1aWRvM2QoIHZlYzMgcG9zLCBpbnQgbnVtSXRlcmF0aW9ucywgZmxvYXQgc2l6ZSwgZmxvYXQgbXVsdFNpemUsIGZsb2F0IG11bHRDb250cmlidXRpb24gKVxue1xuICAvLyBPYnRhaW4gYSB2ZWMyIG5vaXNlICgwLi4xIGluIHRoZSAyIGRpbWVuc2lvbnMpIGJhc2VkIG9uIG1vZGVsIHBvc2l0aW9uXG4gIGZsb2F0IG11bHRDb250cmliID0gMS4wO1xuICBmbG9hdCBtYXhWYWx1ZSA9IDAuMDtcbiAgdmVjMiBub2lzZSA9IHZlYzIoIDAuMCApO1xuICBmb3IgKCBpbnQgaSA9IDE7IGkgPD0gbnVtSXRlcmF0aW9uczsgaSsrICkge1xuICAgIHNpemUgKj0gbXVsdFNpemU7XG4gICAgbXVsdENvbnRyaWIgKj0gbXVsdENvbnRyaWJ1dGlvbjtcbiAgICBtYXhWYWx1ZSArPSBtdWx0Q29udHJpYjtcbiAgICB2ZWMyIG4gPSB0ZXh0dXJlKCBzYW1wbGVyMCwgc2l6ZSAqIHBvcy54eXogKS54eTtcbiAgICBuLnggPSBhYnMoIDIuMCAqIG4ueCAtMS4wICk7XG4gICAgbi55ID0gYWJzKCAyLjAgKiBuLnkgLTEuMCApO1xuICAgIG5vaXNlICs9IG11bHRDb250cmliICogKCBuICk7XG4gIH1cbiAgbm9pc2UgLz0gbWF4VmFsdWU7XG4gIHJldHVybiBub2lzZTtcbn1cbiovXG4iLCIvKlxuTWluY2UgU2xpY2VyXG5cbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAyMSBKdWFuIEpvc2UgTHVuYSBFc3Bpbm9zYVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuU09GVFdBUkUuXG5cbiovXG5cbmltcG9ydCB7IFZlY3RvcjIgfSBmcm9tICd0aHJlZSc7XG5pbXBvcnQgeyBSZWxpZWZOb2RlIH0gZnJvbSAnLi9SZWxpZWZOb2RlLmpzJztcblxuY2xhc3MgUmVsaWVmTm9kZVZvcm9ub2lVViBleHRlbmRzIFJlbGllZk5vZGUge1xuXG5cdGNvbnN0cnVjdG9yKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKSB7XG5cblx0XHRzdXBlciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICk7XG5cblx0XHR0aGlzLmNsYXNzTmFtZSA9ICdWb3Jvbm9pVVYnO1xuXG5cdFx0dGhpcy5udW1Qb2ludHMgPSBwYXJhbWV0ZXJWYWx1ZXNbIDEgXTtcblx0XHR0aGlzLmxpbmVUaGlja25lc3MgPSBwYXJhbWV0ZXJWYWx1ZXNbIDIgXTtcblxuXHRcdHRoaXMucHJuZyA9IGNvbnRleHQucHJuZztcblx0XHR0aGlzLnJhbmdlID0gdGhpcy5jZWlsIC0gdGhpcy5mbG9vcjtcblxuXHRcdHRoaXMucG9pbnRzID0gWyBdO1xuXHRcdGZvciAoIGxldCBpID0gMDsgaSA8IHRoaXMubnVtUG9pbnRzOyBpICsrICkge1xuXG5cdFx0XHR0aGlzLnBvaW50cy5wdXNoKCBuZXcgVmVjdG9yMiggdGhpcy5wcm5nLnJhbmRvbSgpLCB0aGlzLnBybmcucmFuZG9tKCkgKSApO1xuXG5cdFx0fVxuXG5cdFx0dGhpcy52ZWMyMSA9IG5ldyBWZWN0b3IyKCk7XG5cdFx0dGhpcy52ZWMyMiA9IG5ldyBWZWN0b3IyKCk7XG5cblxuXHR9XG5cblx0ZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApIHtcblxuXHRcdGNvbnN0IGxpbmVUaGlja25lc3MgPSB0aGlzLmxpbmVUaGlja25lc3MuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApO1xuXHRcdGNvbnN0IGxpbmVUaGlja25lc3MyID0gbGluZVRoaWNrbmVzcyAqIDAuNTtcblxuXHRcdGxldCBtaW5EaXN0MSA9ICsgSW5maW5pdHk7XG5cdFx0bGV0IG1pbkluZGV4MSA9IC0gMTtcblx0XHRmb3IgKCBsZXQgaSA9IDA7IGkgPCB0aGlzLm51bVBvaW50czsgaSArKyApIHtcblxuXHRcdFx0dGhpcy52ZWMyMS5zdWJWZWN0b3JzKCB1diwgdGhpcy5wb2ludHNbIGkgXSApO1xuXHRcdFx0Y29uc3QgZGlzdCA9IHRoaXMudmVjMjEubGVuZ3RoKCk7XG5cblx0XHRcdGlmICggZGlzdCA8IG1pbkRpc3QxICkge1xuXG5cdFx0XHRcdG1pbkRpc3QxID0gZGlzdDtcblx0XHRcdFx0bWluSW5kZXgxID0gaTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0dGhpcy52ZWMyMi5zdWJWZWN0b3JzKCB1diwgdGhpcy5wb2ludHNbIG1pbkluZGV4MSBdICkubm9ybWFsaXplKCkubXVsdGlwbHlTY2FsYXIoIGxpbmVUaGlja25lc3MyICkuYWRkKCB1diApO1xuXG5cdFx0bGV0IG1pbkRpc3QyID0gKyBJbmZpbml0eTtcblx0XHRsZXQgbWluSW5kZXgyID0gLSAxO1xuXHRcdGZvciAoIGxldCBpID0gMDsgaSA8IHRoaXMubnVtUG9pbnRzOyBpICsrICkge1xuXG5cdFx0XHR0aGlzLnZlYzIxLnN1YlZlY3RvcnMoIHRoaXMudmVjMjIsIHRoaXMucG9pbnRzWyBpIF0gKTtcblx0XHRcdGNvbnN0IGRpc3QgPSB0aGlzLnZlYzIxLmxlbmd0aCgpO1xuXG5cdFx0XHRpZiAoIGRpc3QgPCBtaW5EaXN0MiApIHtcblxuXHRcdFx0XHRtaW5EaXN0MiA9IGRpc3Q7XG5cdFx0XHRcdG1pbkluZGV4MiA9IGk7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdGNvbnN0IGRpc3RUb1Zvcm9ub2kgPSBNYXRoLmFicyggbWluRGlzdDIgLSBtaW5EaXN0MSApO1xuXG5cdFx0Y29uc3QgaXNJbkxpbmUgPSAoIGRpc3RUb1Zvcm9ub2kgPCBsaW5lVGhpY2tuZXNzMiApICYmICggbWluSW5kZXgxICE9PSBtaW5JbmRleDIgKTtcblxuXHRcdC8vcmV0dXJuIHRoaXMuZmxvb3IgKyB0aGlzLnJhbmdlICogKCBpc0luTGluZSA/IE1hdGgubWF4KCAwLCBkaXN0VG9Wb3Jvbm9pIC8gbGluZVRoaWNrbmVzczIgKSA6IDEgICk7XG5cdFx0cmV0dXJuIHRoaXMuZmxvb3IgKyB0aGlzLnJhbmdlICogKCBpc0luTGluZSA/IDAgOiAxICApO1xuXG5cdH1cblxufVxuXG5leHBvcnQgeyBSZWxpZWZOb2RlVm9yb25vaVVWIH07XG4iLCIvKlxuTWluY2UgU2xpY2VyXG5cbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAyMSBKdWFuIEpvc2UgTHVuYSBFc3Bpbm9zYVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuU09GVFdBUkUuXG5cbiovXG5cbmltcG9ydCB7IFJlbGllZk5vZGUgfSBmcm9tICcuL1JlbGllZk5vZGUuanMnO1xuXG5jbGFzcyBSZWxpZWZOb2RlQ2lyY2xlcyBleHRlbmRzIFJlbGllZk5vZGUge1xuXG5cdGNvbnN0cnVjdG9yKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKSB7XG5cblx0XHRzdXBlciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICk7XG5cblx0XHR0aGlzLmNsYXNzTmFtZSA9ICdDaXJjbGVzJztcblxuXHRcdHRoaXMubnVtQ2lyY2xlcyA9IHBhcmFtZXRlclZhbHVlc1sgMSBdICogMjtcblxuXHRcdHRoaXMub2Zmc2V0VSA9IHBhcmFtZXRlclZhbHVlc1sgMiBdO1xuXHRcdHRoaXMub2Zmc2V0ViA9IHBhcmFtZXRlclZhbHVlc1sgMyBdO1xuXG5cdFx0dGhpcy5yYW5nZSA9IHRoaXMuY2VpbCAtIHRoaXMuZmxvb3I7XG5cblx0fVxuXG5cdGV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKSB7XG5cblx0XHRjb25zdCB1ID0gdXYueCArIHRoaXMub2Zmc2V0VS5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICk7XG5cdFx0Y29uc3QgdiA9IHV2LnkgKyB0aGlzLm9mZnNldFYuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApO1xuXG5cdFx0Y29uc3QgciA9IE1hdGguc3FydCggdSAqIHUgKyB2ICogdiApO1xuXG5cdFx0cmV0dXJuIHRoaXMuZmxvb3IgKyB0aGlzLnJhbmdlICogKCBNYXRoLmZsb29yKCByICogdGhpcy5udW1DaXJjbGVzICkgJiAxID8gMSA6IDAgKTtcblxuXG5cdH1cblxufVxuXG5leHBvcnQgeyBSZWxpZWZOb2RlQ2lyY2xlcyB9O1xuIiwiLypcbk1pbmNlIFNsaWNlclxuXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMjEgSnVhbiBKb3NlIEx1bmEgRXNwaW5vc2FcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuXG4qL1xuXG5pbXBvcnQgeyBSZWxpZWZOb2RlQ2VsbCB9IGZyb20gJy4vUmVsaWVmTm9kZUNlbGwuanMnO1xuXG5jbGFzcyBSZWxpZWZOb2RlU3BvdHMgZXh0ZW5kcyBSZWxpZWZOb2RlQ2VsbCB7XG5cblx0Y29uc3RydWN0b3IoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApIHtcblxuXHRcdHN1cGVyKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKTtcblxuXHRcdHRoaXMuY2xhc3NOYW1lID0gJ1Nwb3RzJztcblxuXHRcdHRoaXMuc3BvdFJhZGl1cyA9IHBhcmFtZXRlclZhbHVlc1sgMyBdO1xuXG5cdFx0dGhpcy5yYW5nZSA9IHRoaXMuY2VpbCAtIHRoaXMuZmxvb3I7XG5cblx0fVxuXG5cdGV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKSB7XG5cblx0XHRjb25zdCBzaXplVSA9IHRoaXMuc2l6ZVUuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApO1xuXHRcdGNvbnN0IHNpemVWID0gdGhpcy5zaXplVi5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICk7XG5cblx0XHRjb25zdCBjZWxsVSA9IFJlbGllZk5vZGVDZWxsLmNvb3JkaW5hdGVUb0NlbGwoIHV2LngsIHNpemVVICk7XG5cdFx0Y29uc3QgY2VsbFYgPSBSZWxpZWZOb2RlQ2VsbC5jb29yZGluYXRlVG9DZWxsKCB1di55LCBzaXplViApO1xuXG5cdFx0dXYueCAtPSAoIGNlbGxVICogMC41ICsgMC41ICkgKiBzaXplVTtcblx0XHR1di55IC09ICggY2VsbFYgKiAwLjUgKyAwLjUgKSAqIHNpemVWO1xuXG5cdFx0Y29uc3QgcmFkaXVzID0gdGhpcy5zcG90UmFkaXVzLmV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKTtcblxuXHRcdGNvbnN0IHIgPSBNYXRoLnNxcnQoIGNlbGxVICogY2VsbFUgKyBjZWxsViAqIGNlbGxWICk7XG5cblx0XHRpZiAoIHIgPiByYWRpdXMgKSByZXR1cm4gdGhpcy5mbG9vcjtcblxuXHRcdGNvbnN0IGggPSAxIC0gciAvIHJhZGl1cztcblxuXHRcdHJldHVybiB0aGlzLmZsb29yICsgdGhpcy5yYW5nZSAqIGg7XG5cblx0fVxuXG59XG5cbmV4cG9ydCB7IFJlbGllZk5vZGVTcG90cyB9O1xuIiwiLypcbk1pbmNlIFNsaWNlclxuXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMjEgSnVhbiBKb3NlIEx1bmEgRXNwaW5vc2FcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuXG4qL1xuXG5pbXBvcnQgeyBSZWxpZWZOb2RlIH0gZnJvbSAnLi9SZWxpZWZOb2RlLmpzJztcblxuY2xhc3MgUmVsaWVmTm9kZVByZXNldCBleHRlbmRzIFJlbGllZk5vZGUge1xuXG5cdGNvbnN0cnVjdG9yKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKSB7XG5cblx0XHRzdXBlciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICk7XG5cblx0XHR0aGlzLmNsYXNzTmFtZSA9ICdQcmVzZXQnO1xuXG5cdFx0dGhpcy5wcmVzZXQgPSBwYXJhbWV0ZXJWYWx1ZXNbIDAgXTtcblxuXHR9XG5cblx0ZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApIHtcblxuXHRcdGlmICggISB0aGlzLnByZXNldCApIHJldHVybiAwO1xuXG5cdFx0cmV0dXJuIHRoaXMucHJlc2V0LmV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKTtcblxuXHR9XG5cbn1cblxuZXhwb3J0IHsgUmVsaWVmTm9kZVByZXNldCB9O1xuIiwiLypcbk1pbmNlIFNsaWNlclxuXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMjEgSnVhbiBKb3NlIEx1bmEgRXNwaW5vc2FcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuXG4qL1xuXG5pbXBvcnQgeyBSZWxpZWZOb2RlIH0gZnJvbSAnLi9SZWxpZWZOb2RlLmpzJztcblxuY2xhc3MgUmVsaWVmTm9kZU1hdGVyaWFsU2VsZWN0b3IgZXh0ZW5kcyBSZWxpZWZOb2RlIHtcblxuXHRjb25zdHJ1Y3RvciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICkge1xuXG5cdFx0c3VwZXIoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApO1xuXG5cdFx0dGhpcy5jbGFzc05hbWUgPSAnTWF0ZXJpYWxTZWxlY3Rvcic7XG5cblx0XHR0aGlzLm1hdGVyaWFscyA9IHBhcmFtZXRlclZhbHVlc1sgMCBdO1xuXG5cdH1cblxuXHRldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICkge1xuXG5cdFx0aWYgKCBtYXRlcmlhbEluZGV4ID49IHRoaXMubWF0ZXJpYWxzLmxlbmd0aCApIHJldHVybiAwO1xuXG5cdFx0cmV0dXJuIHRoaXMubWF0ZXJpYWxzWyBtYXRlcmlhbEluZGV4IF0uZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCAgKTtcblxuXHR9XG5cbn1cblxuZXhwb3J0IHsgUmVsaWVmTm9kZU1hdGVyaWFsU2VsZWN0b3IgfTtcbiIsIi8qXG5NaW5jZSBTbGljZXJcblxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDIxIEp1YW4gSm9zZSBMdW5hIEVzcGlub3NhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cblxuKi9cblxuaW1wb3J0IHsgUmVsaWVmTm9kZSB9IGZyb20gJy4vUmVsaWVmTm9kZS5qcyc7XG5cbmNsYXNzIFJlbGllZk5vZGVNdWx0aXBsZXggZXh0ZW5kcyBSZWxpZWZOb2RlIHtcblxuXHRjb25zdHJ1Y3RvciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICkge1xuXG5cdFx0c3VwZXIoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApO1xuXG5cdFx0dGhpcy5jbGFzc05hbWUgPSAnTXVsdGlwbGV4JztcblxuXHRcdHRoaXMubm9kZXMgPSBwYXJhbWV0ZXJWYWx1ZXNbIDAgXTtcblxuXHRcdHRoaXMuaW5kZXhOb2RlID0gcGFyYW1ldGVyVmFsdWVzWyAxIF07XG5cblx0fVxuXG5cdGV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKSB7XG5cblx0XHRjb25zdCBpbmRleCA9IE1hdGguZmxvb3IoIHRoaXMuaW5kZXhOb2RlLmV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKSApO1xuXG5cdFx0aWYgKCBpbmRleCA8IDAgfHwgaW5kZXggPj0gdGhpcy5ub2Rlcy5sZW5ndGggKSByZXR1cm4gMDtcblxuXHRcdHJldHVybiB0aGlzLm5vZGVzWyBpbmRleCBdLmV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggICk7XG5cblx0fVxuXG59XG5cbmV4cG9ydCB7IFJlbGllZk5vZGVNdWx0aXBsZXggfTtcbiIsIi8qXG5NaW5jZSBTbGljZXJcblxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDIxIEp1YW4gSm9zZSBMdW5hIEVzcGlub3NhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cblxuKi9cblxuaW1wb3J0ICogYXMgQ29uc3RhbnRzIGZyb20gJy4uL25vZGVzL0NvbnN0YW50cy5qcyc7XG5pbXBvcnQgeyBSZWxpZWZOb2RlQ29uc3RhbnQgfSBmcm9tICcuL1JlbGllZk5vZGVDb25zdGFudC5qcyc7XG5pbXBvcnQgeyBSZWxpZWZOb2RlSW1hZ2VVViB9IGZyb20gJy4vUmVsaWVmTm9kZUltYWdlVVYuanMnO1xuaW1wb3J0IHsgUmVsaWVmTm9kZUltYWdlVGlsZWRVViB9IGZyb20gJy4vUmVsaWVmTm9kZUltYWdlVGlsZWRVVi5qcyc7XG5pbXBvcnQgeyBSZWxpZWZOb2RlQWRkIH0gZnJvbSAnLi9SZWxpZWZOb2RlQWRkLmpzJztcbmltcG9ydCB7IFJlbGllZk5vZGVOZWdhdGUgfSBmcm9tICcuL1JlbGllZk5vZGVOZWdhdGUuanMnO1xuaW1wb3J0IHsgUmVsaWVmTm9kZU11bHRpcGx5IH0gZnJvbSAnLi9SZWxpZWZOb2RlTXVsdGlwbHkuanMnO1xuaW1wb3J0IHsgUmVsaWVmTm9kZURpdmlkZSB9IGZyb20gJy4vUmVsaWVmTm9kZURpdmlkZS5qcyc7XG5pbXBvcnQgeyBSZWxpZWZOb2RlUG93ZXIgfSBmcm9tICcuL1JlbGllZk5vZGVQb3dlci5qcyc7XG5pbXBvcnQgeyBSZWxpZWZOb2RlU2luIH0gZnJvbSAnLi9SZWxpZWZOb2RlU2luLmpzJztcbmltcG9ydCB7IFJlbGllZk5vZGVDb3MgfSBmcm9tICcuL1JlbGllZk5vZGVDb3MuanMnO1xuaW1wb3J0IHsgUmVsaWVmTm9kZU1peCB9IGZyb20gJy4vUmVsaWVmTm9kZU1peC5qcyc7XG5pbXBvcnQgeyBSZWxpZWZOb2RlTWluIH0gZnJvbSAnLi9SZWxpZWZOb2RlTWluLmpzJztcbmltcG9ydCB7IFJlbGllZk5vZGVNYXggfSBmcm9tICcuL1JlbGllZk5vZGVNYXguanMnO1xuaW1wb3J0IHsgUmVsaWVmTm9kZUxlc3NUaGFuIH0gZnJvbSAnLi9SZWxpZWZOb2RlTGVzc1RoYW4uanMnO1xuaW1wb3J0IHsgUmVsaWVmTm9kZU5vdEJvdHRvbSB9IGZyb20gJy4vUmVsaWVmTm9kZU5vdEJvdHRvbS5qcyc7XG5pbXBvcnQgeyBSZWxpZWZOb2RlUXVhbnRpemUgfSBmcm9tICcuL1JlbGllZk5vZGVRdWFudGl6ZS5qcyc7XG5pbXBvcnQgeyBSZWxpZWZOb2RlRXZhbHVhdGUgfSBmcm9tICcuL1JlbGllZk5vZGVFdmFsdWF0ZS5qcyc7XG5pbXBvcnQgeyBSZWxpZWZOb2RlR2V0VSB9IGZyb20gJy4vUmVsaWVmTm9kZUdldFUuanMnO1xuaW1wb3J0IHsgUmVsaWVmTm9kZUdldFYgfSBmcm9tICcuL1JlbGllZk5vZGVHZXRWLmpzJztcbmltcG9ydCB7IFJlbGllZk5vZGVHZXRYIH0gZnJvbSAnLi9SZWxpZWZOb2RlR2V0WC5qcyc7XG5pbXBvcnQgeyBSZWxpZWZOb2RlR2V0WSB9IGZyb20gJy4vUmVsaWVmTm9kZUdldFkuanMnO1xuaW1wb3J0IHsgUmVsaWVmTm9kZUdldFogfSBmcm9tICcuL1JlbGllZk5vZGVHZXRaLmpzJztcbmltcG9ydCB7IFJlbGllZk5vZGVDaGVja2VyZWQgfSBmcm9tICcuL1JlbGllZk5vZGVDaGVja2VyZWQuanMnO1xuaW1wb3J0IHsgUmVsaWVmTm9kZVRpbGVzIH0gZnJvbSAnLi9SZWxpZWZOb2RlVGlsZXMuanMnO1xuaW1wb3J0IHsgUmVsaWVmTm9kZVNpbXBsZXhVViB9IGZyb20gJy4vUmVsaWVmTm9kZVNpbXBsZXhVVi5qcyc7XG5pbXBvcnQgeyBSZWxpZWZOb2RlUGVybGluVVYgfSBmcm9tICcuL1JlbGllZk5vZGVQZXJsaW5VVi5qcyc7XG5pbXBvcnQgeyBSZWxpZWZOb2RlVm9yb25vaVVWIH0gZnJvbSAnLi9SZWxpZWZOb2RlVm9yb25vaVVWLmpzJztcbmltcG9ydCB7IFJlbGllZk5vZGVDaXJjbGVzIH0gZnJvbSAnLi9SZWxpZWZOb2RlQ2lyY2xlcy5qcyc7XG5pbXBvcnQgeyBSZWxpZWZOb2RlU3BvdHMgfSBmcm9tICcuL1JlbGllZk5vZGVTcG90cy5qcyc7XG5pbXBvcnQgeyBSZWxpZWZOb2RlUHJlc2V0IH0gZnJvbSAnLi9SZWxpZWZOb2RlUHJlc2V0LmpzJztcbmltcG9ydCB7IFJlbGllZk5vZGVNYXRlcmlhbFNlbGVjdG9yIH0gZnJvbSAnLi9SZWxpZWZOb2RlTWF0ZXJpYWxTZWxlY3Rvci5qcyc7XG5pbXBvcnQgeyBSZWxpZWZOb2RlTXVsdGlwbGV4IH0gZnJvbSAnLi9SZWxpZWZOb2RlTXVsdGlwbGV4LmpzJztcblxuZnVuY3Rpb24gZ2V0TW9kZVBhcmFtZXRlclNpZ25hdHVyZSgpIHtcblxuXHRyZXR1cm4ge1xuXHRcdG5hbWU6ICdNb2RlJyxcblx0XHR0eXBlOiAnc3RyaW5nJyxcblx0fTtcblxufVxuXG5mdW5jdGlvbiBnZXRDb25zdGFudFZhbHVlTm9kZSggdmFsdWUgKSB7XG5cblx0cmV0dXJuIHtcblx0XHRjbGFzc05hbWU6ICdDb25zdGFudCcsXG5cdFx0cGFyYW1ldGVyVmFsdWVzOiBbIHZhbHVlIF1cblx0fTtcblxufVxuXG5jb25zdCByZWxpZWZOb2RlQ2xhc3NlcyA9IHtcblx0J0NvbnN0YW50Jzoge1xuXHRcdGNsYXNzT2JqZWN0OiBSZWxpZWZOb2RlQ29uc3RhbnQsXG5cdFx0cGFyYW1ldGVyczogW1xuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnVmFsdWUnLFxuXHRcdFx0XHR0eXBlOiAnbnVtYmVyJ1xuXHRcdFx0fVxuXHRcdF0sXG5cdFx0ZGVmYXVsdE5vZGVWYWx1ZToge1xuXHRcdFx0cGFyYW1ldGVyVmFsdWVzOiBbXG5cdFx0XHRcdDBcblx0XHRcdF1cblx0XHR9XG5cdH0sXG5cdCdJbWFnZVVWJzoge1xuXHRcdGNsYXNzT2JqZWN0OiBSZWxpZWZOb2RlSW1hZ2VVVixcblx0XHRwYXJhbWV0ZXJzOiBbXG5cdFx0XHRnZXRNb2RlUGFyYW1ldGVyU2lnbmF0dXJlKCksXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdJbWFnZSBzaXplIFUnLFxuXHRcdFx0XHR0eXBlOiAnbnVtYmVyJ1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0ltYWdlIHNpemUgVicsXG5cdFx0XHRcdHR5cGU6ICdudW1iZXInXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnT2Zmc2V0IFUnLFxuXHRcdFx0XHR0eXBlOiAnbnVtYmVyJ1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ09mZnNldCBWJyxcblx0XHRcdFx0dHlwZTogJ251bWJlcidcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdJbWFnZScsXG5cdFx0XHRcdHR5cGU6ICdpbWFnZSdcblx0XHRcdH1cblx0XHRdLFxuXHRcdGRlZmF1bHROb2RlVmFsdWU6IHtcblx0XHRcdHBhcmFtZXRlclZhbHVlczogW1xuXHRcdFx0XHRDb25zdGFudHMuUkVMSUVGX0VNQk9TUyxcblx0XHRcdFx0MSxcblx0XHRcdFx0MSxcblx0XHRcdFx0MCxcblx0XHRcdFx0MCxcblx0XHRcdFx0XCJOb25lXCJcblx0XHRcdF1cblx0XHR9XG5cdH0sXG5cdCdJbWFnZVRpbGVkVVYnOiB7XG5cdFx0Y2xhc3NPYmplY3Q6IFJlbGllZk5vZGVJbWFnZVRpbGVkVVYsXG5cdFx0cGFyYW1ldGVyczogW1xuXHRcdFx0Z2V0TW9kZVBhcmFtZXRlclNpZ25hdHVyZSgpLFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnU2l6ZSBVJyxcblx0XHRcdFx0dHlwZTogJ25vZGUnXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnU2l6ZSBWJyxcblx0XHRcdFx0dHlwZTogJ25vZGUnXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnSW1hZ2Ugc2l6ZSBVJyxcblx0XHRcdFx0dHlwZTogJ251bWJlcidcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdJbWFnZSBzaXplIFYnLFxuXHRcdFx0XHR0eXBlOiAnbnVtYmVyJ1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ09mZnNldCBVJyxcblx0XHRcdFx0dHlwZTogJ251bWJlcidcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdPZmZzZXQgVicsXG5cdFx0XHRcdHR5cGU6ICdudW1iZXInXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnSW1hZ2UnLFxuXHRcdFx0XHR0eXBlOiAnaW1hZ2UnXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRkZWZhdWx0Tm9kZVZhbHVlOiB7XG5cdFx0XHRwYXJhbWV0ZXJWYWx1ZXM6IFtcblx0XHRcdFx0Q29uc3RhbnRzLlJFTElFRl9FTUJPU1MsXG5cdFx0XHRcdGdldENvbnN0YW50VmFsdWVOb2RlKCAwLjEgKSxcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDAuMSApLFxuXHRcdFx0XHQyLFxuXHRcdFx0XHQyLFxuXHRcdFx0XHQtMSxcblx0XHRcdFx0LTEsXG5cdFx0XHRcdFwiTm9uZVwiXG5cdFx0XHRdXG5cdFx0fVxuXHR9LFxuXHQnQWRkJzoge1xuXHRcdGNsYXNzT2JqZWN0OiBSZWxpZWZOb2RlQWRkLFxuXHRcdHBhcmFtZXRlcnM6IFtcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0EnLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdCJyxcblx0XHRcdFx0dHlwZTogJ25vZGUnXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRkZWZhdWx0Tm9kZVZhbHVlOiB7XG5cdFx0XHRwYXJhbWV0ZXJWYWx1ZXM6IFtcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDAgKSxcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDAgKVxuXHRcdFx0XVxuXHRcdH1cblx0fSxcblx0J05lZ2F0ZSc6IHtcblx0XHRjbGFzc09iamVjdDogUmVsaWVmTm9kZU5lZ2F0ZSxcblx0XHRwYXJhbWV0ZXJzOiBbXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdBJyxcblx0XHRcdFx0dHlwZTogJ25vZGUnXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRkZWZhdWx0Tm9kZVZhbHVlOiB7XG5cdFx0XHRwYXJhbWV0ZXJWYWx1ZXM6IFtcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDAgKVxuXHRcdFx0XVxuXHRcdH1cblx0fSxcblx0J011bHRpcGx5Jzoge1xuXHRcdGNsYXNzT2JqZWN0OiBSZWxpZWZOb2RlTXVsdGlwbHksXG5cdFx0cGFyYW1ldGVyczogW1xuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnQScsXG5cdFx0XHRcdHR5cGU6ICdub2RlJ1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0InLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH1cblx0XHRdLFxuXHRcdGRlZmF1bHROb2RlVmFsdWU6IHtcblx0XHRcdHBhcmFtZXRlclZhbHVlczogW1xuXHRcdFx0XHRnZXRDb25zdGFudFZhbHVlTm9kZSggMSApLFxuXHRcdFx0XHRnZXRDb25zdGFudFZhbHVlTm9kZSggMSApXG5cdFx0XHRdXG5cdFx0fVxuXHR9LFxuXHQnTWl4Jzoge1xuXHRcdGNsYXNzT2JqZWN0OiBSZWxpZWZOb2RlTWl4LFxuXHRcdHBhcmFtZXRlcnM6IFtcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0EnLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdCJyxcblx0XHRcdFx0dHlwZTogJ25vZGUnXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnRmFjdG9yJyxcblx0XHRcdFx0dHlwZTogJ25vZGUnLFxuXHRcdFx0fVxuXHRcdF0sXG5cdFx0ZGVmYXVsdE5vZGVWYWx1ZToge1xuXHRcdFx0cGFyYW1ldGVyVmFsdWVzOiBbXG5cdFx0XHRcdGdldENvbnN0YW50VmFsdWVOb2RlKCAwICksXG5cdFx0XHRcdGdldENvbnN0YW50VmFsdWVOb2RlKCAwICksXG5cdFx0XHRcdGdldENvbnN0YW50VmFsdWVOb2RlKCAwLjUgKVxuXHRcdFx0XVxuXHRcdH1cblx0fSxcblx0J01pbic6IHtcblx0XHRjbGFzc09iamVjdDogUmVsaWVmTm9kZU1pbixcblx0XHRwYXJhbWV0ZXJzOiBbXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdBJyxcblx0XHRcdFx0dHlwZTogJ25vZGUnXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnQicsXG5cdFx0XHRcdHR5cGU6ICdub2RlJ1xuXHRcdFx0fVxuXHRcdF0sXG5cdFx0ZGVmYXVsdE5vZGVWYWx1ZToge1xuXHRcdFx0cGFyYW1ldGVyVmFsdWVzOiBbXG5cdFx0XHRcdGdldENvbnN0YW50VmFsdWVOb2RlKCAwICksXG5cdFx0XHRcdGdldENvbnN0YW50VmFsdWVOb2RlKCAwIClcblx0XHRcdF1cblx0XHR9XG5cdH0sXG5cdCdNYXgnOiB7XG5cdFx0Y2xhc3NPYmplY3Q6IFJlbGllZk5vZGVNYXgsXG5cdFx0cGFyYW1ldGVyczogW1xuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnQScsXG5cdFx0XHRcdHR5cGU6ICdub2RlJ1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0InLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH1cblx0XHRdLFxuXHRcdGRlZmF1bHROb2RlVmFsdWU6IHtcblx0XHRcdHBhcmFtZXRlclZhbHVlczogW1xuXHRcdFx0XHRnZXRDb25zdGFudFZhbHVlTm9kZSggMCApLFxuXHRcdFx0XHRnZXRDb25zdGFudFZhbHVlTm9kZSggMCApXG5cdFx0XHRdXG5cdFx0fVxuXHR9LFxuXHQnTGVzc1RoYW4nOiB7XG5cdFx0Y2xhc3NPYmplY3Q6IFJlbGllZk5vZGVMZXNzVGhhbixcblx0XHRwYXJhbWV0ZXJzOiBbXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdBJyxcblx0XHRcdFx0dHlwZTogJ25vZGUnXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnQicsXG5cdFx0XHRcdHR5cGU6ICdub2RlJ1xuXHRcdFx0fVxuXHRcdF0sXG5cdFx0ZGVmYXVsdE5vZGVWYWx1ZToge1xuXHRcdFx0cGFyYW1ldGVyVmFsdWVzOiBbXG5cdFx0XHRcdGdldENvbnN0YW50VmFsdWVOb2RlKCAwICksXG5cdFx0XHRcdGdldENvbnN0YW50VmFsdWVOb2RlKCAwIClcblx0XHRcdF1cblx0XHR9XG5cdH0sXG5cdCdOb3RCb3R0b20nOiB7XG5cdFx0Y2xhc3NPYmplY3Q6IFJlbGllZk5vZGVOb3RCb3R0b20sXG5cdFx0cGFyYW1ldGVyczogWyBdLFxuXHRcdGRlZmF1bHROb2RlVmFsdWU6IHtcblx0XHRcdHBhcmFtZXRlclZhbHVlczogWyBdXG5cdFx0fVxuXHR9LFxuXHQnRGl2aWRlJzoge1xuXHRcdGNsYXNzT2JqZWN0OiBSZWxpZWZOb2RlRGl2aWRlLFxuXHRcdHBhcmFtZXRlcnM6IFtcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0EnLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdCJyxcblx0XHRcdFx0dHlwZTogJ25vZGUnXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRkZWZhdWx0Tm9kZVZhbHVlOiB7XG5cdFx0XHRwYXJhbWV0ZXJWYWx1ZXM6IFtcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDAgKSxcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDAgKVxuXHRcdFx0XVxuXHRcdH1cblx0fSxcblx0J1Bvd2VyJzoge1xuXHRcdGNsYXNzT2JqZWN0OiBSZWxpZWZOb2RlUG93ZXIsXG5cdFx0cGFyYW1ldGVyczogW1xuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnQScsXG5cdFx0XHRcdHR5cGU6ICdub2RlJ1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0InLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH1cblx0XHRdLFxuXHRcdGRlZmF1bHROb2RlVmFsdWU6IHtcblx0XHRcdHBhcmFtZXRlclZhbHVlczogW1xuXHRcdFx0XHRnZXRDb25zdGFudFZhbHVlTm9kZSggMCApLFxuXHRcdFx0XHRnZXRDb25zdGFudFZhbHVlTm9kZSggMCApXG5cdFx0XHRdXG5cdFx0fVxuXHR9LFxuXHQnU2luJzoge1xuXHRcdGNsYXNzT2JqZWN0OiBSZWxpZWZOb2RlU2luLFxuXHRcdHBhcmFtZXRlcnM6IFtcblx0XHRcdGdldE1vZGVQYXJhbWV0ZXJTaWduYXR1cmUoKSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0EnLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH1cblx0XHRdLFxuXHRcdGRlZmF1bHROb2RlVmFsdWU6IHtcblx0XHRcdHBhcmFtZXRlclZhbHVlczogW1xuXHRcdFx0XHRDb25zdGFudHMuUkVMSUVGX0VNQk9TUyxcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDAgKVxuXHRcdFx0XVxuXHRcdH1cblx0fSxcblx0J0Nvcyc6IHtcblx0XHRjbGFzc09iamVjdDogUmVsaWVmTm9kZUNvcyxcblx0XHRwYXJhbWV0ZXJzOiBbXG5cdFx0XHRnZXRNb2RlUGFyYW1ldGVyU2lnbmF0dXJlKCksXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdBJyxcblx0XHRcdFx0dHlwZTogJ25vZGUnXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRkZWZhdWx0Tm9kZVZhbHVlOiB7XG5cdFx0XHRwYXJhbWV0ZXJWYWx1ZXM6IFtcblx0XHRcdFx0Q29uc3RhbnRzLlJFTElFRl9FTUJPU1MsXG5cdFx0XHRcdGdldENvbnN0YW50VmFsdWVOb2RlKCAwIClcblx0XHRcdF1cblx0XHR9XG5cdH0sXG5cdCdRdWFudGl6ZSc6IHtcblx0XHRjbGFzc09iamVjdDogUmVsaWVmTm9kZVF1YW50aXplLFxuXHRcdHBhcmFtZXRlcnM6IFtcblx0XHRcdGdldE1vZGVQYXJhbWV0ZXJTaWduYXR1cmUoKSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0EnLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdTdGVwIHNpemUnLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH1cblx0XHRdLFxuXHRcdGRlZmF1bHROb2RlVmFsdWU6IHtcblx0XHRcdHBhcmFtZXRlclZhbHVlczogW1xuXHRcdFx0XHRDb25zdGFudHMuUkVMSUVGX0VNQk9TUyxcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDAgKSxcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDAuMSApXG5cdFx0XHRdXG5cdFx0fVxuXHR9LFxuXHQnRXZhbHVhdGUnOiB7XG5cdFx0Y2xhc3NPYmplY3Q6IFJlbGllZk5vZGVFdmFsdWF0ZSxcblx0XHRwYXJhbWV0ZXJzOiBbXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdBJyxcblx0XHRcdFx0dHlwZTogJ25vZGUnXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnVScsXG5cdFx0XHRcdHR5cGU6ICdub2RlJ1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ1YnLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH0sXG5cdFx0XSxcblx0XHRkZWZhdWx0Tm9kZVZhbHVlOiB7XG5cdFx0XHRwYXJhbWV0ZXJWYWx1ZXM6IFtcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDAgKSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNsYXNzTmFtZTogJ0dldFUnLFxuXHRcdFx0XHRcdHBhcmFtZXRlclZhbHVlczogWyBdXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjbGFzc05hbWU6ICdHZXRWJyxcblx0XHRcdFx0XHRwYXJhbWV0ZXJWYWx1ZXM6IFsgXVxuXHRcdFx0XHR9XG5cdFx0XHRdXG5cdFx0fVxuXHR9LFxuXHQnR2V0VSc6IHtcblx0XHRjbGFzc09iamVjdDogUmVsaWVmTm9kZUdldFUsXG5cdFx0cGFyYW1ldGVyczogW1xuXHRcdF0sXG5cdFx0ZGVmYXVsdE5vZGVWYWx1ZToge1xuXHRcdFx0cGFyYW1ldGVyVmFsdWVzOiBbIF1cblx0XHR9XG5cdH0sXG5cdCdHZXRWJzoge1xuXHRcdGNsYXNzT2JqZWN0OiBSZWxpZWZOb2RlR2V0Vixcblx0XHRwYXJhbWV0ZXJzOiBbXG5cdFx0XSxcblx0XHRkZWZhdWx0Tm9kZVZhbHVlOiB7XG5cdFx0XHRwYXJhbWV0ZXJWYWx1ZXM6IFsgXVxuXHRcdH1cblx0fSxcblx0J0dldFgnOiB7XG5cdFx0Y2xhc3NPYmplY3Q6IFJlbGllZk5vZGVHZXRYLFxuXHRcdHBhcmFtZXRlcnM6IFtcblx0XHRdLFxuXHRcdGRlZmF1bHROb2RlVmFsdWU6IHtcblx0XHRcdHBhcmFtZXRlclZhbHVlczogWyBdXG5cdFx0fVxuXHR9LFxuXHQnR2V0WSc6IHtcblx0XHRjbGFzc09iamVjdDogUmVsaWVmTm9kZUdldFksXG5cdFx0cGFyYW1ldGVyczogW1xuXHRcdF0sXG5cdFx0ZGVmYXVsdE5vZGVWYWx1ZToge1xuXHRcdFx0cGFyYW1ldGVyVmFsdWVzOiBbIF1cblx0XHR9XG5cdH0sXG5cdCdHZXRaJzoge1xuXHRcdGNsYXNzT2JqZWN0OiBSZWxpZWZOb2RlR2V0Wixcblx0XHRwYXJhbWV0ZXJzOiBbXG5cdFx0XSxcblx0XHRkZWZhdWx0Tm9kZVZhbHVlOiB7XG5cdFx0XHRwYXJhbWV0ZXJWYWx1ZXM6IFsgXVxuXHRcdH1cblx0fSxcblx0J0NoZWNrZXJlZCc6IHtcblx0XHRjbGFzc09iamVjdDogUmVsaWVmTm9kZUNoZWNrZXJlZCxcblx0XHRwYXJhbWV0ZXJzOiBbXG5cdFx0XHRnZXRNb2RlUGFyYW1ldGVyU2lnbmF0dXJlKCksXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdTaXplIFUnLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdTaXplIFYnLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdDaGVja2VyIGZyYWN0aW9uIFUnLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdDaGVja2VyIGZyYWN0aW9uIFYnLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH1cblx0XHRdLFxuXHRcdGRlZmF1bHROb2RlVmFsdWU6IHtcblx0XHRcdHBhcmFtZXRlclZhbHVlczogW1xuXHRcdFx0XHRDb25zdGFudHMuUkVMSUVGX0VNQk9TUyxcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDAuMDUgKSxcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDAuMDUgKSxcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDAgKSxcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDAgKVxuXHRcdFx0XVxuXHRcdH1cblx0fSxcblx0J1RpbGVzJzoge1xuXHRcdGNsYXNzT2JqZWN0OiBSZWxpZWZOb2RlVGlsZXMsXG5cdFx0cGFyYW1ldGVyczogW1xuXHRcdFx0Z2V0TW9kZVBhcmFtZXRlclNpZ25hdHVyZSgpLFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnU2l6ZSBVJyxcblx0XHRcdFx0dHlwZTogJ25vZGUnXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnU2l6ZSBWJyxcblx0XHRcdFx0dHlwZTogJ25vZGUnXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnQmV2ZWwgZnJhY3Rpb24nLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdBbHRlcm5hdGVkIGJyaWNrcycsXG5cdFx0XHRcdHR5cGU6ICdib29sZWFuJ1xuXHRcdFx0fVxuXHRcdF0sXG5cdFx0ZGVmYXVsdE5vZGVWYWx1ZToge1xuXHRcdFx0cGFyYW1ldGVyVmFsdWVzOiBbXG5cdFx0XHRcdENvbnN0YW50cy5SRUxJRUZfRU1CT1NTLFxuXHRcdFx0XHRnZXRDb25zdGFudFZhbHVlTm9kZSggMC4yICksXG5cdFx0XHRcdGdldENvbnN0YW50VmFsdWVOb2RlKCAwLjIgKSxcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDAuMyApLFxuXHRcdFx0XHRmYWxzZVxuXHRcdFx0XVxuXHRcdH1cblx0fSxcblx0J1NpbXBsZXhVVic6IHtcblx0XHRjbGFzc09iamVjdDogUmVsaWVmTm9kZVNpbXBsZXhVVixcblx0XHRwYXJhbWV0ZXJzOiBbXG5cdFx0XHRnZXRNb2RlUGFyYW1ldGVyU2lnbmF0dXJlKCksXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdTY2FsZSBVJyxcblx0XHRcdFx0dHlwZTogJ25vZGUnXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnU2NhbGUgVicsXG5cdFx0XHRcdHR5cGU6ICdub2RlJ1xuXHRcdFx0fVxuXHRcdF0sXG5cdFx0ZGVmYXVsdE5vZGVWYWx1ZToge1xuXHRcdFx0cGFyYW1ldGVyVmFsdWVzOiBbXG5cdFx0XHRcdENvbnN0YW50cy5SRUxJRUZfRU1CT1NTLFxuXHRcdFx0XHRnZXRDb25zdGFudFZhbHVlTm9kZSggNSApLFxuXHRcdFx0XHRnZXRDb25zdGFudFZhbHVlTm9kZSggNSApXG5cdFx0XHRdXG5cdFx0fVxuXHR9LFxuXHQnUGVybGluVVYnOiB7XG5cdFx0Y2xhc3NPYmplY3Q6IFJlbGllZk5vZGVQZXJsaW5VVixcblx0XHRwYXJhbWV0ZXJzOiBbXG5cdFx0XHRnZXRNb2RlUGFyYW1ldGVyU2lnbmF0dXJlKCksXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdOdW1iZXIgb2YgaXRlcmF0aW9ucycsXG5cdFx0XHRcdHR5cGU6ICdudW1iZXInXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnU2l6ZScsXG5cdFx0XHRcdHR5cGU6ICdub2RlJ1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ1NpemUgbXVsdGlwbGllcicsXG5cdFx0XHRcdHR5cGU6ICdub2RlJ1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0NvbnRyaWJ1dGlvbiBtdWx0aXBsaWVyJyxcblx0XHRcdFx0dHlwZTogJ25vZGUnXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRkZWZhdWx0Tm9kZVZhbHVlOiB7XG5cdFx0XHRwYXJhbWV0ZXJWYWx1ZXM6IFtcblx0XHRcdFx0Q29uc3RhbnRzLlJFTElFRixcblx0XHRcdFx0MTAsXG5cdFx0XHRcdGdldENvbnN0YW50VmFsdWVOb2RlKCA1ICksXG5cdFx0XHRcdGdldENvbnN0YW50VmFsdWVOb2RlKCAxLjUgKSxcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDAuOCApXG5cdFx0XHRdXG5cdFx0fVxuXHR9LFxuXHQnVm9yb25vaVVWJzoge1xuXHRcdGNsYXNzT2JqZWN0OiBSZWxpZWZOb2RlVm9yb25vaVVWLFxuXHRcdHBhcmFtZXRlcnM6IFtcblx0XHRcdGdldE1vZGVQYXJhbWV0ZXJTaWduYXR1cmUoKSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ051bWJlciBvZiBwb2ludHMnLFxuXHRcdFx0XHR0eXBlOiAnbnVtYmVyJ1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0xpbmUgdGhpY2tuZXNzJyxcblx0XHRcdFx0dHlwZTogJ25vZGUnXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRkZWZhdWx0Tm9kZVZhbHVlOiB7XG5cdFx0XHRwYXJhbWV0ZXJWYWx1ZXM6IFtcblx0XHRcdFx0Q29uc3RhbnRzLlJFTElFRl9FTUJPU1MsXG5cdFx0XHRcdDUwLFxuXHRcdFx0XHRnZXRDb25zdGFudFZhbHVlTm9kZSggMC4wMSApXG5cdFx0XHRdXG5cdFx0fVxuXHR9LFxuXHQnQ2lyY2xlcyc6IHtcblx0XHRjbGFzc09iamVjdDogUmVsaWVmTm9kZUNpcmNsZXMsXG5cdFx0cGFyYW1ldGVyczogW1xuXHRcdFx0Z2V0TW9kZVBhcmFtZXRlclNpZ25hdHVyZSgpLFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnTnVtYmVyIG9mIGNpcmNsZXMnLFxuXHRcdFx0XHR0eXBlOiAnbnVtYmVyJ1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ09mZnNldCBVJyxcblx0XHRcdFx0dHlwZTogJ25vZGUnXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnT2Zmc2V0IFYnLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH1cblx0XHRdLFxuXHRcdGRlZmF1bHROb2RlVmFsdWU6IHtcblx0XHRcdHBhcmFtZXRlclZhbHVlczogW1xuXHRcdFx0XHRDb25zdGFudHMuUkVMSUVGX0VNQk9TUyxcblx0XHRcdFx0MTAsXG5cdFx0XHRcdGdldENvbnN0YW50VmFsdWVOb2RlKCAtIDAuNSApLFxuXHRcdFx0XHRnZXRDb25zdGFudFZhbHVlTm9kZSggLSAwLjUgKVxuXHRcdFx0XVxuXHRcdH1cblx0fSxcblx0J1Nwb3RzJzoge1xuXHRcdGNsYXNzT2JqZWN0OiBSZWxpZWZOb2RlU3BvdHMsXG5cdFx0cGFyYW1ldGVyczogW1xuXHRcdFx0Z2V0TW9kZVBhcmFtZXRlclNpZ25hdHVyZSgpLFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnU2l6ZSBVJyxcblx0XHRcdFx0dHlwZTogJ25vZGUnXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnU2l6ZSBWJyxcblx0XHRcdFx0dHlwZTogJ25vZGUnXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnU3BvdCByYWRpdXMnLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH1cblx0XHRdLFxuXHRcdGRlZmF1bHROb2RlVmFsdWU6IHtcblx0XHRcdHBhcmFtZXRlclZhbHVlczogW1xuXHRcdFx0XHRDb25zdGFudHMuUkVMSUVGX0VNQk9TUyxcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDAuMSApLFxuXHRcdFx0XHRnZXRDb25zdGFudFZhbHVlTm9kZSggMC4xICksXG5cdFx0XHRcdGdldENvbnN0YW50VmFsdWVOb2RlKCAwLjMgKSxcblx0XHRcdF1cblx0XHR9XG5cdH0sXG5cdCdQcmVzZXQnOiB7XG5cdFx0Y2xhc3NPYmplY3Q6IFJlbGllZk5vZGVQcmVzZXQsXG5cdFx0cGFyYW1ldGVyczogW1xuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnUHJlc2V0IG5hbWUnLFxuXHRcdFx0XHR0eXBlOiAncHJlc2V0J1xuXHRcdFx0fVxuXHRcdF0sXG5cdFx0ZGVmYXVsdE5vZGVWYWx1ZToge1xuXHRcdFx0cGFyYW1ldGVyVmFsdWVzOiBbXG5cdFx0XHRcdFwiXCJcblx0XHRcdF1cblx0XHR9XG5cdH0sXG5cdCdNYXRlcmlhbFNlbGVjdG9yJzoge1xuXHRcdGNsYXNzT2JqZWN0OiBSZWxpZWZOb2RlTWF0ZXJpYWxTZWxlY3Rvcixcblx0XHRwYXJhbWV0ZXJzOiBbXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdNYXRlcmlhbHMnLFxuXHRcdFx0XHR0eXBlOiAnbm9kZWFycmF5J1xuXHRcdFx0fVxuXHRcdF0sXG5cdFx0ZGVmYXVsdE5vZGVWYWx1ZToge1xuXHRcdFx0cGFyYW1ldGVyVmFsdWVzOiBbXG5cdFx0XHRcdFsgXVxuXHRcdFx0XVxuXHRcdH1cblx0fSxcblx0J011bHRpcGxleCc6IHtcblx0XHRjbGFzc09iamVjdDogUmVsaWVmTm9kZU11bHRpcGxleCxcblx0XHRwYXJhbWV0ZXJzOiBbXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdOb2RlcycsXG5cdFx0XHRcdHR5cGU6ICdub2RlYXJyYXknXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnSW5kZXgnLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH1cblx0XHRdLFxuXHRcdGRlZmF1bHROb2RlVmFsdWU6IHtcblx0XHRcdHBhcmFtZXRlclZhbHVlczogW1xuXHRcdFx0XHRbIF0sXG5cdFx0XHRcdGdldENvbnN0YW50VmFsdWVOb2RlKCAwIClcblx0XHRcdF1cblx0XHR9XG5cdH1cblxufTtcblxuT2JqZWN0LmtleXMoIHJlbGllZk5vZGVDbGFzc2VzICkuZm9yRWFjaCggKCBjbGFzc05hbWUgKSA9PiB7XG5cblx0cmVsaWVmTm9kZUNsYXNzZXNbIGNsYXNzTmFtZSBdLmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcblx0cmVsaWVmTm9kZUNsYXNzZXNbIGNsYXNzTmFtZSBdLmRlZmF1bHROb2RlVmFsdWUuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuXG59ICk7XG5cbmV4cG9ydCB7IHJlbGllZk5vZGVDbGFzc2VzIH07XG4iLCIvKlxuTWluY2UgU2xpY2VyXG5cbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAyMSBKdWFuIEpvc2UgTHVuYSBFc3Bpbm9zYVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuU09GVFdBUkUuXG5cbiovXG5cbmltcG9ydCB7XG5cdFZlY3RvcjIsXG5cdFZlY3RvcjMsXG5cdFF1YXRlcm5pb24sXG5cdE1hdHJpeDQsXG5cdEJveDMsXG5cdFRyaWFuZ2xlLFxuXHRNZXNoLFxuXHRSYXljYXN0ZXIsXG5cdE1lc2hQaG9uZ01hdGVyaWFsLFxuXHRTcGhlcmVHZW9tZXRyeSxcblx0RG91YmxlU2lkZSxcblx0QmFja1NpZGUsXG5cdEJ1ZmZlckdlb21ldHJ5XG59IGZyb20gJ3RocmVlJztcbmltcG9ydCB7IEJ1ZmZlckdlb21ldHJ5VXRpbHMgfSBmcm9tICd0aHJlZS9leGFtcGxlcy9qc20vdXRpbHMvQnVmZmVyR2VvbWV0cnlVdGlscy5qcyc7XG5pbXBvcnQgeyBNZXNoQlZIIH0gZnJvbSAndGhyZWUtbWVzaC1idmgnO1xuaW1wb3J0IHsgU2ltcGxleE5vaXNlIH0gZnJvbSAndGhyZWUvZXhhbXBsZXMvanNtL21hdGgvU2ltcGxleE5vaXNlLmpzJztcblxuaW1wb3J0IHsgUHNldWRvUmFuZG9tR2VuZXJhdG9yLCBDYWNoZWRSYW5kb21HZW5lcmF0b3IgfSBmcm9tICcuLi91dGlscy9SYW5kb20uanMnO1xuaW1wb3J0IHsgcmVsaWVmTm9kZUNsYXNzZXMgfSBmcm9tICcuLi9ub2Rlcy9yZWxpZWZOb2RlQ2xhc3Nlcy5qcyc7XG5pbXBvcnQgeyBSZWxpZWZOb2RlIH0gZnJvbSAnLi4vbm9kZXMvUmVsaWVmTm9kZS5qcyc7XG5pbXBvcnQgeyBSZWxpZWZOb2RlQ29uc3RhbnQgfSBmcm9tICcuLi9ub2Rlcy9SZWxpZWZOb2RlQ29uc3RhbnQuanMnO1xuXG5jbGFzcyBTbGljZXIge1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXG5cdFx0dGhpcy5tZXNoID0gbnVsbDtcblx0XHR0aGlzLmJ2aCA9IG51bGw7XG5cdFx0dGhpcy5zZXR0aW5ncyA9IG51bGw7XG5cdFx0dGhpcy5yYXljYXN0ZXIgPSBuZXcgUmF5Y2FzdGVyKCBuZXcgVmVjdG9yMygpLCBuZXcgVmVjdG9yMyggMCwgMCwgMSApICk7XG5cdFx0dGhpcy5yZWxpZWZQcmVzZXQgPSBudWxsO1xuXHRcdHRoaXMucmVsaWVmTm9kZSA9IG51bGw7XG5cblx0XHQvLyBUZW1wIHZhcmlhYmxlc1xuXG5cdFx0dGhpcy52b3hlbFBvc2l0aW9uID0gbmV3IFZlY3RvcjMoKTtcblx0XHR0aGlzLmNsb3Nlc3RQb2ludCA9IG5ldyBWZWN0b3IzKCk7XG5cdFx0dGhpcy5jbG9zZXN0VVZEaXN0YW5jZSA9IG5ldyBWZWN0b3IzKCk7XG5cdFx0dGhpcy5jbG9zZXN0Tm9ybWFsID0gbmV3IFZlY3RvcjMoKTtcblx0XHR0aGlzLnV2Q29vcmRzID0gbmV3IFZlY3RvcjIoKTtcblx0XHR0aGlzLmJveDMgPSBuZXcgQm94MygpO1xuXHRcdHRoaXMubWF0cml4NElkZW50aXR5ID0gbmV3IE1hdHJpeDQoKS5pZGVudGl0eSgpO1xuXHRcdHRoaXMudmVjMzEgPSBuZXcgVmVjdG9yMygpO1xuXG5cdFx0dGhpcy5pbmRpY2VzID0gbnVsbDtcblx0XHR0aGlzLnBvc2l0aW9ucyA9IG51bGw7XG5cdFx0dGhpcy51dnMgPSBudWxsO1xuXG5cdFx0dGhpcy52QSA9IG5ldyBWZWN0b3IzKCk7XG5cdFx0dGhpcy52QiA9IG5ldyBWZWN0b3IzKCk7XG5cdFx0dGhpcy52QyA9IG5ldyBWZWN0b3IzKCk7XG5cblx0XHR0aGlzLnV2QSA9IG5ldyBWZWN0b3IyKCk7XG5cdFx0dGhpcy51dkIgPSBuZXcgVmVjdG9yMigpO1xuXHRcdHRoaXMudXZDID0gbmV3IFZlY3RvcjIoKTtcblxuXHRcdHRoaXMuZ3JvdXBzID0gbnVsbDtcblxuXHRcdHRoaXMuaW5zaWRlU29saWREaXJlY3Rpb24gPSBuZXcgVmVjdG9yMyggMS4yMzQ1Njc4OSwgMC4xMjM0NTY3ODksIDAuNTY3ODkxMjM0ICkubm9ybWFsaXplKCk7XG5cblx0fVxuXG5cdHNldHVwUHJpbnQoIGdlb21ldHJ5LCBpbWFnZXMsIHNldHRpbmdzICkge1xuXG5cdFx0dGhpcy5tZXNoID0gbmV3IE1lc2goIGdlb21ldHJ5LCBuZXcgTWVzaFBob25nTWF0ZXJpYWwoIHsgc2lkZTogRG91YmxlU2lkZSB9ICkgKTtcblxuXHRcdHRoaXMuYnZoID0gXHRuZXcgTWVzaEJWSCggZ2VvbWV0cnkgKTtcblxuXHRcdHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcblxuXHRcdGlmICggc2V0dGluZ3MucmVsaWVmRW5hYmxlZCApIHtcblxuXHRcdFx0dGhpcy5yZWxpZWZQcmVzZXQgPSB0aGlzLnNldHRpbmdzLnJlbGllZlByZXNldHNbIHRoaXMuc2V0dGluZ3MucmVsaWVmUHJlc2V0TmFtZSBdO1xuXG5cdFx0XHR0aGlzLmNvbnRleHQgPSBTbGljZXIuY3JlYXRlQ29udGV4dCggdGhpcy5yZWxpZWZQcmVzZXQgPyB0aGlzLnJlbGllZlByZXNldC5yYW5kb21TZWVkIDogMCwgaW1hZ2VzLCBzZXR0aW5ncy5yZWxpZWZQcmVzZXRzICk7XG5cblx0XHRcdGNvbnN0IHJlbGllZk5vZGVKU09OID0gdGhpcy5yZWxpZWZQcmVzZXQgPyB0aGlzLnJlbGllZlByZXNldC5yZWxpZWZOb2RlSlNPTiA6IG51bGw7XG5cblx0XHRcdHRoaXMucmVsaWVmTm9kZSA9IFJlbGllZk5vZGUubWFrZVJlbGllZlRyZWVGcm9tSlNPTiggcmVsaWVmTm9kZUpTT04sIHRoaXMuY29udGV4dCApO1xuXG5cdFx0XHRjb25zdCBlcnIgPSB0aGlzLnJlbGllZk5vZGUgPyB0aGlzLnJlbGllZk5vZGUuaXNWYWxpZCgpIDogbnVsbDtcblxuXHRcdFx0aWYgKCB0aGlzLnJlbGllZk5vZGUgKSB7XG5cblx0XHRcdFx0aWYgKCBlcnIgKSB7XG5cblx0XHRcdFx0XHRjb25zb2xlLndhcm4oIGVyciApO1xuXHRcdFx0XHRcdHRoaXMucmVsaWVmTm9kZSA9IG51bGw7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHR9XG5cdFx0ZWxzZSB7XG5cblx0XHRcdHRoaXMucmVsaWVmTm9kZSA9IG51bGw7XG5cdFx0XHR0aGlzLmNvbnRleHQgPSBudWxsO1xuXG5cdFx0fVxuXG5cdFx0aWYgKCAoIHNldHRpbmdzLmFudGlhbGlhc2luZ0xldmVsICE9PSAxICkgJiYgKCAhIHRoaXMucmVsaWVmTm9kZSApICkge1xuXG5cdFx0XHQvLyBGb3JjZSByZW5kZXJpbmcgd2l0aCBub2RlcyBpZiBhbnRpYWxpYXNpbmcgaXMgc2V0XG5cblx0XHRcdGlmICggISB0aGlzLmNvbnRleHQgKSB7XG5cblx0XHRcdFx0dGhpcy5jb250ZXh0ID0gU2xpY2VyLmNyZWF0ZUNvbnRleHQoIDAsIGltYWdlcywgc2V0dGluZ3MucmVsaWVmUHJlc2V0cyApO1xuXHJcdFx0XHR9XG5cblx0XHRcdHRoaXMucmVsaWVmTm9kZSA9IG5ldyBSZWxpZWZOb2RlQ29uc3RhbnQoXG5cdFx0XHRcdFwiXCIsXG5cdFx0XHRcdHJlbGllZk5vZGVDbGFzc2VzWyBcIkNvbnN0YW50XCIgXS5wYXJhbWV0ZXJzLFxuXHRcdFx0XHRbIDAgXSxcblx0XHRcdFx0dGhpcy5jb250ZXh0XG5cdFx0XHQpO1xuXG5cdFx0fVxuXG5cdFx0aWYgKCB0aGlzLnJlbGllZk5vZGUgKSB7XG5cblx0XHRcdHRoaXMuaW5kaWNlcyA9IHRoaXMuYnZoLmdlb21ldHJ5LmdldEluZGV4KCkuYXJyYXk7XG5cdFx0XHR0aGlzLnBvc2l0aW9ucyA9IHRoaXMuYnZoLmdlb21ldHJ5LmdldEF0dHJpYnV0ZSggJ3Bvc2l0aW9uJyApO1xuXHRcdFx0dGhpcy51dnMgPSB0aGlzLmJ2aC5nZW9tZXRyeS5nZXRBdHRyaWJ1dGUoICd1dicgKTtcblx0XHRcdHRoaXMuZ3JvdXBzID0gdGhpcy5idmguZ2VvbWV0cnkuZ3JvdXBzO1xuXG5cdFx0fVxuXG5cdH1cblxuXHRzdGF0aWMgY3JlYXRlQ29udGV4dCggcmFuZG9tU2VlZCwgaW1hZ2VzLCBwcmVzZXRzICkge1xuXG5cdFx0Y29uc3QgcHJuZyA9IG5ldyBQc2V1ZG9SYW5kb21HZW5lcmF0b3IoKTtcblx0XHRjb25zdCBjYWNoZWRQcm5nID0gbmV3IENhY2hlZFJhbmRvbUdlbmVyYXRvciggMjAwMDAwMCwgcHJuZywgcmFuZG9tU2VlZCApO1xuXHRcdGNvbnN0IHNpbXBsZXggPSBuZXcgU2ltcGxleE5vaXNlKCBjYWNoZWRQcm5nICk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cHJuZzogY2FjaGVkUHJuZyxcblx0XHRcdHNpbXBsZXg6IHNpbXBsZXgsXG5cdFx0XHRpbWFnZXM6IGltYWdlcyxcblx0XHRcdHByZXNldHM6IHByZXNldHNcblx0XHR9O1xuXHJcdH1cblxuXHRzbGljZUxheWVyKCBsYXllckluZGV4LCBpbWFnZSApIHtcblxuXHRcdGlmICggdGhpcy5yZWxpZWZOb2RlICkge1xuXG5cdFx0XHR0aGlzLnNsaWNlTGF5ZXJXaXRoRGlzdGFuY2UoIGxheWVySW5kZXgsIGltYWdlICk7XG5cblx0XHR9XG5cdFx0ZWxzZSB7XG5cblx0XHRcdHRoaXMuc2xpY2VMYXllclJheWNhc3RpbmcoIGxheWVySW5kZXgsIGltYWdlICk7XG5cblx0XHR9XG5cblx0fVxuXG5cdHNsaWNlTGF5ZXJSYXljYXN0aW5nKCBsYXllckluZGV4LCBpbWFnZSApIHtcblxuXHRcdC8vIFJheWNhc3QgbGF5ZXIgc2VjdGlvbiAobm8gYW50aWFsaWFzaW5nKVxuXG5cdFx0Lypcblx0XHRcdEJld2FyZSBkaWZmZXJlbnQgY29vcmRpbmF0ZSBzeXN0ZW0gYXhpczpcblx0XHRcdFggaW4gbWFjaGluZSBpcyBaIGluIFRocmVlLmpzXG5cdFx0XHRZIGluIG1hY2hpbmUgaXMgWCBpbiBUaHJlZS5qc1xuXHRcdFx0WiBpbiBtYWNoaW5lIGlzIFkgaW4gVGhyZWUuanNcblx0XHQqL1xuXHRcdGNvbnN0IGxheWVySGVpZ2h0ID0gdGhpcy5zZXR0aW5ncy5sYXllckhlaWdodDtcblx0XHRjb25zdCBpbml0aWFsUmF5WiA9IHRoaXMuc2V0dGluZ3MubWFjaGluZVggKiAwLjUgKyB0aGlzLnNldHRpbmdzLm1heERpc3RhbmNlO1xuXHRcdGNvbnN0IHJlc29sdXRpb25YID0gdGhpcy5zZXR0aW5ncy5yZXNvbHV0aW9uWTtcblx0XHRjb25zdCByZXNvbHV0aW9uWiA9IHRoaXMuc2V0dGluZ3MucmVzb2x1dGlvblg7XG5cdFx0Y29uc3Qgdm94ZWxYU2l6ZSA9IHRoaXMuc2V0dGluZ3MubWFjaGluZVkgLyByZXNvbHV0aW9uWDtcblx0XHRjb25zdCB2b3hlbFpTaXplID0gdGhpcy5zZXR0aW5ncy5tYWNoaW5lWCAvIHJlc29sdXRpb25aO1xuXHRcdGNvbnN0IGluaXRpYWxMYXllclJheVggPSB0aGlzLnNldHRpbmdzLm1hY2hpbmVZICogMC41IC0gdm94ZWxYU2l6ZSAqIDAuNTtcblx0XHRjb25zdCBwaXhlbE9mZnNldCA9IHRoaXMuc2V0dGluZ3MubWFjaGluZVggKiAwLjU7XG5cblx0XHRjb25zdCBtZXNoID0gdGhpcy5tZXNoO1xuXHRcdGNvbnN0IHJheWNhc3RlciA9IHRoaXMucmF5Y2FzdGVyO1xuXHRcdGNvbnN0IHJheSA9IHJheWNhc3Rlci5yYXk7XG5cdFx0Y29uc3QgYnZoID0gdGhpcy5idmg7XG5cblx0XHRyYXkuZGlyZWN0aW9uLnNldCggMCwgMCwgLSAxICk7XG5cblx0XHQvLyBDbGVhciBpbWFnZVxuXHRcdGltYWdlLmZpbGwoIDAgKTtcblxuXHRcdC8vIENhc3QgcmF5cyBhY3Jvc3MgdGhlIGxheWVyXG5cdFx0Zm9yICggbGV0IGxheWVyUmF5SW5kZXggPSAwOyBsYXllclJheUluZGV4IDwgcmVzb2x1dGlvblg7IGxheWVyUmF5SW5kZXggKysgKSB7XG5cblx0XHRcdGxldCB4ID0gaW5pdGlhbExheWVyUmF5WCAtIGxheWVyUmF5SW5kZXggKiB2b3hlbFhTaXplO1xuXHRcdFx0cmF5Lm9yaWdpbi5zZXQoIHgsIGxheWVySGVpZ2h0ICogKCBsYXllckluZGV4ICsgMC41ICksIGluaXRpYWxSYXlaICk7XG5cblx0XHRcdGNvbnN0IGludGVyc2VjdGlvbnMgPSBbIF07XG5cdFx0XHRidmgucmF5Y2FzdCggbWVzaCwgcmF5Y2FzdGVyLCByYXksIGludGVyc2VjdGlvbnMgKTtcblxuXHRcdFx0Ly8gaW50ZXJzZWN0c1sgaSBdLiBkaXN0YW5jZSBwb2ludCB1diBmYWNlLm5vcm1hbFxuXG5cdFx0XHRpbnRlcnNlY3Rpb25zLnNvcnQoICggYSwgYiApID0+IHtcblx0XHRcdFx0aWYgKCBhLmRpc3RhbmNlID09PSBiLmRpc3RhbmNlICkgcmV0dXJuIDA7XG5cdFx0XHRcdHJldHVybiBhLmRpc3RhbmNlIDwgYi5kaXN0YW5jZSA/IC0gMSA6IDE7XG5cdFx0XHR9ICk7XG5cblx0XHRcdGNvbnN0IGZpcnN0UGl4ZWxJbmRleCA9IGxheWVyUmF5SW5kZXggKiByZXNvbHV0aW9uWjtcblxuXHRcdFx0Ly8gU2V0IHBpeGVscyB3aGljaCBhcmUgaW5zaWRlIHRoZSBzb2xpZHNcblx0XHRcdGNvbnN0IG51bUludGVyc2VjdGlvbnMgPSBpbnRlcnNlY3Rpb25zLmxlbmd0aDtcblx0XHRcdGxldCBpbnRlcnNlY3Rpb25JbmRleDAgPSAwO1xuXHRcdFx0d2hpbGUgKCBpbnRlcnNlY3Rpb25JbmRleDAgPCBudW1JbnRlcnNlY3Rpb25zICkge1xuXG5cdFx0XHRcdC8vIEZpbmQgZnJvbnQtZmFjaW5nIGludGVyc2VjdGlvblxuXHRcdFx0XHRsZXQgaW50ZXJzZWN0aW9uMDtcblx0XHRcdFx0d2hpbGUgKCBpbnRlcnNlY3Rpb25JbmRleDAgPCBudW1JbnRlcnNlY3Rpb25zICkge1xuXG5cdFx0XHRcdFx0aW50ZXJzZWN0aW9uMCA9IGludGVyc2VjdGlvbnNbIGludGVyc2VjdGlvbkluZGV4MCBdO1xuXG5cdFx0XHRcdFx0Ly9jb25zdCBpc0Zyb250RmFjaW5nID0gaW50ZXJzZWN0aW9uMC5mYWNlLm5vcm1hbC54IDwgMDtcblx0XHRcdFx0XHRjb25zdCBpc0Zyb250RmFjaW5nID0gaW50ZXJzZWN0aW9uMC5mYWNlLm5vcm1hbC5kb3QoIHJheS5kaXJlY3Rpb24gKSA8IDA7XG5cblx0XHRcdFx0XHQvLyBGb3VuZCBpdFxuXHRcdFx0XHRcdGlmICggaXNGcm9udEZhY2luZyApIGJyZWFrO1xuXG5cdFx0XHRcdFx0aW50ZXJzZWN0aW9uSW5kZXgwICsrO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIGludGVyc2VjdGlvbkluZGV4MCA+PSBudW1JbnRlcnNlY3Rpb25zICkgYnJlYWs7XG5cblx0XHRcdFx0Ly8gRmluZCBiYWNrLWZhY2luZyBpbnRlcnNlY3Rpb24gYWZ0ZXIgdGhlIHJheSBoYXMgbGVmdCBhbGwgY29udGFpbmVkIHNvbGlkcyBiZWhpbmQuXG5cdFx0XHRcdGxldCBudW1Tb2xpZHNJbnNpZGUgPSAwO1xuXHRcdFx0XHRsZXQgaW50ZXJzZWN0aW9uSW5kZXgxID0gaW50ZXJzZWN0aW9uSW5kZXgwICsgMTtcblx0XHRcdFx0bGV0IGludGVyc2VjdGlvbjE7XG5cdFx0XHRcdHdoaWxlICggaW50ZXJzZWN0aW9uSW5kZXgxIDwgbnVtSW50ZXJzZWN0aW9ucyApIHtcblxuXHRcdFx0XHRcdGludGVyc2VjdGlvbjEgPSBpbnRlcnNlY3Rpb25zWyBpbnRlcnNlY3Rpb25JbmRleDEgXTtcblxuXHRcdFx0XHRcdC8vY29uc3QgaXNGcm9udEZhY2luZyA9IGludGVyc2VjdGlvbjEuZmFjZS5ub3JtYWwueCA8IDA7XG5cdFx0XHRcdFx0Y29uc3QgaXNGcm9udEZhY2luZyA9IGludGVyc2VjdGlvbjEuZmFjZS5ub3JtYWwuZG90KCByYXkuZGlyZWN0aW9uICkgPCAwO1xuXG5cdFx0XHRcdFx0aWYgKCAhIGlzRnJvbnRGYWNpbmcgKSB7XG5cblx0XHRcdFx0XHRcdGlmICggbnVtU29saWRzSW5zaWRlID09PSAwICkge1xuXHRcdFx0XHRcdFx0XHQvLyBGb3VuZCBpdFxuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0bnVtU29saWRzSW5zaWRlIC0tO1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgbnVtU29saWRzSW5zaWRlICsrO1xuXG5cdFx0XHRcdFx0aW50ZXJzZWN0aW9uSW5kZXgxICsrO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIGludGVyc2VjdGlvbkluZGV4MSA+PSBudW1JbnRlcnNlY3Rpb25zICkgYnJlYWs7XG5cblx0XHRcdFx0dmFyIG1pblhJbmRleCA9IE1hdGgubWF4KCAwLCBNYXRoLm1pbiggcmVzb2x1dGlvblogLSAxLCBNYXRoLnJvdW5kKCAoIC0gaW50ZXJzZWN0aW9uMC5wb2ludC56ICsgcGl4ZWxPZmZzZXQgKSAvIHZveGVsWlNpemUgKSApICk7XG5cdFx0XHRcdHZhciBtYXhYSW5kZXggPSBNYXRoLm1heCggMCwgTWF0aC5taW4oIHJlc29sdXRpb25aIC0gMSwgTWF0aC5mbG9vciggKCAtIGludGVyc2VjdGlvbjEucG9pbnQueiArIHBpeGVsT2Zmc2V0ICkgLyB2b3hlbFpTaXplICkgKSApO1xuXG5cdFx0XHRcdGltYWdlLmZpbGwoIDI1NSwgZmlyc3RQaXhlbEluZGV4ICsgbWluWEluZGV4LCBmaXJzdFBpeGVsSW5kZXggKyBtYXhYSW5kZXggKTtcblxuXHRcdFx0XHRpbnRlcnNlY3Rpb25JbmRleDAgPSBpbnRlcnNlY3Rpb25JbmRleDEgKyAxO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fVxuXG5cdHN0YXRpYyBpc0Zyb250RmFjaW5nSW50ZXJzZWN0aW9uKCBpbnRlcnNlY3Rpb24sIGRpcmVjdGlvbiApIHtcblxuXHRcdHJldHVybiBpbnRlcnNlY3Rpb24uZmFjZS5ub3JtYWwuZG90KCBkaXJlY3Rpb24gKSA8IDA7XG5cblx0fVxuXG5cdHNsaWNlTGF5ZXJXaXRoRGlzdGFuY2UoIGxheWVySW5kZXgsIGltYWdlICkge1xuXG5cdFx0Y29uc3Qgc2NvcGUgPSB0aGlzO1xuXG5cdFx0Ly8gUmF5Y2FzdCBsYXllciBzZWN0aW9uIGJ5IGNvbXB1dGluZyBkaXN0YW5jZSB0byBzdXJmYWNlLCB0YWtpbmcgaW50byBhY2NvdW50IHJlbGllZi9lbWJvc3MgdGV4dHVyZVxuXG5cdFx0Lypcblx0XHRcdEJld2FyZSBkaWZmZXJlbnQgY29vcmRpbmF0ZSBzeXN0ZW0gYXhpczpcblx0XHRcdFggaW4gbWFjaGluZSBpcyBaIGluIFRocmVlLmpzXG5cdFx0XHRZIGluIG1hY2hpbmUgaXMgWCBpbiBUaHJlZS5qc1xuXHRcdFx0WiBpbiBtYWNoaW5lIGlzIFkgaW4gVGhyZWUuanNcblx0XHQqL1xuXHRcdGNvbnN0IGxheWVySGVpZ2h0ID0gdGhpcy5zZXR0aW5ncy5sYXllckhlaWdodDtcblx0XHRjb25zdCByZXNvbHV0aW9uWCA9IHRoaXMuc2V0dGluZ3MucmVzb2x1dGlvblk7XG5cdFx0Y29uc3QgcmVzb2x1dGlvblogPSB0aGlzLnNldHRpbmdzLnJlc29sdXRpb25YO1xuXHRcdGNvbnN0IHZveGVsWFNpemUgPSB0aGlzLnNldHRpbmdzLm1hY2hpbmVZIC8gcmVzb2x1dGlvblg7XG5cdFx0Y29uc3Qgdm94ZWxaU2l6ZSA9IHRoaXMuc2V0dGluZ3MubWFjaGluZVggLyByZXNvbHV0aW9uWjtcblx0XHRjb25zdCB5ID0gbGF5ZXJIZWlnaHQgKiBsYXllckluZGV4O1xuXHRcdGNvbnN0IHBpeGVsT2Zmc2V0WCA9IHRoaXMuc2V0dGluZ3MubWFjaGluZVkgKiAwLjU7XG5cdFx0Y29uc3QgcGl4ZWxPZmZzZXRaID0gdGhpcy5zZXR0aW5ncy5tYWNoaW5lWCAqIDAuNTtcblx0XHRjb25zdCBhbnRpYWxpYXNpbmcgPSBNYXRoLmZsb29yKCB0aGlzLnNldHRpbmdzLmFudGlhbGlhc2luZ0xldmVsICk7XG5cblx0XHRjb25zdCBtZXNoID0gdGhpcy5tZXNoO1xuXHRcdGNvbnN0IHJheWNhc3RlciA9IHRoaXMucmF5Y2FzdGVyO1xuXHRcdGNvbnN0IHJheSA9IHRoaXMucmF5Y2FzdGVyLnJheTtcblx0XHRjb25zdCBidmggPSB0aGlzLmJ2aDtcblx0XHRjb25zdCBib3gzID0gdGhpcy5ib3gzO1xuXHRcdGNvbnN0IG1hdHJpeDRJZGVudGl0eSA9IHRoaXMubWF0cml4NElkZW50aXR5O1xuXHRcdGNvbnN0IHV2Q29vcmRzID0gdGhpcy51dkNvb3Jkcztcblx0XHRjb25zdCB2b3hlbFBvc2l0aW9uID0gdGhpcy52b3hlbFBvc2l0aW9uO1xuXHRcdGNvbnN0IGNsb3Nlc3RQb2ludCA9IHRoaXMuY2xvc2VzdFBvaW50O1xuXHRcdGNvbnN0IGNsb3Nlc3RVVkRpc3RhbmNlID0gdGhpcy5jbG9zZXN0VVZEaXN0YW5jZTtcblx0XHRjb25zdCBjbG9zZXN0Tm9ybWFsID0gdGhpcy5jbG9zZXN0Tm9ybWFsO1xuXG5cdFx0dGhpcy5jb250ZXh0LnBybmcuc2V0U2VlZCggMCApO1xuXG5cdFx0Y29uc3QgcmVsaWVmTm9kZSA9IHRoaXMucmVsaWVmTm9kZTtcblx0XHRjb25zdCByZWxpZWZNYXhTaXplID0gdGhpcy5yZWxpZWZQcmVzZXQgPyB0aGlzLnJlbGllZlByZXNldC5tYXhIZWlnaHQgOiAwO1xuXG5cdFx0Y29uc3Qgc3Vidm94ZWxDb250cmlidXRpb24gPSAyNTYgLyBNYXRoLnBvdyggYW50aWFsaWFzaW5nLCAzICk7XG5cblx0XHRjb25zdCBhbnRpYWxpYXNpbmdWb3hlbFNpemVGYWN0b3IgPSBhbnRpYWxpYXNpbmcgPT09IDEgPyAxIDogMSArIGFudGlhbGlhc2luZyAqIDAuMjtcblx0XHRjb25zdCBhbnRpYWxpYXNpbmdWb3hlbFNpemVYID0gYW50aWFsaWFzaW5nVm94ZWxTaXplRmFjdG9yICogdm94ZWxYU2l6ZTtcblx0XHRjb25zdCBhbnRpYWxpYXNpbmdWb3hlbFNpemVaID0gYW50aWFsaWFzaW5nVm94ZWxTaXplRmFjdG9yICogdm94ZWxaU2l6ZTtcblx0XHRjb25zdCBhbnRpYWxpYXNpbmdWb3hlbFNpemVZID0gYW50aWFsaWFzaW5nVm94ZWxTaXplRmFjdG9yICogbGF5ZXJIZWlnaHQ7XG5cdFx0Y29uc3Qgc3ViUG9zWEluYyA9IGFudGlhbGlhc2luZ1ZveGVsU2l6ZVggLyBhbnRpYWxpYXNpbmc7XG5cdFx0Y29uc3Qgc3ViUG9zWkluYyA9IGFudGlhbGlhc2luZ1ZveGVsU2l6ZVogLyBhbnRpYWxpYXNpbmc7XG5cdFx0Y29uc3Qgc3ViUG9zWUluYyA9IGFudGlhbGlhc2luZ1ZveGVsU2l6ZVkgLyBhbnRpYWxpYXNpbmc7XG5cdFx0Y29uc3Qgc3ViUG9zWE9mZnNldCA9IDAuNSAqIHZveGVsWFNpemUgLSBhbnRpYWxpYXNpbmdWb3hlbFNpemVYICogMC41ICsgMC41ICogc3ViUG9zWEluYztcblx0XHRjb25zdCBzdWJQb3NaT2Zmc2V0ID0gMC41ICogdm94ZWxaU2l6ZSAtIGFudGlhbGlhc2luZ1ZveGVsU2l6ZVogKiAwLjUgKyAwLjUgKiBzdWJQb3NaSW5jO1xuXHRcdGNvbnN0IHN1YlBvc1lPZmZzZXQgPSAwLjUgKiBsYXllckhlaWdodCAtIGFudGlhbGlhc2luZ1ZveGVsU2l6ZVkgKiAwLjUgKyAwLjUgKiBzdWJQb3NZSW5jO1xuXG5cdFx0Ly8gQ2xlYXIgaW1hZ2Vcblx0XHRpbWFnZS5maWxsKCAwICk7XG5cblx0XHRmdW5jdGlvbiBpc1BvaW50SW5zaWRlTWVzaCggcG9pbnQgKSB7XG5cblx0XHRcdGNvbnN0IGludGVyc2VjdGlvbnMgPSBbIF07XG5cblx0XHRcdHJheS5vcmlnaW4uY29weSggcG9pbnQgKTtcblx0XHRcdHJheS5kaXJlY3Rpb24uY29weSggc2NvcGUuaW5zaWRlU29saWREaXJlY3Rpb24gKTtcblxuXHRcdFx0YnZoLnJheWNhc3QoIG1lc2gsIHJheWNhc3RlciwgcmF5LCBpbnRlcnNlY3Rpb25zICk7XG5cblx0XHRcdGludGVyc2VjdGlvbnMuc29ydCggKCBhLCBiICkgPT4ge1xuXHRcdFx0XHRpZiAoIGEuZGlzdGFuY2UgPT09IGIuZGlzdGFuY2UgKSByZXR1cm4gMDtcblx0XHRcdFx0cmV0dXJuIGEuZGlzdGFuY2UgPCBiLmRpc3RhbmNlID8gLSAxIDogMTtcblx0XHRcdH0gKTtcblxuXHRcdFx0bGV0IG51bVNvbGlkcyA9IDA7XG5cdFx0XHRmb3IgKCBsZXQgaSA9IDAsIGlsID0gaW50ZXJzZWN0aW9ucy5sZW5ndGg7IGkgPCBpbDsgaSArKyApIHtcblxuXHRcdFx0XHRjb25zdCBpc0Zyb250RmFjaW5nID0gaW50ZXJzZWN0aW9uc1sgaSBdLmZhY2Uubm9ybWFsLmRvdCggcmF5LmRpcmVjdGlvbiApIDwgMDtcblxuXHRcdFx0XHRudW1Tb2xpZHMgKz0gaXNGcm9udEZhY2luZyA/IDEgOiAtIDE7XG5cclx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG51bVNvbGlkcyA8IDA7XG5cclx0XHR9XG5cblx0XHRmdW5jdGlvbiBsYXllckRpc3RhbmNlUmVjdXJzaXZlKCBpMCwgajAsIGkxLCBqMSApIHtcblxuXHRcdFx0Ly8gRmlsbCBpbWFnZSByZWN1cnNpdmVseSBpbiBxdWFkLXBhcnRpdGlvbmVkIGJveGVzIGFuZCB1c2luZyBkaXN0YW5jZSB0byBzdXJmYWNlLlxuXG5cdFx0XHRpZiAoIGkxIDwgaTAgfHwgajEgPCBqMCApIHJldHVybjtcblxuXHRcdFx0Y29uc3QgZGkgPSBpMSAtIGkwICsgMTtcblx0XHRcdGNvbnN0IGRqID0gajEgLSBqMCArIDE7XG5cblx0XHRcdC8vIExlYWYgY29uZGl0aW9uXG5cdFx0XHRjb25zdCBsZWFmU2l6ZVZveGVscyA9IDEwO1xuXHRcdFx0aWYgKCBkaSA8PSBsZWFmU2l6ZVZveGVscyB8fCBkaiA8PSBsZWFmU2l6ZVZveGVscyApIHtcblxuXHRcdFx0XHRmb3IgKCBsZXQgbSA9IDA7IG0gPCBkaTsgbSArKyApIHtcblxuXHRcdFx0XHRcdGZvciAoIGxldCBuID0gMDsgbiA8IGRqOyBuICsrICkge1xuXG5cdFx0XHRcdFx0XHRsZXQgY3VycmVudFZveGVsQ29udHJpYnV0aW9uID0gMDtcblxuXHRcdFx0XHRcdFx0bGV0IHZQb3NZID0gc3ViUG9zWU9mZnNldDtcblxuXHRcdFx0XHRcdFx0Zm9yICggbGV0IHZrID0gMDsgdmsgPCBhbnRpYWxpYXNpbmc7IHZrICsrICkge1xuXG5cdFx0XHRcdFx0XHRcdGxldCB2UG9zWCA9IHN1YlBvc1hPZmZzZXQ7XG5cblx0XHRcdFx0XHRcdFx0Zm9yICggbGV0IHZqID0gMDsgdmogPCBhbnRpYWxpYXNpbmc7IHZqICsrICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0bGV0IHZQb3NaID0gc3ViUG9zWk9mZnNldDtcblxuXHRcdFx0XHRcdFx0XHRcdGZvciAoIGxldCB2aSA9IDA7IHZpIDwgYW50aWFsaWFzaW5nOyB2aSArKyApIHtcblxuXHRcdFx0XHRcdFx0XHRcdFx0c2NvcGUudm94ZWxQb3NpdGlvbi5zZXQoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC0gKCBpMCArIG0gKSAqIHZveGVsWFNpemUgKyBwaXhlbE9mZnNldFggLSB2UG9zWCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0eSArIHZQb3NZLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHQoIGowICsgbiApICogdm94ZWxaU2l6ZSAtIHBpeGVsT2Zmc2V0WiArIHZQb3NaXG5cdFx0XHRcdFx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBSZWxpZWYgY29tcHV0YXRpb25cblxuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgbWF0ZXJpYWxJbmRleCA9IHNjb3BlLmNsb3Nlc3RQb2ludFRvTWVzaCggdm94ZWxQb3NpdGlvbiwgY2xvc2VzdFBvaW50LCBjbG9zZXN0VVZEaXN0YW5jZSwgY2xvc2VzdE5vcm1hbCApO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBpc0luc2lkZSA9IGlzUG9pbnRJbnNpZGVNZXNoKCBzY29wZS52b3hlbFBvc2l0aW9uICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBkaXN0YW5jZSA9IGNsb3Nlc3RVVkRpc3RhbmNlLnogKiAoIGlzSW5zaWRlID8gLSAxIDogMSApO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHR1dkNvb3Jkcy5jb3B5KCBjbG9zZXN0VVZEaXN0YW5jZSApO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgbm9kZVZhbHVlID0gcmVsaWVmTm9kZS5ldmFsdWF0ZSggdXZDb29yZHMsIHZveGVsUG9zaXRpb24sIGNsb3Nlc3ROb3JtYWwsIG1hdGVyaWFsSW5kZXggKTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmICggaXNOYU4oIG5vZGVWYWx1ZSApICkgbm9kZVZhbHVlID0gMDtcblxuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgaGVpZ2h0ID0gTWF0aC5tYXgoIC0gMSwgTWF0aC5taW4oIDEsIG5vZGVWYWx1ZSApICkgKiByZWxpZWZNYXhTaXplO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIGRpc3RhbmNlIDw9IGhlaWdodCApIHtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBTdWJ2b3hlbCBpcyB1bmRlciB0aGUgcmVsaWVmIHN1cmZhY2UgYW5kIGhlbmNlIGlzIHNvbGlkXG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudFZveGVsQ29udHJpYnV0aW9uICs9IHN1YnZveGVsQ29udHJpYnV0aW9uO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRcdHZQb3NaICs9IHN1YlBvc1pJbmM7XG5cblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHR2UG9zWCArPSBzdWJQb3NYSW5jO1xuXG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHR2UG9zWSArPSBzdWJQb3NZSW5jO1xuXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmICggY3VycmVudFZveGVsQ29udHJpYnV0aW9uID4gMCApIHtcblxuXHRcdFx0XHRcdFx0XHQvL2ltYWdlWyAoIGkwICsgbSApICogcmVzb2x1dGlvblogKyAoIG4gKyBqMCApIF0gPSBNYXRoLm1pbiggMjU1LCBjdXJyZW50Vm94ZWxDb250cmlidXRpb24gKTtcblx0XHRcdFx0XHRcdFx0aW1hZ2VbICggaTAgKyBtICkgKiByZXNvbHV0aW9uWiArICggcmVzb2x1dGlvblogLSAoIG4gKyBqMCApIC0gMSApIF0gPSBNYXRoLm1pbiggMjU1LCBjdXJyZW50Vm94ZWxDb250cmlidXRpb24gKTtcblxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cblx0XHRcdFx0Y29uc3QgaUhhbGYgPSBNYXRoLmZsb29yKCAoIGkwICsgaTEgKSAqIDAuNSApO1xuXHRcdFx0XHRjb25zdCBqSGFsZiA9IE1hdGguZmxvb3IoICggajAgKyBqMSApICogMC41ICk7XG5cblx0XHRcdFx0Ly8gQ2hlY2sgaWYgYm94IGNvbGxpZGVzIHdpdGggbWVzaFxuXG5cdFx0XHRcdGJveDMubWluLnNldCggLSAoIGkxICsgMSApICogdm94ZWxYU2l6ZSArIHBpeGVsT2Zmc2V0WCAtIHJlbGllZk1heFNpemUsIHkgLSByZWxpZWZNYXhTaXplLCBqMCAqIHZveGVsWlNpemUgLSBwaXhlbE9mZnNldFogLSByZWxpZWZNYXhTaXplICk7XG5cdFx0XHRcdGJveDMubWF4LnNldCggLSAoIGkwICkgKiB2b3hlbFhTaXplICsgcGl4ZWxPZmZzZXRYICsgcmVsaWVmTWF4U2l6ZSwgeSArIHJlbGllZk1heFNpemUsICggajEgKyAxICkgKiB2b3hlbFpTaXplIC0gcGl4ZWxPZmZzZXRaICsgcmVsaWVmTWF4U2l6ZSApO1xuXHRcdFx0XHRpZiAoIGJ2aC5pbnRlcnNlY3RzQm94KCBudWxsLCBib3gzLCBtYXRyaXg0SWRlbnRpdHkgKSApIHtcblxuXHRcdFx0XHRcdC8vIFN1YmRpdmlzaW9uIG9mIGJveCBpbiA0IHNtYWxsZXIgYm94ZXNcblxuXHRcdFx0XHRcdGxheWVyRGlzdGFuY2VSZWN1cnNpdmUoIGkwLCBqMCwgaUhhbGYsIGpIYWxmICk7XG5cdFx0XHRcdFx0bGF5ZXJEaXN0YW5jZVJlY3Vyc2l2ZSggaTAsIGpIYWxmICsgMSwgaUhhbGYsIGoxICk7XG5cdFx0XHRcdFx0bGF5ZXJEaXN0YW5jZVJlY3Vyc2l2ZSggaUhhbGYgKyAxLCBqMCwgaTEsIGpIYWxmICk7XG5cdFx0XHRcdFx0bGF5ZXJEaXN0YW5jZVJlY3Vyc2l2ZSggaUhhbGYgKyAxLCBqSGFsZiArIDEsIGkxLCBqMSApO1xuXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cblx0XHRcdFx0XHQvLyBCb3ggZG9lcyBub3QgaW50ZXJzZWN0LiBJZiBpbnNpZGUgdGhlIG1lc2gsIGZpbGwgdGhlIGJveCBlbnRpcmVseS5cblxuXHRcdFx0XHRcdGJveDMuZ2V0Q2VudGVyKCBzY29wZS52b3hlbFBvc2l0aW9uICk7XG5cdFx0XHRcdFx0aWYgKCBpc1BvaW50SW5zaWRlTWVzaCggc2NvcGUudm94ZWxQb3NpdGlvbiApICkge1xuXG5cdFx0XHRcdFx0XHRmb3IgKCBsZXQgbSA9IDA7IG0gPCBkaTsgbSArKyApIHtcblxuXHRcdFx0XHRcdFx0XHRmb3IgKCBsZXQgbiA9IDA7IG4gPCBkajsgbiArKyApIHtcblxuXHRcdFx0XHRcdFx0XHRcdC8vaW1hZ2VbICggaTAgKyBtICkgKiByZXNvbHV0aW9uWiArICggbiArIGowICkgXSA9IDI1NTtcblx0XHRcdFx0XHRcdFx0XHRpbWFnZVsgKCBpMCArIG0gKSAqIHJlc29sdXRpb25aICsgKCByZXNvbHV0aW9uWiAtICggbiArIGowICkgLSAxICkgXSA9IDI1NTtcblxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXG5cdFx0bGF5ZXJEaXN0YW5jZVJlY3Vyc2l2ZSggMCwgMCwgcmVzb2x1dGlvblggLSAxLCByZXNvbHV0aW9uWiAtIDEgKTtcblxuXHR9XG5cblx0Y2xvc2VzdFBvaW50VG9NZXNoKCBwb2ludCwgdGFyZ2V0UG9zLCB0YXJnZXRVVkRpc3RhbmNlLCB0YXJnZXROb3JtYWwsIHRhcmdldCApIHtcblxuXHRcdC8vIGVhcmx5IG91dCBpZiB1bmRlciBtaW5UaHJlc2hvbGRcblx0XHQvLyBza2lwIGNoZWNraW5nIGlmIG92ZXIgbWF4VGhyZXNob2xkXG5cdFx0Ly8gc2V0IG1pblRocmVzaG9sZCA9IG1heFRocmVzaG9sZCB0byBxdWlja2x5IGNoZWNrIGlmIGEgcG9pbnQgaXMgd2l0aGluIGEgdGhyZXNob2xkXG5cdFx0Ly8gcmV0dXJucyBJbmZpbml0eSBpZiBubyB2YWx1ZSBmb3VuZFxuXHRcdGNvbnN0IG1pblRocmVzaG9sZFNxID0gMDtcblx0XHRjb25zdCBtYXhUaHJlc2hvbGRTcSA9IEluZmluaXR5O1xuXHRcdGxldCBjbG9zZXN0RGlzdGFuY2VTcSA9IEluZmluaXR5O1xuXHRcdGxldCBjbG9zZXN0RGlzdGFuY2VUcmlhbmdsZUluZGV4ID0gbnVsbDtcblxuXHRcdGNvbnN0IHRlbXAgPSB0aGlzLnZlYzMxO1xuXG5cdFx0dGhpcy5idmguc2hhcGVjYXN0KFxuXHRcdFx0dGhpcy5tZXNoLFxuXHRcdFx0e1xuXG5cdFx0XHRcdGJvdW5kc1RyYXZlcnNlT3JkZXI6ICggYm94ICkgPT4ge1xuXG5cdFx0XHRcdFx0dGVtcC5jb3B5KCBwb2ludCApLmNsYW1wKCBib3gubWluLCBib3gubWF4ICk7XG5cdFx0XHRcdFx0cmV0dXJuIHRlbXAuZGlzdGFuY2VUb1NxdWFyZWQoIHBvaW50ICk7XG5cblx0XHRcdFx0fSxcblxuXHRcdFx0XHRpbnRlcnNlY3RzQm91bmRzOiAoIGJveCwgaXNMZWFmLCBzY29yZSApID0+IHtcblxuXHRcdFx0XHRcdHJldHVybiBzY29yZSA8IGNsb3Nlc3REaXN0YW5jZVNxICYmIHNjb3JlIDwgbWF4VGhyZXNob2xkU3E7XG5cblx0XHRcdFx0fSxcblxuXHRcdFx0XHRpbnRlcnNlY3RzVHJpYW5nbGU6ICggdHJpLCB0cmlJbmRleCApID0+IHtcblxuXHRcdFx0XHRcdHRyaS5jbG9zZXN0UG9pbnRUb1BvaW50KCBwb2ludCwgdGVtcCApO1xuXHRcdFx0XHRcdGNvbnN0IGRpc3RTcSA9IHBvaW50LmRpc3RhbmNlVG9TcXVhcmVkKCB0ZW1wICk7XG5cdFx0XHRcdFx0aWYgKCBkaXN0U3EgPCBjbG9zZXN0RGlzdGFuY2VTcSApIHtcblxuXHRcdFx0XHRcdFx0dGFyZ2V0UG9zLmNvcHkoIHRlbXAgKTtcblxuXHRcdFx0XHRcdFx0Y2xvc2VzdERpc3RhbmNlU3EgPSBkaXN0U3E7XG5cdFx0XHRcdFx0XHRjbG9zZXN0RGlzdGFuY2VUcmlhbmdsZUluZGV4ID0gdHJpSW5kZXg7XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIGRpc3RTcSA8IG1pblRocmVzaG9sZFNxICkge1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9LFxuXG5cdFx0XHR9XG5cblx0XHQpO1xuXG5cdFx0Y29uc3QgYSA9IHRoaXMuaW5kaWNlc1sgY2xvc2VzdERpc3RhbmNlVHJpYW5nbGVJbmRleCAqIDMgXTtcblx0XHRjb25zdCBiID0gdGhpcy5pbmRpY2VzWyBjbG9zZXN0RGlzdGFuY2VUcmlhbmdsZUluZGV4ICogMyArIDEgXTtcblx0XHRjb25zdCBjID0gdGhpcy5pbmRpY2VzWyBjbG9zZXN0RGlzdGFuY2VUcmlhbmdsZUluZGV4ICogMyArIDIgXTtcblxuXHRcdHRoaXMudkEuZnJvbUJ1ZmZlckF0dHJpYnV0ZSggdGhpcy5wb3NpdGlvbnMsIGEgKTtcblx0XHR0aGlzLnZCLmZyb21CdWZmZXJBdHRyaWJ1dGUoIHRoaXMucG9zaXRpb25zLCBiICk7XG5cdFx0dGhpcy52Qy5mcm9tQnVmZmVyQXR0cmlidXRlKCB0aGlzLnBvc2l0aW9ucywgYyApO1xuXG5cdFx0dGhpcy51dkEuZnJvbUJ1ZmZlckF0dHJpYnV0ZSggdGhpcy51dnMsIGEgKTtcblx0XHR0aGlzLnV2Qi5mcm9tQnVmZmVyQXR0cmlidXRlKCB0aGlzLnV2cywgYiApO1xuXHRcdHRoaXMudXZDLmZyb21CdWZmZXJBdHRyaWJ1dGUoIHRoaXMudXZzLCBjICk7XG5cblx0XHRUcmlhbmdsZS5nZXRVVihcblx0XHRcdHRhcmdldFBvcyxcblx0XHRcdHRoaXMudkEsXG5cdFx0XHR0aGlzLnZCLFxuXHRcdFx0dGhpcy52Qyxcblx0XHRcdHRoaXMudXZBLFxuXHRcdFx0dGhpcy51dkIsXG5cdFx0XHR0aGlzLnV2Qyxcblx0XHRcdHRhcmdldFVWRGlzdGFuY2Vcblx0XHQpO1xuXG5cdFx0Ly8geCwgeTogdXYsIHo6IGRpc3RhbmNlXG5cdFx0dGFyZ2V0VVZEaXN0YW5jZS56ID0gTWF0aC5zcXJ0KCBjbG9zZXN0RGlzdGFuY2VTcSApO1xuXG5cdFx0VHJpYW5nbGUuZ2V0Tm9ybWFsKCB0aGlzLnZBLCB0aGlzLnZCLCB0aGlzLnZDLCB0YXJnZXROb3JtYWwgKTtcblxuXHRcdC8vIGZpbmQgdGhlIGFzc29jaWF0ZWQgbWF0ZXJpYWwgaW5kZXhcblx0XHRsZXQgbWF0ZXJpYWxJbmRleCA9IDA7XG5cdFx0Y29uc3QgZmlyc3RWZXJ0ZXhJbmRleCA9IGNsb3Nlc3REaXN0YW5jZVRyaWFuZ2xlSW5kZXggKiAzO1xuXHRcdGZvciAoIGxldCBpID0gMCwgbCA9IHRoaXMuZ3JvdXBzLmxlbmd0aDsgaSA8IGw7IGkgKysgKSB7XG5cblx0XHRcdGNvbnN0IGdyb3VwID0gdGhpcy5ncm91cHNbIGkgXTtcblx0XHRcdGNvbnN0IHsgc3RhcnQsIGNvdW50IH0gPSBncm91cDtcblx0XHRcdGlmICggZmlyc3RWZXJ0ZXhJbmRleCA+PSBzdGFydCAmJiBmaXJzdFZlcnRleEluZGV4IDwgc3RhcnQgKyBjb3VudCApIHtcblxuXHRcdFx0XHRtYXRlcmlhbEluZGV4ID0gZ3JvdXAubWF0ZXJpYWxJbmRleDtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdHJldHVybiBtYXRlcmlhbEluZGV4O1xuXG5cdH1cblxuXG5cdHN0YXRpYyBtZXJnZUdlb21ldHJpZXMoIGdlb21ldHJpZXMsIG1hdHJpY2VzICkge1xuXG5cdFx0Ly8gTWVyZ2UgYWxsIGdlb21ldHJpZXMgaW50byBvbmVcblxuXHRcdGNvbnN0IHRyYW5zZm9ybWVkR2VvbWV0cmllcyA9IFsgXTtcblx0XHRmb3IgKCBsZXQgaSA9IDAsIGwgPSBnZW9tZXRyaWVzLmxlbmd0aDsgaSA8IGw7IGkgKysgKSB7XG5cblx0XHRcdGNvbnN0IHRyYW5zZm9ybWVkR2VvbWV0cnkgPSBnZW9tZXRyaWVzWyBpIF0uY2xvbmUoKTtcblx0XHRcdHRyYW5zZm9ybWVkR2VvbWV0cnkuYXBwbHlNYXRyaXg0KCBtYXRyaWNlc1sgaSBdICk7XG5cdFx0XHR0cmFuc2Zvcm1lZEdlb21ldHJpZXMucHVzaCggdHJhbnNmb3JtZWRHZW9tZXRyeSApO1xuXG5cdFx0fVxuXG5cdFx0Y29uc3QgbWVyZ2VkR2VvbWV0cnkgPSB0aGlzLm1lcmdlQnVmZmVyR2VvbWV0cmllcyggdHJhbnNmb3JtZWRHZW9tZXRyaWVzICk7XG5cdFx0aWYgKCAhIG1lcmdlZEdlb21ldHJ5ICkge1xuXG5cdFx0XHRjb25zb2xlLmVycm9yKCBcIkVycm9yIG1lcmdpbmcgdGhlIG1vZGVscyBpbnRvIG9uZSBnZW9tZXRyeS5cIiApO1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gbWVyZ2VkR2VvbWV0cnk7XG5cblx0fVxuXG5cdHN0YXRpYyBtZXJnZUJ1ZmZlckdlb21ldHJpZXMoIGdlb21ldHJpZXMgKSB7XG5cblx0XHRjb25zdCBpc0luZGV4ZWQgPSBnZW9tZXRyaWVzWyAwIF0uaW5kZXggIT09IG51bGw7XG5cblx0XHRjb25zdCBhdHRyaWJ1dGVzVXNlZCA9IG5ldyBTZXQoIE9iamVjdC5rZXlzKCBnZW9tZXRyaWVzWyAwIF0uYXR0cmlidXRlcyApICk7XG5cblx0XHRjb25zdCBhdHRyaWJ1dGVzID0ge307XG5cblx0XHRjb25zdCBtZXJnZWRHZW9tZXRyeSA9IG5ldyBCdWZmZXJHZW9tZXRyeSgpO1xuXG5cdFx0bGV0IHRoZXJlQXJlR3JvdXBzID0gZmFsc2U7XG5cdFx0Zm9yICggbGV0IGkgPSAwOyBpIDwgZ2VvbWV0cmllcy5sZW5ndGg7ICsrIGkgKSB7XG5cblx0XHRcdGNvbnN0IGdlb21ldHJ5ID0gZ2VvbWV0cmllc1sgaSBdO1xuXHRcdFx0aWYgKCBnZW9tZXRyeS5ncm91cHMubGVuZ3RoID4gMCApIHtcblxuXHRcdFx0XHR0aGVyZUFyZUdyb3VwcyA9IHRydWU7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRsZXQgb2Zmc2V0ID0gMDtcblx0XHRsZXQgbmV4dEdyb3VwSWQgPSAwO1xuXG5cdFx0Zm9yICggbGV0IGkgPSAwOyBpIDwgZ2VvbWV0cmllcy5sZW5ndGg7ICsrIGkgKSB7XG5cblx0XHRcdGNvbnN0IGdlb21ldHJ5ID0gZ2VvbWV0cmllc1sgaSBdO1xuXHRcdFx0bGV0IGF0dHJpYnV0ZXNDb3VudCA9IDA7XG5cblx0XHRcdC8vIGVuc3VyZSB0aGF0IGFsbCBnZW9tZXRyaWVzIGFyZSBpbmRleGVkLCBvciBub25lXG5cblx0XHRcdGlmICggaXNJbmRleGVkICE9PSAoIGdlb21ldHJ5LmluZGV4ICE9PSBudWxsICkgKSB7XG5cblx0XHRcdFx0Y29uc29sZS5lcnJvciggJ1NsaWNlci5tZXJnZUJ1ZmZlckdlb21ldHJpZXMoKSBmYWlsZWQgd2l0aCBnZW9tZXRyeSBhdCBpbmRleCAnICsgaSArICcuIEFsbCBnZW9tZXRyaWVzIG11c3QgaGF2ZSBjb21wYXRpYmxlIGF0dHJpYnV0ZXM7IG1ha2Ugc3VyZSBpbmRleCBhdHRyaWJ1dGUgZXhpc3RzIGFtb25nIGFsbCBnZW9tZXRyaWVzLCBvciBpbiBub25lIG9mIHRoZW0uJyApO1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdFx0fVxuXG5cdFx0XHQvLyBnYXRoZXIgYXR0cmlidXRlcywgZXhpdCBlYXJseSBpZiB0aGV5J3JlIGRpZmZlcmVudFxuXG5cdFx0XHRmb3IgKCBjb25zdCBuYW1lIGluIGdlb21ldHJ5LmF0dHJpYnV0ZXMgKSB7XG5cblx0XHRcdFx0aWYgKCAhIGF0dHJpYnV0ZXNVc2VkLmhhcyggbmFtZSApICkge1xuXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciggJ1NsaWNlci5tZXJnZUJ1ZmZlckdlb21ldHJpZXMoKSBmYWlsZWQgd2l0aCBnZW9tZXRyeSBhdCBpbmRleCAnICsgaSArICcuIEFsbCBnZW9tZXRyaWVzIG11c3QgaGF2ZSBjb21wYXRpYmxlIGF0dHJpYnV0ZXM7IG1ha2Ugc3VyZSBcIicgKyBuYW1lICsgJ1wiIGF0dHJpYnV0ZSBleGlzdHMgYW1vbmcgYWxsIGdlb21ldHJpZXMsIG9yIGluIG5vbmUgb2YgdGhlbS4nICk7XG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggYXR0cmlidXRlc1sgbmFtZSBdID09PSB1bmRlZmluZWQgKSBhdHRyaWJ1dGVzWyBuYW1lIF0gPSBbXTtcblxuXHRcdFx0XHRhdHRyaWJ1dGVzWyBuYW1lIF0ucHVzaCggZ2VvbWV0cnkuYXR0cmlidXRlc1sgbmFtZSBdICk7XG5cblx0XHRcdFx0YXR0cmlidXRlc0NvdW50ICsrO1xuXG5cdFx0XHR9XG5cblx0XHRcdC8vIGVuc3VyZSBnZW9tZXRyaWVzIGhhdmUgdGhlIHNhbWUgbnVtYmVyIG9mIGF0dHJpYnV0ZXNcblxuXHRcdFx0aWYgKCBhdHRyaWJ1dGVzQ291bnQgIT09IGF0dHJpYnV0ZXNVc2VkLnNpemUgKSB7XG5cblx0XHRcdFx0Y29uc29sZS5lcnJvciggJ1NsaWNlci5tZXJnZUJ1ZmZlckdlb21ldHJpZXMoKSBmYWlsZWQgd2l0aCBnZW9tZXRyeSBhdCBpbmRleCAnICsgaSArICcuIE1ha2Ugc3VyZSBhbGwgZ2VvbWV0cmllcyBoYXZlIHRoZSBzYW1lIG51bWJlciBvZiBhdHRyaWJ1dGVzLicgKTtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHRcdH1cblxuXHRcdFx0Ly8gQ3JlYXRlIG1lc2hncm91cHNcblxuXHRcdFx0aWYgKCB0aGVyZUFyZUdyb3VwcyApIHtcblxuXHRcdFx0XHRjb25zdCBqbCA9IGdlb21ldHJ5Lmdyb3Vwcy5sZW5ndGg7XG5cblx0XHRcdFx0aWYgKCBqbCA+IDAgKSB7XG5cblx0XHRcdFx0XHRmb3IgKCBsZXQgaiA9IDA7IGogPCBqbDsgaiArKyApIHtcblxuXHRcdFx0XHRcdFx0Y29uc3QgY291bnQgPSBnZW9tZXRyeS5ncm91cHNbIGogXS5jb3VudDtcblxuXHRcdFx0XHRcdFx0bWVyZ2VkR2VvbWV0cnkuYWRkR3JvdXAoIG9mZnNldCwgY291bnQsIG5leHRHcm91cElkICsrICk7XG5cdFx0XHRcdFx0XHRvZmZzZXQgKz0gY291bnQ7XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblxuXG5cdFx0XHRcdFx0bGV0IGNvdW50O1xuXHRcdFx0XHRcdGlmICggaXNJbmRleGVkICkgY291bnQgPSBnZW9tZXRyeS5nZXRJbmRleCgpLmFycmF5Lmxlbmd0aDtcblx0XHRcdFx0XHRlbHNlIGNvdW50ID0gZ2VvbWV0cnkuZ2V0QXR0cmlidXRlKCAncG9zaXRpb24nICkuYXJyYXkubGVuZ3RoIC8gMztcblxuXHRcdFx0XHRcdG1lcmdlZEdlb21ldHJ5LmFkZEdyb3VwKCBvZmZzZXQsIGNvdW50LCBuZXh0R3JvdXBJZCArKyApO1xuXHRcdFx0XHRcdG9mZnNldCArPSBjb3VudDtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdC8vIG1lcmdlIGluZGljZXNcblxuXHRcdGlmICggaXNJbmRleGVkICkge1xuXG5cdFx0XHRsZXQgaW5kZXhPZmZzZXQgPSAwO1xuXHRcdFx0Y29uc3QgbWVyZ2VkSW5kZXggPSBbXTtcblxuXHRcdFx0Zm9yICggbGV0IGkgPSAwOyBpIDwgZ2VvbWV0cmllcy5sZW5ndGg7ICsrIGkgKSB7XG5cblx0XHRcdFx0Y29uc3QgaW5kZXggPSBnZW9tZXRyaWVzWyBpIF0uaW5kZXg7XG5cblx0XHRcdFx0Zm9yICggbGV0IGogPSAwOyBqIDwgaW5kZXguY291bnQ7ICsrIGogKSB7XG5cblx0XHRcdFx0XHRtZXJnZWRJbmRleC5wdXNoKCBpbmRleC5nZXRYKCBqICkgKyBpbmRleE9mZnNldCApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpbmRleE9mZnNldCArPSBnZW9tZXRyaWVzWyBpIF0uYXR0cmlidXRlcy5wb3NpdGlvbi5jb3VudDtcblxuXHRcdFx0fVxuXG5cdFx0XHRtZXJnZWRHZW9tZXRyeS5zZXRJbmRleCggbWVyZ2VkSW5kZXggKTtcblxuXHRcdH1cblxuXHRcdC8vIG1lcmdlIGF0dHJpYnV0ZXNcblxuXHRcdGZvciAoIGNvbnN0IG5hbWUgaW4gYXR0cmlidXRlcyApIHtcblxuXHRcdFx0Y29uc3QgbWVyZ2VkQXR0cmlidXRlID0gQnVmZmVyR2VvbWV0cnlVdGlscy5tZXJnZUJ1ZmZlckF0dHJpYnV0ZXMoIGF0dHJpYnV0ZXNbIG5hbWUgXSApO1xuXG5cdFx0XHRpZiAoICEgbWVyZ2VkQXR0cmlidXRlICkge1xuXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoICdUSFJFRS5CdWZmZXJHZW9tZXRyeVV0aWxzOiAubWVyZ2VCdWZmZXJHZW9tZXRyaWVzKCkgZmFpbGVkIHdoaWxlIHRyeWluZyB0byBtZXJnZSB0aGUgJyArIG5hbWUgKyAnIGF0dHJpYnV0ZS4nICk7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXG5cdFx0XHR9XG5cblx0XHRcdG1lcmdlZEdlb21ldHJ5LnNldEF0dHJpYnV0ZSggbmFtZSwgbWVyZ2VkQXR0cmlidXRlICk7XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gbWVyZ2VkR2VvbWV0cnk7XG5cblx0fVxuXG5cblx0c3RhdGljIGNyZWF0ZUltYWdlKCByZXNvbHV0aW9uWCwgcmVzb2x1dGlvblkgKSB7XG5cblx0XHRyZXR1cm4gbmV3IFVpbnQ4QXJyYXkoIHJlc29sdXRpb25YICogcmVzb2x1dGlvblkgKTtcblxuXHR9XG5cblx0c3RhdGljIGNyZWF0ZVNoYXJlZEltYWdlKCByZXNvbHV0aW9uWCwgcmVzb2x1dGlvblkgKSB7XG5cblx0XHRyZXR1cm4gbmV3IFNoYXJlZEFycmF5QnVmZmVyKCByZXNvbHV0aW9uWCAqIHJlc29sdXRpb25ZICk7XG5cblx0fVxuXG5cdHN0YXRpYyBwYWludEltYWdlSW5DYW52YXMoIHIsIGcsIGIsIGltYWdlLCBjYW52YXMsIGNhbnZhc0N0eCwgaW1hZ2VEYXRhICkge1xuXG5cdFx0Ly8gUmV0dXJucyBudW1iZXIgb2YgcGl4ZWxzIGRpZmZlcmVudCB0aGFuIHplcm9cblxuXHRcdGlmICggaW1hZ2UgPT09IG51bGwgKSB7XG5cblx0XHRcdGNhbnZhc0N0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xuXHRcdFx0Y2FudmFzQ3R4LmZpbGxSZWN0KCAwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQgKTtcblx0XHRcdHJldHVybiAwO1xuXG5cdFx0fVxuXG5cdFx0Y29uc3QgZGF0YSA9IGltYWdlRGF0YS5kYXRhO1xuXG5cdFx0Y29uc3QgbnVtUGl4ZWxzID0gY2FudmFzLndpZHRoICogY2FudmFzLmhlaWdodDtcblx0XHRsZXQgbnVtTm9uWmVyb1BpeGVscyA9IDA7XG5cdFx0bGV0IHAgPSAwO1xuXHRcdGZvciAoIGxldCBpID0gMDsgaSA8IG51bVBpeGVsczsgaSArKyApIHtcblxuXHRcdFx0Y29uc3QgZ3JheSA9IGltYWdlWyBpIF07XG5cblx0XHRcdGRhdGFbIHAgXSA9IHI7XG5cdFx0XHRkYXRhWyBwICsgMSBdID0gZztcblx0XHRcdGRhdGFbIHAgKyAyIF0gPSBiO1xuXHRcdFx0ZGF0YVsgcCArIDMgXSA9IGdyYXk7XG5cblx0XHRcdHAgKz0gNDtcblxuXHRcdFx0aWYgKCBncmF5ICE9PSAwICkgbnVtTm9uWmVyb1BpeGVscyArKztcblxuXHRcdH1cblxuXHRcdGNhbnZhc0N0eC5wdXRJbWFnZURhdGEoIGltYWdlRGF0YSwgMCwgMCApO1xuXG5cdFx0cmV0dXJuIG51bU5vblplcm9QaXhlbHM7XG5cblx0fVxuXG5cdGNvdW50UGl4ZWxzSW5JbWFnZSggaW1hZ2UgKSB7XG5cblx0XHRjb25zdCByZXNvbHV0aW9uWCA9IHRoaXMuc2V0dGluZ3MucmVzb2x1dGlvblk7XG5cdFx0Y29uc3QgcmVzb2x1dGlvblogPSB0aGlzLnNldHRpbmdzLnJlc29sdXRpb25YO1xuXG5cdFx0bGV0IG51bVBpeGVscyA9IDA7XG5cblx0XHRmb3IgKCBsZXQgaSA9IDAsIGlsID0gcmVzb2x1dGlvblogKiByZXNvbHV0aW9uWDsgaSA8IGlsOyBpICsrICkge1xuXG5cdFx0XHRpZiAoIGltYWdlWyBpIF0gIT09IDAgKSBudW1QaXhlbHMgKys7XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gbnVtUGl4ZWxzO1xuXG5cdH1cblxufVxuXG5leHBvcnQgeyBTbGljZXIgfTtcbiIsIi8qXG5NaW5jZSBTbGljZXJcblxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDIxIEp1YW4gSm9zZSBMdW5hIEVzcGlub3NhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cblxuKi9cblxuaW1wb3J0IHsgQnVmZmVyR2VvbWV0cnksIEJ1ZmZlckF0dHJpYnV0ZSB9IGZyb20gJ3RocmVlJztcblxuXG5jbGFzcyBHZW9tZXRyeVNlcmlhbGl6ZXIge1xuXG5cdHN0YXRpYyBzZXJpYWxpemUoIGJ1ZmZlckdlb21ldHJ5ICkge1xuXG5cdFx0Ly8gVGhlIGdlb21ldHJ5IG11c3QgaGF2ZSBwb3NpdGlvbiBhbmQgdXYgYXR0cmlidXRlcy5cblx0XHQvLyBSZXR1cm5zIEpTT04gb2JqZWN0XG5cblx0XHRjb25zdCBpbmRleCA9IGJ1ZmZlckdlb21ldHJ5LmdldEluZGV4KCk7XG5cblx0XHRyZXR1cm4ge1xuXG5cdFx0XHRpbmRleDogaW5kZXggIT09IG51bGwgPyBpbmRleC5hcnJheSA6IG51bGwsXG5cblx0XHRcdHBvc2l0aW9uOiBidWZmZXJHZW9tZXRyeS5nZXRBdHRyaWJ1dGUoICdwb3NpdGlvbicgKS5hcnJheSxcblxuXHRcdFx0dXY6IGJ1ZmZlckdlb21ldHJ5LmdldEF0dHJpYnV0ZSggJ3V2JyApLmFycmF5LFxuXG5cdFx0XHRncm91cHM6IEdlb21ldHJ5U2VyaWFsaXplci5zZXJpYWxpemVHcm91cHMoIGJ1ZmZlckdlb21ldHJ5IClcblxuXHRcdH07XG5cblx0fVxuXG5cdHN0YXRpYyBzZXJpYWxpemVHcm91cHMoIGJ1ZmZlckdlb21ldHJ5ICkge1xuXG5cdFx0Y29uc3QgZ3JvdXBzID0gWyBdO1xuXHRcdGZvciAoIGxldCBpID0gMCwgaWwgPSBidWZmZXJHZW9tZXRyeS5ncm91cHMubGVuZ3RoOyBpIDwgaWw7IGkgKysgKSB7XG5cblx0XHRcdGNvbnN0IGcgPSBidWZmZXJHZW9tZXRyeS5ncm91cHNbIGkgXTtcblxuXHRcdFx0Z3JvdXBzLnB1c2goIHtcblx0XHRcdFx0c3RhcnQ6IGcuc3RhcnQsXG5cdFx0XHRcdGNvdW50OiBnLmNvdW50LFxuXHRcdFx0XHRtYXRlcmlhbEluZGV4OiBnLm1hdGVyaWFsSW5kZXhcblx0XHRcdH0gKTtcblxuXHRcdH1cblxuXHRcdHJldHVybiBncm91cHM7XG5cblx0fVxuXG5cdHN0YXRpYyBkZXNlcmlhbGl6ZSggc2VyaWFsaXplZERhdGEgKSB7XG5cblx0XHQvLyBSZXR1cm5zIEJ1ZmZlckdlb21ldHJ5XG5cblx0XHRjb25zdCBidWZmZXJHZW9tZXRyeSA9IG5ldyBCdWZmZXJHZW9tZXRyeSgpO1xuXG5cdFx0aWYgKCBzZXJpYWxpemVkRGF0YS5pbmRleCAhPT0gbnVsbCApIGJ1ZmZlckdlb21ldHJ5LnNldEluZGV4KCBzZXJpYWxpemVkRGF0YS5pbmRleCApO1xuXHRcdGJ1ZmZlckdlb21ldHJ5LnNldEF0dHJpYnV0ZSggJ3Bvc2l0aW9uJywgbmV3IEJ1ZmZlckF0dHJpYnV0ZSggc2VyaWFsaXplZERhdGEucG9zaXRpb24sIDMgKSApO1xuXHRcdGJ1ZmZlckdlb21ldHJ5LnNldEF0dHJpYnV0ZSggJ3V2JywgbmV3IEJ1ZmZlckF0dHJpYnV0ZSggc2VyaWFsaXplZERhdGEudXYsIDIgKSApO1xuXG5cdFx0Zm9yICggbGV0IGkgPSAwLCBpbCA9IHNlcmlhbGl6ZWREYXRhLmdyb3Vwcy5sZW5ndGg7IGkgPCBpbDsgaSArKyApIHtcblxuXHRcdFx0Y29uc3QgZyA9IHNlcmlhbGl6ZWREYXRhLmdyb3Vwc1sgaSBdO1xuXG5cdFx0XHRidWZmZXJHZW9tZXRyeS5hZGRHcm91cCggZy5zdGFydCwgZy5jb3VudCwgZy5tYXRlcmlhbEluZGV4ICk7XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gYnVmZmVyR2VvbWV0cnk7XG5cblx0fVxuXG59XG5cbmV4cG9ydCB7IEdlb21ldHJ5U2VyaWFsaXplciB9OyIsIi8qXG5NaW5jZSBTbGljZXJcblxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDIxIEp1YW4gSm9zZSBMdW5hIEVzcGlub3NhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cblxuKi9cblxuaW1wb3J0IHsgVmVjdG9yMyB9IGZyb20gJ3RocmVlJztcbmltcG9ydCB7IGVuY29kZSB9IGZyb20gJ2Zhc3QtcG5nJztcblxuaW1wb3J0IHsgU2xpY2VyIH0gZnJvbSAnLi9zbGljaW5nL1NsaWNlci5qcyc7XG5pbXBvcnQgeyBHZW9tZXRyeVNlcmlhbGl6ZXIgfSBmcm9tICcuL3V0aWxzL0dlb21ldHJ5U2VyaWFsaXplci5qcyc7XG5cbmxldCBteVdvcmtlckluZGV4ID0gbnVsbDtcblxuXG5jb25zdCBzbGljZXIgPSBuZXcgU2xpY2VyKCk7XG5sZXQgcmVzb2x1dGlvblggPSAwO1xubGV0IHJlc29sdXRpb25ZID0gMDtcbmxldCBpbWFnZSA9IG51bGw7XG5sZXQgaW1hZ2VQTkcgPSBudWxsO1xuXG5zZWxmLm9ubWVzc2FnZSA9ICggZXZlbnQgKSA9PiB7XG5cblx0c3dpdGNoICggZXZlbnQuZGF0YS50eXBlICkge1xuXG5cdFx0Y2FzZSAnaW5pdEluZGV4Jzpcblx0XHRcdG15V29ya2VySW5kZXggPSBldmVudC5kYXRhLndvcmtlckluZGV4O1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlICdpbml0V29ya2VyJzpcblx0XHRcdG9uSW5pdFdvcmtlck1lc3NhZ2UoIGV2ZW50LmRhdGEgKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSAnam9iJzpcblxuXHRcdFx0Y29uc3QgcGFyYW1ldGVycyA9IGV2ZW50LmRhdGEucGFyYW1ldGVycztcblxuXHRcdFx0Y29uc3QgcmVzdWx0ID0gZXhlY3V0ZUpvYiggcGFyYW1ldGVycyApO1xuXG5cdFx0XHRzZWxmLnBvc3RNZXNzYWdlKCB7XG5cdFx0XHRcdHR5cGU6IFwiam9iUmVzdWx0XCIsXG5cdFx0XHRcdHdvcmtlckluZGV4OiBteVdvcmtlckluZGV4LFxuXHRcdFx0XHRyZXN1bHQ6IHJlc3VsdFxuXHRcdFx0fSApO1xuXG5cdFx0YnJlYWs7XG5cblx0fVxuXG59O1xuXG5mdW5jdGlvbiBvbkluaXRXb3JrZXJNZXNzYWdlKCBtZXNzYWdlICkge1xuXG5cdGluaXRQcmludCggbWVzc2FnZSApO1xuXG59XG5cbmZ1bmN0aW9uIGV4ZWN1dGVKb2IoIHBhcmFtZXRlcnMgKSB7XG5cblx0c3dpdGNoICggcGFyYW1ldGVycy5qb2JUeXBlICkge1xuXG5cdFx0Y2FzZSAnc2xpY2VMYXllcic6XG5cdFx0XHRyZXR1cm4gc2xpY2VMYXllciggcGFyYW1ldGVycyApO1xuXG5cdH1cblxuXHRyZXR1cm4gbnVsbDtcblxufVxuXG5mdW5jdGlvbiBpbml0UHJpbnQoIHBhcmFtZXRlcnMgKSB7XG5cblx0Y29uc3QgZ2VvbWV0cnkgPSBHZW9tZXRyeVNlcmlhbGl6ZXIuZGVzZXJpYWxpemUoIHBhcmFtZXRlcnMuZ2VvbWV0cnkgKTtcblxuXHRzbGljZXIuc2V0dXBQcmludCggZ2VvbWV0cnksIHBhcmFtZXRlcnMuaW1hZ2VzLCBwYXJhbWV0ZXJzLnByaW50U2V0dGluZ3MgKTtcblxuXHRyZXNvbHV0aW9uWCA9IHBhcmFtZXRlcnMucHJpbnRTZXR0aW5ncy5yZXNvbHV0aW9uWDtcblx0cmVzb2x1dGlvblkgPSBwYXJhbWV0ZXJzLnByaW50U2V0dGluZ3MucmVzb2x1dGlvblk7XG5cblx0aW1hZ2UgPSBTbGljZXIuY3JlYXRlSW1hZ2UoIHJlc29sdXRpb25YLCByZXNvbHV0aW9uWSApO1xuXG5cdGltYWdlUE5HID0ge1xuXHRcdHdpZHRoOiByZXNvbHV0aW9uWCxcblx0XHRoZWlnaHQ6IHJlc29sdXRpb25ZLFxuXHRcdGRhdGE6IGltYWdlLFxuXHRcdGRlcHRoOiA4LFxuXHRcdGNoYW5uZWxzOiAxXG5cdH07XG5cbn1cblxuZnVuY3Rpb24gc2xpY2VMYXllciggcGFyYW1ldGVycyApIHtcblxuXHRzbGljZXIuc2xpY2VMYXllciggcGFyYW1ldGVycy5sYXllckluZGV4LCBpbWFnZSApO1xuXG5cdGlmICggcGFyYW1ldGVycy5yZXN1bHRUeXBlUE5HQ29udGVudCApIHtcblxuXHRcdGNvbnN0IHBuZ0xheWVyRGF0YSA9IGVuY29kZSggaW1hZ2VQTkcgKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRsYXllckluZGV4OiBwYXJhbWV0ZXJzLmxheWVySW5kZXgsXG5cdFx0XHRudW1Ob25aZXJvUGl4ZWxzOiBzbGljZXIuY291bnRQaXhlbHNJbkltYWdlKCBpbWFnZSApLFxuXHRcdFx0cG5nTGF5ZXJEYXRhOiBwbmdMYXllckRhdGFcblx0XHR9O1xuXG5cdH1cblx0ZWxzZSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0bGF5ZXJJbmRleDogcGFyYW1ldGVycy5sYXllckluZGV4LFxuXHRcdFx0aW1hZ2U6IGltYWdlXG5cdFx0fTtcblxuXHR9XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbi8vIHRoZSBzdGFydHVwIGZ1bmN0aW9uXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnggPSAoKSA9PiB7XG5cdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuXHQvLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcblx0dmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbNTM0XSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oNzI5KSkpXG5cdF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG5cdHJldHVybiBfX3dlYnBhY2tfZXhwb3J0c19fO1xufTtcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmYgPSB7fTtcbi8vIFRoaXMgZmlsZSBjb250YWlucyBvbmx5IHRoZSBlbnRyeSBjaHVuay5cbi8vIFRoZSBjaHVuayBsb2FkaW5nIGZ1bmN0aW9uIGZvciBhZGRpdGlvbmFsIGNodW5rc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5lID0gKGNodW5rSWQpID0+IHtcblx0cmV0dXJuIFByb21pc2UuYWxsKE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uZikucmVkdWNlKChwcm9taXNlcywga2V5KSA9PiB7XG5cdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5mW2tleV0oY2h1bmtJZCwgcHJvbWlzZXMpO1xuXHRcdHJldHVybiBwcm9taXNlcztcblx0fSwgW10pKTtcbn07IiwiLy8gVGhpcyBmdW5jdGlvbiBhbGxvdyB0byByZWZlcmVuY2UgYXN5bmMgY2h1bmtzIGFuZCBzaWJsaW5nIGNodW5rcyBmb3IgdGhlIGVudHJ5cG9pbnRcbl9fd2VicGFja19yZXF1aXJlX18udSA9IChjaHVua0lkKSA9PiB7XG5cdC8vIHJldHVybiB1cmwgZm9yIGZpbGVuYW1lcyBiYXNlZCBvbiB0ZW1wbGF0ZVxuXHRyZXR1cm4gXCJcIiArIGNodW5rSWQgKyBcIi5tYWluLmpzXCI7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsInZhciBzY3JpcHRVcmw7XG5pZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5nLmltcG9ydFNjcmlwdHMpIHNjcmlwdFVybCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5sb2NhdGlvbiArIFwiXCI7XG52YXIgZG9jdW1lbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcuZG9jdW1lbnQ7XG5pZiAoIXNjcmlwdFVybCAmJiBkb2N1bWVudCkge1xuXHRpZiAoZG9jdW1lbnQuY3VycmVudFNjcmlwdClcblx0XHRzY3JpcHRVcmwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyY1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHNjcmlwdFVybCA9IHNjcmlwdHNbc2NyaXB0cy5sZW5ndGggLSAxXS5zcmNcblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGNodW5rc1xuLy8gXCIxXCIgbWVhbnMgXCJhbHJlYWR5IGxvYWRlZFwiXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHQ3Mjk6IDFcbn07XG5cbi8vIGltcG9ydFNjcmlwdHMgY2h1bmsgbG9hZGluZ1xudmFyIGluc3RhbGxDaHVuayA9IChkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdGZvcih2YXIgbW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHR9XG5cdH1cblx0aWYocnVudGltZSkgcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0d2hpbGUoY2h1bmtJZHMubGVuZ3RoKVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkcy5wb3AoKV0gPSAxO1xuXHRwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcbn07XG5fX3dlYnBhY2tfcmVxdWlyZV9fLmYuaSA9IChjaHVua0lkLCBwcm9taXNlcykgPT4ge1xuXHQvLyBcIjFcIiBpcyB0aGUgc2lnbmFsIGZvciBcImFscmVhZHkgbG9hZGVkXCJcblx0aWYoIWluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdGlmKHRydWUpIHsgLy8gYWxsIGNodW5rcyBoYXZlIEpTXG5cdFx0XHRpbXBvcnRTY3JpcHRzKF9fd2VicGFja19yZXF1aXJlX18ucCArIF9fd2VicGFja19yZXF1aXJlX18udShjaHVua0lkKSk7XG5cdFx0fVxuXHR9XG59O1xuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua01pbmNlU2xpY2VyXCJdID0gc2VsZltcIndlYnBhY2tDaHVua01pbmNlU2xpY2VyXCJdIHx8IFtdO1xudmFyIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uID0gY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSBpbnN0YWxsQ2h1bms7XG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3QiLCJ2YXIgbmV4dCA9IF9fd2VicGFja19yZXF1aXJlX18ueDtcbl9fd2VicGFja19yZXF1aXJlX18ueCA9ICgpID0+IHtcblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uZSg1MzQpLnRoZW4obmV4dCk7XG59OyIsIiIsIi8vIHJ1biBzdGFydHVwXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18ueCgpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9