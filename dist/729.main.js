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
		const initialRayZ = - this.settings.machineX * 0.5 - this.settings.maxDistance;
		const resolutionX = this.settings.resolutionY;
		const resolutionZ = this.settings.resolutionX;
		const voxelXSize = this.settings.machineY / resolutionX;
		const voxelZSize = this.settings.machineX / resolutionZ;
		const initialLayerRayX = this.settings.machineY * 0.5 - voxelXSize * 0.5;
		const pixelOffset = this.settings.machineX * 0.5;

		const mesh = this.mesh;
		const raycaster = this.raycaster;
		const ray = this.raycaster.ray;
		const bvh = this.bvh;

		ray.direction.set( 0, 0, 1 );

		// Clear image
		image.fill( 0 );

		// Cast rays across the layer
		for ( let layerRayIndex = 0; layerRayIndex < resolutionX; layerRayIndex ++ ) {

			let x = initialLayerRayX - layerRayIndex * voxelXSize;
			this.raycaster.ray.origin.set( x, layerHeight * ( layerIndex + 0.5 ), initialRayZ );

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
					const isFrontFacing = intersection0.face.normal.dot( raycaster.ray.direction ) < 0;

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
					const isFrontFacing = intersection1.face.normal.dot( raycaster.ray.direction ) < 0;

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

				var minXIndex = Math.max( 0, Math.min( resolutionZ - 1, Math.floor( ( intersection0.point.z + pixelOffset ) / voxelZSize ) ) );
				var maxXIndex = Math.max( 0, Math.min( resolutionZ - 1, Math.round( ( intersection1.point.z + pixelOffset ) / voxelZSize ) ) );

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
		const initialRayZ = - this.settings.machineX * 0.5 + voxelZSize * 0.5;
		const initialRayX = this.settings.machineY * 0.5 - voxelXSize * 0.5;
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
		//const subvoxelContribution = 256 / Math.pow( antialiasing, 2 );

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

				const isFrontFacing = intersections[ i ].face.normal.dot( raycaster.ray.direction ) < 0;

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

							image[ ( i0 + m ) * resolutionZ + n + j0 ] = Math.min( 255, currentVoxelContribution );

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

								image[ ( i0 + m ) * resolutionZ + n + j0 ] = 255;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUUyQjs7O0FDbEQzQjtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUU4Qzs7QUFFOUMsNEJBQTRCLFVBQVU7O0FBRXRDOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUV5Qjs7O0FDbkR6QjtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUU4Qzs7QUFFOUMsNEJBQTRCLFVBQVU7O0FBRXRDOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUV5Qjs7O0FDakR6QjtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUU2Qzs7QUFFN0MsNEJBQTRCLFVBQVU7O0FBRXRDOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFeUI7OztBQ3JEekI7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFNkM7O0FBRTdDLDRCQUE0QixVQUFVOztBQUV0Qzs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUV5Qjs7O0FDbER6QjtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUU2Qzs7QUFFN0MsNEJBQTRCLFVBQVU7O0FBRXRDOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRXlCOzs7QUNsRHpCO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRTZDOztBQUU3QyxpQ0FBaUMsVUFBVTs7QUFFM0M7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFOEI7OztBQ2xEOUI7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFNkM7O0FBRTdDLGtDQUFrQyxVQUFVOztBQUU1Qzs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFK0I7OztBQy9DL0I7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFNkM7O0FBRTdDLGlDQUFpQyxVQUFVOztBQUUzQzs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFOEI7OztBQ3pEOUI7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFZ0M7O0FBRWE7O0FBRTdDLGlDQUFpQyxVQUFVOztBQUUzQzs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsZ0JBQWdCLDZCQUFPOztBQUV2Qjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFOEI7OztBQzVEOUI7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFNkM7O0FBRTdDLDZCQUE2QixVQUFVOztBQUV2Qzs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFMEI7OztBQy9DMUI7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFNkM7O0FBRTdDLDZCQUE2QixVQUFVOztBQUV2Qzs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFMEI7OztBQy9DMUI7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFNkM7O0FBRTdDLDZCQUE2QixVQUFVOztBQUV2Qzs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFMEI7OztBQy9DMUI7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFNkM7O0FBRTdDLDZCQUE2QixVQUFVOztBQUV2Qzs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7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Q0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBLGVBQWUsYUFBYTtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0EsZUFBZSxhQUFhO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQSxlQUFlLGtCQUFrQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0EsZUFBZSxtQkFBbUI7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQSxlQUFlLGdCQUFnQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0EsZUFBZSxlQUFlO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQSxlQUFlLGFBQWE7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxhQUF1QjtBQUMzQjtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQSxlQUFlLGFBQWE7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QTtXQUNBO1dBQ0E7V0FDQTtXQUNBLCtCQUErQix3Q0FBd0M7V0FDdkU7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQkFBaUIscUJBQXFCO1dBQ3RDO1dBQ0E7V0FDQSxrQkFBa0IscUJBQXFCO1dBQ3ZDO1dBQ0E7V0FDQSxLQUFLO1dBQ0w7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQzNCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsRUFBRTtXQUNGOzs7OztXQ1JBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDSkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBLENBQUM7Ozs7O1dDUEQ7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDZkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGFBQWE7V0FDYjtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7Ozs7O1dDcENBO1dBQ0E7V0FDQTtXQUNBOzs7OztVRUhBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy91dGlscy9SYW5kb20uanMiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvLi9zcmMvbm9kZXMvQ29uc3RhbnRzLmpzIiwid2VicGFjazovL01pbmNlU2xpY2VyLy4vc3JjL25vZGVzL1JlbGllZk5vZGUuanMiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvLi9zcmMvbm9kZXMvUmVsaWVmTm9kZUNvbnN0YW50LmpzIiwid2VicGFjazovL01pbmNlU2xpY2VyLy4vc3JjL25vZGVzL1JlbGllZk5vZGVJbWFnZVVWLmpzIiwid2VicGFjazovL01pbmNlU2xpY2VyLy4vc3JjL25vZGVzL1JlbGllZk5vZGVDZWxsLmpzIiwid2VicGFjazovL01pbmNlU2xpY2VyLy4vc3JjL25vZGVzL1JlbGllZk5vZGVJbWFnZVRpbGVkVVYuanMiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvLi9zcmMvbm9kZXMvUmVsaWVmTm9kZUFkZC5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9ub2Rlcy9SZWxpZWZOb2RlTmVnYXRlLmpzIiwid2VicGFjazovL01pbmNlU2xpY2VyLy4vc3JjL25vZGVzL1JlbGllZk5vZGVNdWx0aXBseS5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9ub2Rlcy9SZWxpZWZOb2RlRGl2aWRlLmpzIiwid2VicGFjazovL01pbmNlU2xpY2VyLy4vc3JjL25vZGVzL1JlbGllZk5vZGVQb3dlci5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9ub2Rlcy9SZWxpZWZOb2RlU2luLmpzIiwid2VicGFjazovL01pbmNlU2xpY2VyLy4vc3JjL25vZGVzL1JlbGllZk5vZGVDb3MuanMiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvLi9zcmMvbm9kZXMvUmVsaWVmTm9kZU1peC5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9ub2Rlcy9SZWxpZWZOb2RlTWluLmpzIiwid2VicGFjazovL01pbmNlU2xpY2VyLy4vc3JjL25vZGVzL1JlbGllZk5vZGVNYXguanMiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvLi9zcmMvbm9kZXMvUmVsaWVmTm9kZUxlc3NUaGFuLmpzIiwid2VicGFjazovL01pbmNlU2xpY2VyLy4vc3JjL25vZGVzL1JlbGllZk5vZGVOb3RCb3R0b20uanMiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvLi9zcmMvbm9kZXMvUmVsaWVmTm9kZVF1YW50aXplLmpzIiwid2VicGFjazovL01pbmNlU2xpY2VyLy4vc3JjL25vZGVzL1JlbGllZk5vZGVFdmFsdWF0ZS5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9ub2Rlcy9SZWxpZWZOb2RlR2V0VS5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9ub2Rlcy9SZWxpZWZOb2RlR2V0Vi5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9ub2Rlcy9SZWxpZWZOb2RlR2V0WC5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9ub2Rlcy9SZWxpZWZOb2RlR2V0WS5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9ub2Rlcy9SZWxpZWZOb2RlR2V0Wi5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9ub2Rlcy9SZWxpZWZOb2RlQ2hlY2tlcmVkLmpzIiwid2VicGFjazovL01pbmNlU2xpY2VyLy4vc3JjL25vZGVzL1JlbGllZk5vZGVUaWxlcy5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9ub2Rlcy9SZWxpZWZOb2RlU2ltcGxleFVWLmpzIiwid2VicGFjazovL01pbmNlU2xpY2VyLy4vc3JjL25vZGVzL1JlbGllZk5vZGVQZXJsaW5VVi5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9ub2Rlcy9SZWxpZWZOb2RlVm9yb25vaVVWLmpzIiwid2VicGFjazovL01pbmNlU2xpY2VyLy4vc3JjL25vZGVzL1JlbGllZk5vZGVDaXJjbGVzLmpzIiwid2VicGFjazovL01pbmNlU2xpY2VyLy4vc3JjL25vZGVzL1JlbGllZk5vZGVTcG90cy5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci8uL3NyYy9ub2Rlcy9SZWxpZWZOb2RlUHJlc2V0LmpzIiwid2VicGFjazovL01pbmNlU2xpY2VyLy4vc3JjL25vZGVzL1JlbGllZk5vZGVNYXRlcmlhbFNlbGVjdG9yLmpzIiwid2VicGFjazovL01pbmNlU2xpY2VyLy4vc3JjL25vZGVzL1JlbGllZk5vZGVNdWx0aXBsZXguanMiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvLi9zcmMvbm9kZXMvcmVsaWVmTm9kZUNsYXNzZXMuanMiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvLi9zcmMvc2xpY2luZy9TbGljZXIuanMiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvLi9zcmMvdXRpbHMvR2VvbWV0cnlTZXJpYWxpemVyLmpzIiwid2VicGFjazovL01pbmNlU2xpY2VyLy4vc3JjL1NsaWNlcldvcmtlci5qcyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL01pbmNlU2xpY2VyL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL01pbmNlU2xpY2VyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci93ZWJwYWNrL3J1bnRpbWUvZW5zdXJlIGNodW5rIiwid2VicGFjazovL01pbmNlU2xpY2VyL3dlYnBhY2svcnVudGltZS9nZXQgamF2YXNjcmlwdCBjaHVuayBmaWxlbmFtZSIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL01pbmNlU2xpY2VyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvd2VicGFjay9ydW50aW1lL2ltcG9ydFNjcmlwdHMgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci93ZWJwYWNrL3J1bnRpbWUvc3RhcnR1cCBjaHVuayBkZXBlbmRlbmNpZXMiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9NaW5jZVNsaWNlci93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vTWluY2VTbGljZXIvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXG5NaW5jZSBTbGljZXJcblxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDIxIEp1YW4gSm9zZSBMdW5hIEVzcGlub3NhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cblxuKi9cblxuY2xhc3MgUmFuZG9tR2VuZXJhdG9yIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblxuXHR9XG5cblx0cmFuZG9tKCkge1xuXG5cdFx0cmV0dXJuIG51bGw7XG5cblx0fVxuXG5cdGdldFNlZWQoKSB7XG5cblx0XHRyZXR1cm4gbnVsbDtcblxuXHR9XG5cblx0c2V0U2VlZCggc2VlZCApIHsgfVxuXG59XG5cblxuY2xhc3MgTWF0aFJhbmRvbUdlbmVyYXRvciB7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cblx0fVxuXG5cdHJhbmRvbSgpIHtcblxuXHRcdHJldHVybiBNYXRoLnJhbmRvbSgpO1xuXG5cdH1cblxufVxuXG5jb25zdCBwbnJnTGltaXQgPSAxRSs3O1xuXG5jbGFzcyBQc2V1ZG9SYW5kb21HZW5lcmF0b3Ige1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXG5cdFx0dGhpcy5zdGF0ZTEgPSAwO1xuXHRcdHRoaXMuc3RhdGUyID0gMDtcblxuXHRcdHRoaXMubW9kMSA9IDQyOTQ5NjcwODc7XG5cdFx0dGhpcy5tdWwxID0gNjU1Mzk7XG5cdFx0dGhpcy5tb2QyID0gNDI5NDk2NTg4Nztcblx0XHR0aGlzLm11bDIgPSA2NTUzNztcblxuXHR9XG5cblx0cmFuZG9tKCkge1xuXG4gICAgICAgIGRvIHtcblxuXHRcdFx0dGhpcy5zdGF0ZTEgPSAoIHRoaXMuc3RhdGUxICogdGhpcy5tdWwxICkgJSB0aGlzLm1vZDE7XG5cdFx0XHR0aGlzLnN0YXRlMiA9ICggdGhpcy5zdGF0ZTIgKiB0aGlzLm11bDIgKSAlIHRoaXMubW9kMjtcblxuICAgICAgICB9IHdoaWxlIChcblx0XHRcdHRoaXMuc3RhdGUxIDwgcG5yZ0xpbWl0ICYmXG5cdFx0XHR0aGlzLnN0YXRlMiA8IHBucmdMaW1pdCAmJlxuXHRcdFx0dGhpcy5zdGF0ZTEgPCB0aGlzLm1vZDEgJSBwbnJnTGltaXQgJiZcblx0XHRcdHRoaXMuc3RhdGUyIDwgdGhpcy5tb2QyICUgcG5yZ0xpbWl0XG5cdFx0KTtcblxuICAgICAgICByZXR1cm4gKCAoIHRoaXMuc3RhdGUxICsgdGhpcy5zdGF0ZTIgKSAlIHBucmdMaW1pdCAgKSAvIHBucmdMaW1pdCA7XG5cblx0fVxuXG5cdGdldFNlZWQoKSB7XG5cblx0XHRyZXR1cm4gKCB0aGlzLnN0YXRlMSAlIHBucmdMaW1pdCAgKSAvIHBucmdMaW1pdDtcblxuXHR9XG5cblx0c2V0U2VlZCggc2VlZCApIHtcblxuXHRcdHRoaXMuc3RhdGUxID0gTWF0aC5mbG9vciggc2VlZCAqIHBucmdMaW1pdCAgKSAlICggdGhpcy5tb2QxIC0gMSApICsgMTtcblx0XHR0aGlzLnN0YXRlMiA9IE1hdGguZmxvb3IoIHNlZWQgKiBwbnJnTGltaXQgICkgJSAoIHRoaXMubW9kMiAtIDEgKSArIDE7XG5cblx0fVxuXG59XG5cbmNsYXNzIENhY2hlZFJhbmRvbUdlbmVyYXRvciB7XG5cblx0Y29uc3RydWN0b3IoIHNpemUsIGdlbmVyYXRvciwgc2VlZCApIHtcblxuXHRcdHRoaXMuc2VlZHMgPSBbIF07XG5cdFx0dGhpcy5zaXplID0gc2l6ZTtcblxuXHRcdGdlbmVyYXRvci5zZXRTZWVkKCBzZWVkICk7XG5cdFx0Zm9yICggbGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSArKyApIHtcblxuXHRcdFx0dGhpcy5zZWVkcy5wdXNoKCBnZW5lcmF0b3IucmFuZG9tKCkgKTtcblxyXHRcdH1cblxuXHRcdHRoaXMuY3VycmVudFNlZWRQb3MgPSAwO1xuXG5cdH1cblxuXHRyYW5kb20oKSB7XG5cblx0XHRjb25zdCB2YWx1ZSA9IHRoaXMuc2VlZHNbIHRoaXMuY3VycmVudFNlZWRQb3MgXTtcblxuXHRcdHRoaXMuY3VycmVudFNlZWRQb3MgPSAoIHRoaXMuY3VycmVudFNlZWRQb3MgKyAxICkgJSB0aGlzLnNpemU7XG5cblx0XHRyZXR1cm4gdmFsdWU7XG5cblx0fVxuXG5cdGdldFNlZWQoKSB7XG5cblx0XHRyZXR1cm4gdGhpcy5jdXJyZW50U2VlZFBvcyAvIHRoaXMuc2l6ZTtcblxuXHR9XG5cblx0c2V0U2VlZCggc2VlZCApIHtcblxuXHRcdHRoaXMuY3VycmVudFNlZWRQb3MgPSBNYXRoLmZsb29yKCBzZWVkICogdGhpcy5zaXplICkgJSB0aGlzLnNpemU7XG5cblx0fVxuXG59XG5cbmV4cG9ydCB7XG5cdFJhbmRvbUdlbmVyYXRvcixcblx0TWF0aFJhbmRvbUdlbmVyYXRvcixcblx0UHNldWRvUmFuZG9tR2VuZXJhdG9yLFxuXHRDYWNoZWRSYW5kb21HZW5lcmF0b3IsXG59O1xuIiwiLypcbk1pbmNlIFNsaWNlclxuXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMjEgSnVhbiBKb3NlIEx1bmEgRXNwaW5vc2FcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuXG4qL1xuXG5leHBvcnQgY29uc3QgUkVMSUVGID0gJ1JlbGllZiAoMC4uMSknO1xuZXhwb3J0IGNvbnN0IEVNQk9TUyA9ICdFbWJvc3MgKC0xLi4wKSc7XG5leHBvcnQgY29uc3QgUkVMSUVGX0VNQk9TUyA9ICdCb3RoICgtMS4uMSknO1xuIiwiLypcbk1pbmNlIFNsaWNlclxuXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMjEgSnVhbiBKb3NlIEx1bmEgRXNwaW5vc2FcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuXG4qL1xuXG5pbXBvcnQgKiBhcyBDb25zdGFudHMgZnJvbSAnLi9Db25zdGFudHMuanMnO1xuaW1wb3J0IHsgcmVsaWVmTm9kZUNsYXNzZXMgfSBmcm9tICcuL3JlbGllZk5vZGVDbGFzc2VzLmpzJztcblxuY2xhc3MgUmVsaWVmTm9kZSB7XG5cblx0Y29uc3RydWN0b3IoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApIHtcblxuXHRcdHRoaXMuaXNSZWxpZWZOb2RlID0gdHJ1ZTtcblxuXHRcdHRoaXMubmFtZSA9IG5hbWU7XG5cdFx0dGhpcy5wYXJhbWV0ZXJWYWx1ZXMgPSBwYXJhbWV0ZXJWYWx1ZXM7XG5cblx0XHRpZiAoIHBhcmFtZXRlclNpZ25hdHVyZXMubGVuZ3RoID4gMCAmJiBwYXJhbWV0ZXJTaWduYXR1cmVzWyAwIF0ubmFtZSA9PT0gJ01vZGUnICkge1xuXG5cdFx0XHR0aGlzLm1vZGUgPSBwYXJhbWV0ZXJWYWx1ZXNbIDAgXTtcblx0XHRcdHN3aXRjaCAoIHRoaXMubW9kZSApIHtcblxuXHRcdFx0XHRjYXNlIENvbnN0YW50cy5SRUxJRUY6XG5cdFx0XHRcdFx0dGhpcy5jZWlsID0gMTtcblx0XHRcdFx0XHR0aGlzLmZsb29yID0gMDtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIENvbnN0YW50cy5FTUJPU1M6XG5cdFx0XHRcdFx0dGhpcy5jZWlsID0gMDtcblx0XHRcdFx0XHR0aGlzLmZsb29yID0gLSAxO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgQ29uc3RhbnRzLlJFTElFRl9FTUJPU1M6XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dGhpcy5jZWlsID0gMTtcblx0XHRcdFx0XHR0aGlzLmZsb29yID0gLSAxO1xuXHRcdFx0XHRcdGJyZWFrO1xyXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0dGhpcy5jb250ZXh0ID0gY29udGV4dDtcblxyXG5cdH1cblxuXHRldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICkge1xuXG5cdFx0cmV0dXJuIDA7XG5cblx0fVxuXG5cdGlzVmFsaWQoKSB7XG5cblx0XHQvLyBSZXR1cm5zIG51bGwgb24gc3VjY2VzcyBvciBlcnJvciBzdHJpbmdcblxuXHRcdGNvbnN0IHJlbGllZk5vZGVDbGFzcyA9IHJlbGllZk5vZGVDbGFzc2VzWyB0aGlzLmNsYXNzTmFtZSBdO1xuXG5cdFx0aWYgKCAhIHJlbGllZk5vZGVDbGFzcyApIHJldHVybiBcIlVua25vd24gbm9kZSBjbGFzcyAnXCIgKyB0aGlzLmNsYXNzTmFtZSArIFwiJy5cIjtcblxuXHRcdGlmICggcmVsaWVmTm9kZUNsYXNzLnBhcmFtZXRlcnMubGVuZ3RoICE9PSB0aGlzLnBhcmFtZXRlclZhbHVlcy5sZW5ndGggKSB7XG5cblx0XHRcdHJldHVybiBcIk5vZGUgb2YgY2xhc3MgJ1wiICtcblx0XHRcdFx0dGhpcy5jbGFzc05hbWUgKyBcIicgaW5pdGVkIHdpdGggd3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50cyAoZXhwZWN0ZWQgXCIgKyByZWxpZWZOb2RlQ2xhc3MucGFyYW1ldGVycy5sZW5ndGggK1xuXHRcdFx0XHRcIiwgYnV0IFwiICsgdGhpcy5wYXJhbWV0ZXJWYWx1ZXMubGVuZ3RoICsgXCIgd2VyZSBwcm92aWRlZClcIjtcblxuXHRcdH1cblxuXHRcdGZvciAoIGxldCBpID0gMCwgaWwgPSByZWxpZWZOb2RlQ2xhc3MucGFyYW1ldGVycy5sZW5ndGg7IGkgPCBpbDsgaSArKyApIHtcblxuXHRcdFx0Y29uc3QgZXJyID0gdGhpcy5pc1BhcmFtZXRlclZhbGlkKCByZWxpZWZOb2RlQ2xhc3MucGFyYW1ldGVyc1sgaSBdLCB0aGlzLnBhcmFtZXRlclZhbHVlc1sgaSBdICk7XG5cdFx0XHRpZiAoIGVyciApIHJldHVybiBcIihJbiBub2RlIGNsYXNzICdcIiArIHRoaXMuY2xhc3NOYW1lICsgXCInLCBwYXJhbWV0ZXIgXCIgKyBpICsgXCIpIC0tPiBcIiArIGVycjtcblxuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXG5cdH1cblxuXHRpc1BhcmFtZXRlclZhbGlkKCBwYXJhbWV0ZXJEZWZpbml0aW9uLCB2YWx1ZSApIHtcblxuXHRcdC8vIFJldHVybnMgbnVsbCBvbiBzdWNjZXNzIG9yIGVycm9yIHN0cmluZ1xuXG5cdFx0bGV0IGVyciA9IG51bGw7XG5cblx0XHRzd2l0Y2goIHBhcmFtZXRlckRlZmluaXRpb24udHlwZSApIHtcblxuXHRcdFx0Y2FzZSAnYm9vbGVhbic6XG5cdFx0XHRcdHJldHVybiAoIHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nICkgPyBudWxsIDogXCJFeHBlY3RlZCBib29sZWFuIHZhbHVlIGZvciAnXCIgKyBwYXJhbWV0ZXJEZWZpbml0aW9uLm5hbWUgKyBcIicgcGFyYW1ldGVyLCBidXQgJ1wiICsgKCB0eXBlb2YgdmFsdWUgKSArIFwiJyB3YXMgcHJvdmlkZWQuXCI7XG5cblx0XHRcdGNhc2UgJ3N0cmluZyc6XG5cdFx0XHRcdHJldHVybiAoIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgKSA/IG51bGwgOiBcIkV4cGVjdGVkIHN0cmluZyB2YWx1ZSBmb3IgJ1wiICsgcGFyYW1ldGVyRGVmaW5pdGlvbi5uYW1lICsgXCInIHBhcmFtZXRlciwgYnV0ICdcIiArICggdHlwZW9mIHZhbHVlICkgKyBcIicgd2FzIHByb3ZpZGVkLlwiO1xuXG5cdFx0XHRjYXNlICdudW1iZXInOlxuXHRcdFx0XHRyZXR1cm4gKCB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICkgPyBudWxsIDogXCJFeHBlY3RlZCBudW1iZXIgdmFsdWUgZm9yICdcIiArIHBhcmFtZXRlckRlZmluaXRpb24ubmFtZSArIFwiJyBwYXJhbWV0ZXIsIGJ1dCAnXCIgKyAoIHR5cGVvZiB2YWx1ZSApICsgXCInIHdhcyBwcm92aWRlZC5cIjtcblxuXHRcdFx0Y2FzZSAnbm9kZSc6XG5cdFx0XHRcdGlmICggISB2YWx1ZSB8fCAhIHZhbHVlLmlzUmVsaWVmTm9kZSApIHJldHVybiBcIkV4cGVjdGVkIG5vZGUgdmFsdWUsIGJ1dCAnXCIgKyAoIHR5cGVvZiB2YWx1ZSApICsgXCInIHdhcyBwcm92aWRlZC5cIjtcblx0XHRcdFx0ZXJyID0gdmFsdWUuaXNWYWxpZCgpO1xuXHRcdFx0XHRpZiAoIGVyciApIHJldHVybiBcIk5vZGUgcGFyYW1ldGVyICdcIiArIHBhcmFtZXRlckRlZmluaXRpb24ubmFtZSArIFwiJyBpcyBub3QgVmFsaWQ6IFwiICsgZXJyO1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdFx0Y2FzZSAnbm9kZWFycmF5Jzpcblx0XHRcdFx0aWYgKCAhIHZhbHVlIHx8ICEgQXJyYXkuaXNBcnJheSggdmFsdWUgKSApIHJldHVybiBcIkV4cGVjdGVkIG5vZGUgYXJyYXkgdmFsdWUsIGJ1dCAnXCIgKyAoIHR5cGVvZiB2YWx1ZSApICsgXCInIHdhcyBwcm92aWRlZC5cIjtcblx0XHRcdFx0Zm9yICggbGV0IGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpICsrICkge1xuXG5cdFx0XHRcdFx0ZXJyID0gdmFsdWVbIGkgXS5pc1ZhbGlkKCk7XG5cdFx0XHRcdFx0aWYgKCBlcnIgKSByZXR1cm4gXCJOb2RlIHBhcmFtZXRlciAnXCIgKyBwYXJhbWV0ZXJEZWZpbml0aW9uLm5hbWUgKyBcIlsgXCIgKyBpICsgXCIgXScgaXMgbm90IFZhbGlkOiBcIiArIGVycjtcblxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXG5cdFx0XHRjYXNlICdpbWFnZSc6XG5cdFx0XHRcdC8vcmV0dXJuICggKCB2YWx1ZSAhPT0gbnVsbCApICYmICEgdmFsdWUuaXNJbWFnZSApID8gbnVsbCA6IFwiRXhwZWN0ZWQgaW1hZ2UgdmFsdWUgZm9yICdcIiArIHBhcmFtZXRlckRlZmluaXRpb24ubmFtZSArIFwiJyBwYXJhbWV0ZXIsIGJ1dCAnXCIgKyAoIHR5cGVvZiB2YWx1ZSApICsgXCInIHdhcyBwcm92aWRlZC5cIjtcblx0XHRcdFx0cmV0dXJuICggdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyApID8gbnVsbCA6IFwiRXhwZWN0ZWQgaW1hZ2UgbmFtZSBzdHJpbmcgdmFsdWUgZm9yICdcIiArIHBhcmFtZXRlckRlZmluaXRpb24ubmFtZSArIFwiJyBwYXJhbWV0ZXIsIGJ1dCAnXCIgKyAoIHR5cGVvZiB2YWx1ZSApICsgXCInIHdhcyBwcm92aWRlZC5cIjtcblxuXHRcdFx0Y2FzZSAncHJlc2V0Jzpcblx0XHRcdFx0aWYgKCAhIHZhbHVlIHx8ICEgdmFsdWUuaXNSZWxpZWZOb2RlICkgcmV0dXJuIFwiRXhwZWN0ZWQgcHJlc2V0IG5vZGUgdmFsdWUsIGJ1dCAnXCIgKyAoIHR5cGVvZiB2YWx1ZSApICsgXCInIHdhcyBwcm92aWRlZC5cIjtcblx0XHRcdFx0ZXJyID0gdmFsdWUuaXNWYWxpZCgpO1xuXHRcdFx0XHRpZiAoIGVyciApIHJldHVybiBcIlByZXNldCBub2RlIHBhcmFtZXRlciAnXCIgKyBwYXJhbWV0ZXJEZWZpbml0aW9uLm5hbWUgKyBcIicgaXMgbm90IFZhbGlkOiBcIiArIGVycjtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXG5cdFx0fVxuXG5cdH1cblxuXHRzdGF0aWMgbWFrZVJlbGllZlRyZWVGcm9tSlNPTigganNvbiwgY29udGV4dCApIHtcblxuXHRcdGZ1bmN0aW9uIG1ha2VOb2RlKCBqc29uICkge1xuXG5cdFx0XHRpZiAoICEganNvbiB8fCB0eXBlb2YganNvbiAhPT0gJ29iamVjdCcgKSByZXR1cm4gbnVsbDtcblx0XHRcdGNvbnN0IHJlbGllZkNsYXNzRGVmaW5pdGlvbiA9IHJlbGllZk5vZGVDbGFzc2VzWyBqc29uLmNsYXNzTmFtZSBdO1xuXHRcdFx0aWYgKCB0eXBlb2YgcmVsaWVmQ2xhc3NEZWZpbml0aW9uICE9PSAnb2JqZWN0JyApIHJldHVybiBudWxsO1xuXHRcdFx0Y29uc3QgY2xhc3NPYmplY3QgPSByZWxpZWZDbGFzc0RlZmluaXRpb24uY2xhc3NPYmplY3Q7XG5cdFx0XHRpZiAoICEgQXJyYXkuaXNBcnJheSgganNvbi5wYXJhbWV0ZXJWYWx1ZXMgKSApIHJldHVybiBudWxsO1xuXHRcdFx0Y29uc3QgcGFyYW1ldGVyVmFsdWVzID0gWyBdO1xuXHRcdFx0Zm9yICggbGV0IGkgPSAwLCBpbCA9IGpzb24ucGFyYW1ldGVyVmFsdWVzLmxlbmd0aDsgaSA8IGlsOyBpICsrICkge1xuXG5cdFx0XHRcdGNvbnN0IHBhcmFtZXRlclR5cGUgPSByZWxpZWZDbGFzc0RlZmluaXRpb24ucGFyYW1ldGVyc1sgaSBdLnR5cGU7XG5cblx0XHRcdFx0bGV0IHBhcmFtVmFsdWVKU09OID0ganNvbi5wYXJhbWV0ZXJWYWx1ZXNbIGkgXTtcblx0XHRcdFx0bGV0IHZhbHVlID0gcGFyYW1WYWx1ZUpTT047XG5cblx0XHRcdFx0c3dpdGNoICggcGFyYW1ldGVyVHlwZSApIHtcblxuXHRcdFx0XHRcdGNhc2UgJ25vZGUnOlxuXHRcdFx0XHRcdFx0aWYgKCBwYXJhbVZhbHVlSlNPTiAmJiB0eXBlb2YgcGFyYW1WYWx1ZUpTT04gPT09ICdvYmplY3QnICYmICEgcGFyYW1WYWx1ZUpTT04uaXNJbWFnZSAmJiAhIHBhcmFtVmFsdWVKU09OLnJlbGllZk5vZGVKU09OICkge1xuXG5cdFx0XHRcdFx0XHRcdHZhbHVlID0gbWFrZU5vZGUoIHBhcmFtVmFsdWVKU09OICk7XG5cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAnbm9kZWFycmF5Jzpcblx0XHRcdFx0XHRcdGlmICggcGFyYW1WYWx1ZUpTT04gJiYgQXJyYXkuaXNBcnJheSggcGFyYW1WYWx1ZUpTT04gKSApIHtcblxuXHRcdFx0XHRcdFx0XHR2YWx1ZSA9IFsgXTtcblx0XHRcdFx0XHRcdFx0Zm9yICggbGV0IGkgPSAwOyBpIDwgcGFyYW1WYWx1ZUpTT04ubGVuZ3RoOyBpICsrICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWUucHVzaCggbWFrZU5vZGUoIHBhcmFtVmFsdWVKU09OWyBpIF0gKSApO1xuXG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlICdwcmVzZXQnOlxuY29uc29sZS5sb2coIFwiYW1lbSAxXCIgKTtcblx0XHRcdFx0XHRcdGlmICggcGFyYW1WYWx1ZUpTT04gJiYgdHlwZW9mIHBhcmFtVmFsdWVKU09OID09PSAnc3RyaW5nJyApIHtcbmNvbnNvbGUubG9nKCBcImFtZW0gMlwiICk7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHByZXNldCA9IGNvbnRleHQucHJlc2V0c1sgcGFyYW1WYWx1ZUpTT04gXTtcblx0XHRcdFx0XHRcdFx0aWYgKCBwcmVzZXQgJiYgcHJlc2V0LnJlbGllZk5vZGVKU09OICkgdmFsdWUgPSBtYWtlTm9kZSggcHJlc2V0LnJlbGllZk5vZGVKU09OICk7XG5cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRwYXJhbWV0ZXJWYWx1ZXMucHVzaCggdmFsdWUgKTtcblxyXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBub2RlID0gbmV3IGNsYXNzT2JqZWN0KCBqc29uLm5hbWUsIHJlbGllZkNsYXNzRGVmaW5pdGlvbi5wYXJhbWV0ZXJzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKTtcblxuXHRcdFx0cmV0dXJuIG5vZGU7XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gbWFrZU5vZGUoIGpzb24gKTtcblxuXHR9XG5cbn1cblxuZXhwb3J0IHsgUmVsaWVmTm9kZSB9O1xuIiwiLypcbk1pbmNlIFNsaWNlclxuXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMjEgSnVhbiBKb3NlIEx1bmEgRXNwaW5vc2FcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuXG4qL1xuXG5pbXBvcnQgeyBSZWxpZWZOb2RlIH0gZnJvbSAnLi9SZWxpZWZOb2RlLmpzJztcblxuY2xhc3MgUmVsaWVmTm9kZUNvbnN0YW50IGV4dGVuZHMgUmVsaWVmTm9kZSB7XG5cblx0Y29uc3RydWN0b3IoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApIHtcblxuXHRcdHN1cGVyKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKTtcblxuXHRcdHRoaXMuY2xhc3NOYW1lID0gJ0NvbnN0YW50JztcblxuXHRcdHRoaXMudGhlQ29uc3RhbnQgPSBwYXJhbWV0ZXJWYWx1ZXNbIDAgXTtcblxuXHR9XG5cblx0ZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApIHsgcmV0dXJuIHRoaXMudGhlQ29uc3RhbnQ7IH1cblxufVxuXG5leHBvcnQgeyBSZWxpZWZOb2RlQ29uc3RhbnQgfTtcbiIsIi8qXG5NaW5jZSBTbGljZXJcblxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDIxIEp1YW4gSm9zZSBMdW5hIEVzcGlub3NhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cblxuKi9cblxuaW1wb3J0IHsgUmVsaWVmTm9kZSB9IGZyb20gJy4vUmVsaWVmTm9kZS5qcyc7XG5cbmNsYXNzIFJlbGllZk5vZGVJbWFnZVVWIGV4dGVuZHMgUmVsaWVmTm9kZSB7XG5cblx0Y29uc3RydWN0b3IoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApIHtcblxuXHRcdHN1cGVyKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKTtcblxuXHRcdHRoaXMuY2xhc3NOYW1lID0gJ0ltYWdlVVYnO1xuXG5cdFx0dGhpcy5pbWFnZVNpemVVID0gcGFyYW1ldGVyVmFsdWVzWyAxIF07XG5cdFx0dGhpcy5pbWFnZVNpemVWID0gcGFyYW1ldGVyVmFsdWVzWyAyIF07XG5cblx0XHR0aGlzLm9mZnNldFUgPSBwYXJhbWV0ZXJWYWx1ZXNbIDMgXTtcblx0XHR0aGlzLm9mZnNldFYgPSBwYXJhbWV0ZXJWYWx1ZXNbIDQgXTtcblxuXHRcdGNvbnN0IGltYWdlID0gdGhpcy5jb250ZXh0LmltYWdlc1sgcGFyYW1ldGVyVmFsdWVzWyA1IF0gXTtcblxuXHRcdHRoaXMuaW1hZ2VWYWxpZCA9ICggaW1hZ2UgIT0gbnVsbCApICYmIGltYWdlLmlzSW1hZ2UgJiYgKCBpbWFnZS5kYXRhICE9PSBudWxsICk7XG5cdFx0dGhpcy5pbWFnZURhdGEgPSB0aGlzLmltYWdlVmFsaWQgPyBpbWFnZS5kYXRhIDogbnVsbDtcblx0XHR0aGlzLndpZHRoID0gdGhpcy5pbWFnZVZhbGlkID8gaW1hZ2Uud2lkdGggOiBudWxsO1xuXHRcdHRoaXMuaGVpZ2h0ID0gdGhpcy5pbWFnZVZhbGlkID8gaW1hZ2UuaGVpZ2h0IDogbnVsbDtcblxuXHRcdHRoaXMucmFuZ2UgPSB0aGlzLmNlaWwgLSB0aGlzLmZsb29yO1xuXHRcdHRoaXMuZ3JheVNjYWxlQ29uc3RhbnQgPSB0aGlzLnJhbmdlIC8gMjU1O1xuXG5cdH1cblxuXHRldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICkge1xuXG5cdFx0aWYgKCAhIHRoaXMuaW1hZ2VWYWxpZCApIHJldHVybiAwO1xuXG5cdFx0Y29uc3QgdSA9ICggdXYueCAtIHRoaXMub2Zmc2V0VSApIC8gdGhpcy5pbWFnZVNpemVVO1xuXHRcdGNvbnN0IHYgPSAxIC0gKCB1di55IC0gdGhpcy5vZmZzZXRWICkgLyB0aGlzLmltYWdlU2l6ZVY7XG5cblx0XHRpZiAoIHUgPCAwIHx8IHUgPiAxIHx8IHYgPCAwIHx8IHYgPiAxICkgcmV0dXJuIDA7XG5cblx0XHRjb25zdCBwID0gTWF0aC5mbG9vciggdiAqIHRoaXMuaGVpZ2h0ICkgKiB0aGlzLndpZHRoICsgTWF0aC5mbG9vciggdSAqIHRoaXMud2lkdGggKTtcblxuXHRcdHJldHVybiB0aGlzLmltYWdlRGF0YVsgcCBdICogdGhpcy5ncmF5U2NhbGVDb25zdGFudCArIHRoaXMuZmxvb3I7XG5cblx0fVxuXG59XG5cbmV4cG9ydCB7IFJlbGllZk5vZGVJbWFnZVVWIH07XG4iLCIvKlxuTWluY2UgU2xpY2VyXG5cbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAyMSBKdWFuIEpvc2UgTHVuYSBFc3Bpbm9zYVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuU09GVFdBUkUuXG5cbiovXG5cbmltcG9ydCB7IFJlbGllZk5vZGUgfSBmcm9tICcuL1JlbGllZk5vZGUuanMnO1xuXG5jbGFzcyBSZWxpZWZOb2RlQ2VsbCBleHRlbmRzIFJlbGllZk5vZGUge1xuXG5cdGNvbnN0cnVjdG9yKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKSB7XG5cblx0XHRzdXBlciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICk7XG5cblx0XHR0aGlzLnNpemVVID0gcGFyYW1ldGVyVmFsdWVzWyAxIF07XG5cdFx0dGhpcy5zaXplViA9IHBhcmFtZXRlclZhbHVlc1sgMiBdO1xuXHJcblx0fVxuXG5cdHN0YXRpYyBjb29yZGluYXRlVG9DZWxsKCB4LCBzaXplLCBub3JtYWwgKSB7XG5cblx0XHRyZXR1cm4gKCAoIHggJSBzaXplICkgLyBzaXplIC0gMC41ICkgKiAyO1xuXG5cdH1cblxufVxuXG5leHBvcnQgeyBSZWxpZWZOb2RlQ2VsbCB9O1xuIiwiLypcbk1pbmNlIFNsaWNlclxuXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMjEgSnVhbiBKb3NlIEx1bmEgRXNwaW5vc2FcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuXG4qL1xuXG5pbXBvcnQgeyBSZWxpZWZOb2RlQ2VsbCB9IGZyb20gJy4vUmVsaWVmTm9kZUNlbGwuanMnO1xuXG5jbGFzcyBSZWxpZWZOb2RlSW1hZ2VUaWxlZFVWIGV4dGVuZHMgUmVsaWVmTm9kZUNlbGwge1xuXG5cdGNvbnN0cnVjdG9yKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKSB7XG5cblx0XHRzdXBlciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICk7XG5cblx0XHR0aGlzLmNsYXNzTmFtZSA9ICdJbWFnZVRpbGVkVVYnO1xuXG5cdFx0dGhpcy5pbWFnZVNpemVVID0gcGFyYW1ldGVyVmFsdWVzWyAzIF07XG5cdFx0dGhpcy5pbWFnZVNpemVWID0gcGFyYW1ldGVyVmFsdWVzWyA0IF07XG5cblx0XHR0aGlzLm9mZnNldFUgPSBwYXJhbWV0ZXJWYWx1ZXNbIDUgXTtcblx0XHR0aGlzLm9mZnNldFYgPSBwYXJhbWV0ZXJWYWx1ZXNbIDYgXTtcblxuXHRcdGNvbnN0IGltYWdlID0gdGhpcy5jb250ZXh0LmltYWdlc1sgcGFyYW1ldGVyVmFsdWVzWyA3IF0gXTtcblxuXHRcdHRoaXMuaW1hZ2VWYWxpZCA9ICggaW1hZ2UgIT0gbnVsbCApICYmIGltYWdlLmlzSW1hZ2UgJiYgKCBpbWFnZS5kYXRhICE9PSBudWxsICk7XG5cdFx0dGhpcy5pbWFnZURhdGEgPSB0aGlzLmltYWdlVmFsaWQgPyBpbWFnZS5kYXRhIDogbnVsbDtcblx0XHR0aGlzLndpZHRoID0gdGhpcy5pbWFnZVZhbGlkID8gaW1hZ2Uud2lkdGggOiBudWxsO1xuXHRcdHRoaXMuaGVpZ2h0ID0gdGhpcy5pbWFnZVZhbGlkID8gaW1hZ2UuaGVpZ2h0IDogbnVsbDtcblxuXHRcdHRoaXMucmFuZ2UgPSB0aGlzLmNlaWwgLSB0aGlzLmZsb29yO1xuXHRcdHRoaXMuZ3JheVNjYWxlQ29uc3RhbnQgPSB0aGlzLnJhbmdlIC8gMjU1O1xuXG5cdH1cblxuXHRldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICkge1xuXG5cdFx0aWYgKCAhIHRoaXMuaW1hZ2VWYWxpZCApIHJldHVybiAwO1xuXG5cdFx0Y29uc3Qgc2l6ZVUgPSB0aGlzLnNpemVVLmV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKTtcblx0XHRjb25zdCBzaXplViA9IHRoaXMuc2l6ZVYuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApO1xuXG5cdFx0Y29uc3QgdSA9ICggUmVsaWVmTm9kZUNlbGwuY29vcmRpbmF0ZVRvQ2VsbCggdXYueCwgc2l6ZVUgKSAtIHRoaXMub2Zmc2V0VSApIC8gdGhpcy5pbWFnZVNpemVVO1xuXHRcdGNvbnN0IHYgPSAxIC0gKCBSZWxpZWZOb2RlQ2VsbC5jb29yZGluYXRlVG9DZWxsKCB1di55LCBzaXplViApIC0gdGhpcy5vZmZzZXRWICkgLyB0aGlzLmltYWdlU2l6ZVY7XG5cblx0XHRpZiAoIHUgPCAwIHx8IHUgPiAxIHx8IHYgPCAwIHx8IHYgPiAxICkgcmV0dXJuIDA7XG5cblx0XHRjb25zdCBwID0gTWF0aC5mbG9vciggdiAqIHRoaXMuaGVpZ2h0ICkgKiB0aGlzLndpZHRoICsgTWF0aC5mbG9vciggdSAqIHRoaXMud2lkdGggKTtcblxuXHRcdHJldHVybiB0aGlzLmltYWdlRGF0YVsgcCBdICogdGhpcy5ncmF5U2NhbGVDb25zdGFudCArIHRoaXMuZmxvb3I7XG5cblx0fVxuXG59XG5cbmV4cG9ydCB7IFJlbGllZk5vZGVJbWFnZVRpbGVkVVYgfTtcbiIsIi8qXG5NaW5jZSBTbGljZXJcblxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDIxIEp1YW4gSm9zZSBMdW5hIEVzcGlub3NhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cblxuKi9cblxuaW1wb3J0IHsgUmVsaWVmTm9kZSB9IGZyb20gJy4vUmVsaWVmTm9kZS5qcyc7XG5cbmNsYXNzIFJlbGllZk5vZGVBZGQgZXh0ZW5kcyBSZWxpZWZOb2RlIHtcblxuXHRjb25zdHJ1Y3RvciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICkge1xuXG5cdFx0c3VwZXIoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApO1xuXG5cdFx0dGhpcy5jbGFzc05hbWUgPSAnQWRkJztcblxuXHRcdHRoaXMuYU5vZGUgPSBwYXJhbWV0ZXJWYWx1ZXNbIDAgXTtcblx0XHR0aGlzLmJOb2RlID0gcGFyYW1ldGVyVmFsdWVzWyAxIF07XG5cblx0fVxuXG5cdGV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKSB7XG5cblx0XHRyZXR1cm4gdGhpcy5hTm9kZS5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICApICsgdGhpcy5iTm9kZS5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICApO1xuXG5cdH1cblxufVxuXG5leHBvcnQgeyBSZWxpZWZOb2RlQWRkIH07XG4iLCIvKlxuTWluY2UgU2xpY2VyXG5cbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAyMSBKdWFuIEpvc2UgTHVuYSBFc3Bpbm9zYVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuU09GVFdBUkUuXG5cbiovXG5cbmltcG9ydCB7IFJlbGllZk5vZGUgIH0gZnJvbSAnLi9SZWxpZWZOb2RlLmpzJztcblxuY2xhc3MgUmVsaWVmTm9kZU5lZ2F0ZSBleHRlbmRzIFJlbGllZk5vZGUge1xuXG5cdGNvbnN0cnVjdG9yKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKSB7XG5cblx0XHRzdXBlciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICk7XG5cblx0XHR0aGlzLmNsYXNzTmFtZSA9ICdOZWdhdGUnO1xuXG5cdFx0dGhpcy5hTm9kZSA9IHBhcmFtZXRlclZhbHVlc1sgMCBdO1xuXG5cdH1cblxuXHRldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICkge1xuXG5cdFx0cmV0dXJuIC0gdGhpcy5hTm9kZS5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICk7XG5cblx0fVxuXG59XG5cbmV4cG9ydCB7IFJlbGllZk5vZGVOZWdhdGUgfTtcbiIsIi8qXG5NaW5jZSBTbGljZXJcblxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDIxIEp1YW4gSm9zZSBMdW5hIEVzcGlub3NhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cblxuKi9cblxuaW1wb3J0IHsgUmVsaWVmTm9kZSB9IGZyb20gJy4vUmVsaWVmTm9kZS5qcyc7XG5cbmNsYXNzIFJlbGllZk5vZGVNdWx0aXBseSBleHRlbmRzIFJlbGllZk5vZGUge1xuXG5cdGNvbnN0cnVjdG9yKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKSB7XG5cblx0XHRzdXBlciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICk7XG5cblx0XHR0aGlzLmNsYXNzTmFtZSA9ICdNdWx0aXBseSc7XG5cblx0XHR0aGlzLmFOb2RlID0gcGFyYW1ldGVyVmFsdWVzWyAwIF07XG5cdFx0dGhpcy5iTm9kZSA9IHBhcmFtZXRlclZhbHVlc1sgMSBdO1xuXG5cdH1cblxuXHRldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICkge1xuXG5cdFx0cmV0dXJuIHRoaXMuYU5vZGUuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApICogdGhpcy5iTm9kZS5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICk7XG5cblx0fVxuXG59XG5cbmV4cG9ydCB7IFJlbGllZk5vZGVNdWx0aXBseSB9O1xuIiwiLypcbk1pbmNlIFNsaWNlclxuXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMjEgSnVhbiBKb3NlIEx1bmEgRXNwaW5vc2FcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuXG4qL1xuXG5pbXBvcnQgeyBSZWxpZWZOb2RlIH0gZnJvbSAnLi9SZWxpZWZOb2RlLmpzJztcblxuY2xhc3MgUmVsaWVmTm9kZURpdmlkZSBleHRlbmRzIFJlbGllZk5vZGUge1xuXG5cdGNvbnN0cnVjdG9yKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKSB7XG5cblx0XHRzdXBlciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICk7XG5cblx0XHR0aGlzLmNsYXNzTmFtZSA9ICdEaXZpZGUnO1xuXG5cdFx0dGhpcy5hTm9kZSA9IHBhcmFtZXRlclZhbHVlc1sgMCBdO1xuXHRcdHRoaXMuYk5vZGUgPSBwYXJhbWV0ZXJWYWx1ZXNbIDEgXTtcblxuXHR9XG5cblx0ZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApIHtcblxuXHRcdHJldHVybiB0aGlzLmFOb2RlLmV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKSAvIHRoaXMuYk5vZGUuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApO1xuXG5cdH1cblxufVxuXG5leHBvcnQgeyBSZWxpZWZOb2RlRGl2aWRlIH07XG4iLCIvKlxuTWluY2UgU2xpY2VyXG5cbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAyMSBKdWFuIEpvc2UgTHVuYSBFc3Bpbm9zYVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuU09GVFdBUkUuXG5cbiovXG5cbmltcG9ydCB7IFJlbGllZk5vZGUgfSBmcm9tICcuL1JlbGllZk5vZGUuanMnO1xuXG5jbGFzcyBSZWxpZWZOb2RlUG93ZXIgZXh0ZW5kcyBSZWxpZWZOb2RlIHtcblxuXHRjb25zdHJ1Y3RvciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICkge1xuXG5cdFx0c3VwZXIoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApO1xuXG5cdFx0dGhpcy5jbGFzc05hbWUgPSAnUG93ZXInO1xuXG5cdFx0dGhpcy5hTm9kZSA9IHBhcmFtZXRlclZhbHVlc1sgMCBdO1xuXHRcdHRoaXMuYk5vZGUgPSBwYXJhbWV0ZXJWYWx1ZXNbIDEgXTtcblxuXHR9XG5cblx0ZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApIHtcblxuXHRcdHJldHVybiBNYXRoLnBvdyggdGhpcy5hTm9kZS5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICksIHRoaXMuYk5vZGUuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApICk7XG5cblx0fVxuXG59XG5cbmV4cG9ydCB7IFJlbGllZk5vZGVQb3dlciB9O1xuIiwiLypcbk1pbmNlIFNsaWNlclxuXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMjEgSnVhbiBKb3NlIEx1bmEgRXNwaW5vc2FcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuXG4qL1xuXG5pbXBvcnQgeyBSZWxpZWZOb2RlICB9IGZyb20gJy4vUmVsaWVmTm9kZS5qcyc7XG5cbmNsYXNzIFJlbGllZk5vZGVTaW4gZXh0ZW5kcyBSZWxpZWZOb2RlIHtcblxuXHRjb25zdHJ1Y3RvciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICkge1xuXG5cdFx0c3VwZXIoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApO1xuXG5cdFx0dGhpcy5jbGFzc05hbWUgPSAnU2luJztcblxuXHRcdHRoaXMuYU5vZGUgPSBwYXJhbWV0ZXJWYWx1ZXNbIDEgXTtcblxuXHRcdHRoaXMucmFuZ2UgPSB0aGlzLmNlaWwgLSB0aGlzLmZsb29yO1xuXG5cdH1cblxuXHRldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICkge1xuXG5cdFx0cmV0dXJuIHRoaXMuZmxvb3IgKyB0aGlzLnJhbmdlICogKCAwLjUgKiBNYXRoLnNpbiggdGhpcy5hTm9kZS5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICkgKSArIDAuNSApO1xuXG5cdH1cblxufVxuXG5leHBvcnQgeyBSZWxpZWZOb2RlU2luIH07XG4iLCIvKlxuTWluY2UgU2xpY2VyXG5cbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAyMSBKdWFuIEpvc2UgTHVuYSBFc3Bpbm9zYVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuU09GVFdBUkUuXG5cbiovXG5cbmltcG9ydCB7IFJlbGllZk5vZGUgIH0gZnJvbSAnLi9SZWxpZWZOb2RlLmpzJztcblxuY2xhc3MgUmVsaWVmTm9kZUNvcyBleHRlbmRzIFJlbGllZk5vZGUge1xuXG5cdGNvbnN0cnVjdG9yKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKSB7XG5cblx0XHRzdXBlciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICk7XG5cblx0XHR0aGlzLmNsYXNzTmFtZSA9ICdDb3MnO1xuXG5cdFx0dGhpcy5hTm9kZSA9IHBhcmFtZXRlclZhbHVlc1sgMCBdO1xuXG5cdH1cblxuXHRldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICkge1xuXG5cdFx0cmV0dXJuIHRoaXMuZmxvb3IgKyB0aGlzLnJhbmdlICogKCAwLjUgKiBNYXRoLmNvcyggdGhpcy5hTm9kZS5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICkgKSArIDAuNSApO1xuXG5cdH1cblxufVxuXG5leHBvcnQgeyBSZWxpZWZOb2RlQ29zIH07XG4iLCIvKlxuTWluY2UgU2xpY2VyXG5cbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAyMSBKdWFuIEpvc2UgTHVuYSBFc3Bpbm9zYVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuU09GVFdBUkUuXG5cbiovXG5cbmltcG9ydCB7IFJlbGllZk5vZGUgfSBmcm9tICcuL1JlbGllZk5vZGUuanMnO1xuXG5jbGFzcyBSZWxpZWZOb2RlTWl4IGV4dGVuZHMgUmVsaWVmTm9kZSB7XG5cblx0Y29uc3RydWN0b3IoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApIHtcblxuXHRcdHN1cGVyKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKTtcblxuXHRcdHRoaXMuY2xhc3NOYW1lID0gJ01peCc7XG5cblx0XHR0aGlzLmFOb2RlID0gcGFyYW1ldGVyVmFsdWVzWyAwIF07XG5cdFx0dGhpcy5iTm9kZSA9IHBhcmFtZXRlclZhbHVlc1sgMSBdO1xuXHRcdHRoaXMuZmFjdG9yTm9kZSA9IHBhcmFtZXRlclZhbHVlc1sgMiBdO1xuXG5cdH1cblxuXHRldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICkge1xuXG5cdFx0Y29uc3QgZmFjdG9yID0gTWF0aC5taW4oIDEsIE1hdGgubWF4KCAwLCB0aGlzLmZhY3Rvck5vZGUuZXZhbHVhdGUoIHV2LCBwb3MgKSApICk7XG5cblx0XHRyZXR1cm4gZmFjdG9yICogdGhpcy5hTm9kZS5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICkgKyAoIDEgLSBmYWN0b3IgKSAqIHRoaXMuYk5vZGUuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApO1xuXG5cdH1cblxufVxuXG5leHBvcnQgeyBSZWxpZWZOb2RlTWl4IH07XG4iLCIvKlxuTWluY2UgU2xpY2VyXG5cbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAyMSBKdWFuIEpvc2UgTHVuYSBFc3Bpbm9zYVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuU09GVFdBUkUuXG5cbiovXG5cbmltcG9ydCB7IFJlbGllZk5vZGUgfSBmcm9tICcuL1JlbGllZk5vZGUuanMnO1xuXG5jbGFzcyBSZWxpZWZOb2RlTWluIGV4dGVuZHMgUmVsaWVmTm9kZSB7XG5cblx0Y29uc3RydWN0b3IoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApIHtcblxuXHRcdHN1cGVyKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKTtcblxuXHRcdHRoaXMuY2xhc3NOYW1lID0gJ01pbic7XG5cblx0XHR0aGlzLmFOb2RlID0gcGFyYW1ldGVyVmFsdWVzWyAwIF07XG5cdFx0dGhpcy5iTm9kZSA9IHBhcmFtZXRlclZhbHVlc1sgMSBdO1xuXG5cdH1cblxuXHRldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICkge1xuXG5cdFx0cmV0dXJuIE1hdGgubWluKCB0aGlzLmFOb2RlLmV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKSwgdGhpcy5iTm9kZS5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICkgKTtcblxuXHR9XG5cbn1cblxuZXhwb3J0IHsgUmVsaWVmTm9kZU1pbiB9O1xuIiwiLypcbk1pbmNlIFNsaWNlclxuXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMjEgSnVhbiBKb3NlIEx1bmEgRXNwaW5vc2FcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuXG4qL1xuXG5pbXBvcnQgeyBSZWxpZWZOb2RlIH0gZnJvbSAnLi9SZWxpZWZOb2RlLmpzJztcblxuY2xhc3MgUmVsaWVmTm9kZU1heCBleHRlbmRzIFJlbGllZk5vZGUge1xuXG5cdGNvbnN0cnVjdG9yKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKSB7XG5cblx0XHRzdXBlciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICk7XG5cblx0XHR0aGlzLmNsYXNzTmFtZSA9ICdNYXgnO1xuXG5cdFx0dGhpcy5hTm9kZSA9IHBhcmFtZXRlclZhbHVlc1sgMCBdO1xuXHRcdHRoaXMuYk5vZGUgPSBwYXJhbWV0ZXJWYWx1ZXNbIDEgXTtcblxuXHR9XG5cblx0ZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApIHtcblxuXHRcdHJldHVybiBNYXRoLm1heCggdGhpcy5hTm9kZS5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICksIHRoaXMuYk5vZGUuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApICk7XG5cblx0fVxuXG59XG5cbmV4cG9ydCB7IFJlbGllZk5vZGVNYXggfTtcbiIsIi8qXG5NaW5jZSBTbGljZXJcblxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDIxIEp1YW4gSm9zZSBMdW5hIEVzcGlub3NhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cblxuKi9cblxuaW1wb3J0IHsgUmVsaWVmTm9kZSB9IGZyb20gJy4vUmVsaWVmTm9kZS5qcyc7XG5cbmNsYXNzIFJlbGllZk5vZGVMZXNzVGhhbiBleHRlbmRzIFJlbGllZk5vZGUge1xuXG5cdGNvbnN0cnVjdG9yKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKSB7XG5cblx0XHRzdXBlciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICk7XG5cblx0XHR0aGlzLmNsYXNzTmFtZSA9ICdMZXNzVGhhbic7XG5cblx0XHR0aGlzLmFOb2RlID0gcGFyYW1ldGVyVmFsdWVzWyAwIF07XG5cdFx0dGhpcy5iTm9kZSA9IHBhcmFtZXRlclZhbHVlc1sgMSBdO1xuXG5cdH1cblxuXHRldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICkge1xuXG5cdFx0cmV0dXJuICggdGhpcy5hTm9kZS5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICkgPCB0aGlzLmJOb2RlLmV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKSApID8gMSA6IDA7XG5cblx0fVxuXG59XG5cbmV4cG9ydCB7IFJlbGllZk5vZGVMZXNzVGhhbiB9O1xuIiwiLypcbk1pbmNlIFNsaWNlclxuXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMjEgSnVhbiBKb3NlIEx1bmEgRXNwaW5vc2FcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuXG4qL1xuXG5pbXBvcnQgeyBSZWxpZWZOb2RlIH0gZnJvbSAnLi9SZWxpZWZOb2RlLmpzJztcblxuY2xhc3MgUmVsaWVmTm9kZU5vdEJvdHRvbSBleHRlbmRzIFJlbGllZk5vZGUge1xuXG5cdGNvbnN0cnVjdG9yKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKSB7XG5cblx0XHRzdXBlciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICk7XG5cblx0XHR0aGlzLmNsYXNzTmFtZSA9ICdOb3RCb3R0b20nO1xuXG5cdH1cblxuXHRldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICkge1xuXG5cdFx0cmV0dXJuIG5vcm1hbC55ID49IDAgPyAxIDogMDtcblxuXHR9XG5cbn1cblxuZXhwb3J0IHsgUmVsaWVmTm9kZU5vdEJvdHRvbSB9O1xuIiwiLypcbk1pbmNlIFNsaWNlclxuXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMjEgSnVhbiBKb3NlIEx1bmEgRXNwaW5vc2FcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuXG4qL1xuXG5pbXBvcnQgeyBSZWxpZWZOb2RlIH0gZnJvbSAnLi9SZWxpZWZOb2RlLmpzJztcblxuY2xhc3MgUmVsaWVmTm9kZVF1YW50aXplIGV4dGVuZHMgUmVsaWVmTm9kZSB7XG5cblx0Y29uc3RydWN0b3IoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApIHtcblxuXHRcdHN1cGVyKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKTtcblxuXHRcdHRoaXMuY2xhc3NOYW1lID0gJ1F1YW50aXplJztcblxuXHRcdHRoaXMuYU5vZGUgPSBwYXJhbWV0ZXJWYWx1ZXNbIDEgXTtcblxuXHRcdHRoaXMuc2l6ZSA9IHBhcmFtZXRlclZhbHVlc1sgMiBdO1xuXG5cdFx0dGhpcy5yYW5nZSA9IHRoaXMuY2VpbCAtIHRoaXMuZmxvb3I7XG5cblx0fVxuXG5cdGV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKSB7XG5cblx0XHRjb25zdCB2YWx1ZSA9IHRoaXMuZmxvb3IgKyB0aGlzLnJhbmdlICogdGhpcy5hTm9kZS5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICk7XG5cblx0XHRjb25zdCBzaXplID0gdGhpcy5zaXplLmV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKTtcblxuXHRcdHJldHVybiB2YWx1ZSAtIHZhbHVlICUgc2l6ZTtcblxuXHR9XG5cbn1cblxuZXhwb3J0IHsgUmVsaWVmTm9kZVF1YW50aXplIH07XG4iLCIvKlxuTWluY2UgU2xpY2VyXG5cbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAyMSBKdWFuIEpvc2UgTHVuYSBFc3Bpbm9zYVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuU09GVFdBUkUuXG5cbiovXG5cbmltcG9ydCB7IFZlY3RvcjIgfSBmcm9tICd0aHJlZSc7XG5cbmltcG9ydCB7IFJlbGllZk5vZGUgfSBmcm9tICcuL1JlbGllZk5vZGUuanMnO1xuXG5jbGFzcyBSZWxpZWZOb2RlRXZhbHVhdGUgZXh0ZW5kcyBSZWxpZWZOb2RlIHtcblxuXHRjb25zdHJ1Y3RvciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICkge1xuXG5cdFx0c3VwZXIoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApO1xuXG5cdFx0dGhpcy5jbGFzc05hbWUgPSAnRXZhbHVhdGUnO1xuXG5cdFx0dGhpcy5hTm9kZSA9IHBhcmFtZXRlclZhbHVlc1sgMCBdO1xuXHRcdHRoaXMudU5vZGUgPSBwYXJhbWV0ZXJWYWx1ZXNbIDEgXTtcblx0XHR0aGlzLnZOb2RlID0gcGFyYW1ldGVyVmFsdWVzWyAyIF07XG5cblx0XHR0aGlzLnV2ID0gbmV3IFZlY3RvcjIoKTtcblxuXHR9XG5cblx0ZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApIHtcblxuXHRcdHRoaXMudXYuc2V0KFxuXHRcdFx0dGhpcy51Tm9kZS5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICksXG5cdFx0XHR0aGlzLnZOb2RlLmV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKVxuXHRcdCk7XG5cblx0XHRyZXR1cm4gdGhpcy5hTm9kZS5ldmFsdWF0ZSggdGhpcy51diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKTtcblxuXHR9XG5cbn1cblxuZXhwb3J0IHsgUmVsaWVmTm9kZUV2YWx1YXRlIH07XG4iLCIvKlxuTWluY2UgU2xpY2VyXG5cbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAyMSBKdWFuIEpvc2UgTHVuYSBFc3Bpbm9zYVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuU09GVFdBUkUuXG5cbiovXG5cbmltcG9ydCB7IFJlbGllZk5vZGUgfSBmcm9tICcuL1JlbGllZk5vZGUuanMnO1xuXG5jbGFzcyBSZWxpZWZOb2RlR2V0VSBleHRlbmRzIFJlbGllZk5vZGUge1xuXG5cdGNvbnN0cnVjdG9yKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKSB7XG5cblx0XHRzdXBlciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICk7XG5cblx0XHR0aGlzLmNsYXNzTmFtZSA9ICdHZXRVJztcblxuXHR9XG5cblx0ZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApIHtcblxuXHRcdHJldHVybiB1di54O1xuXG5cdH1cblxufVxuXG5leHBvcnQgeyBSZWxpZWZOb2RlR2V0VSB9O1xuIiwiLypcbk1pbmNlIFNsaWNlclxuXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMjEgSnVhbiBKb3NlIEx1bmEgRXNwaW5vc2FcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuXG4qL1xuXG5pbXBvcnQgeyBSZWxpZWZOb2RlIH0gZnJvbSAnLi9SZWxpZWZOb2RlLmpzJztcblxuY2xhc3MgUmVsaWVmTm9kZUdldFYgZXh0ZW5kcyBSZWxpZWZOb2RlIHtcblxuXHRjb25zdHJ1Y3RvciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICkge1xuXG5cdFx0c3VwZXIoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApO1xuXG5cdFx0dGhpcy5jbGFzc05hbWUgPSAnR2V0Vic7XG5cblx0fVxuXG5cdGV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKSB7XG5cblx0XHRyZXR1cm4gdXYueTtcblxuXHR9XG5cbn1cblxuZXhwb3J0IHsgUmVsaWVmTm9kZUdldFYgfTtcbiIsIi8qXG5NaW5jZSBTbGljZXJcblxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDIxIEp1YW4gSm9zZSBMdW5hIEVzcGlub3NhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cblxuKi9cblxuaW1wb3J0IHsgUmVsaWVmTm9kZSB9IGZyb20gJy4vUmVsaWVmTm9kZS5qcyc7XG5cbmNsYXNzIFJlbGllZk5vZGVHZXRYIGV4dGVuZHMgUmVsaWVmTm9kZSB7XG5cblx0Y29uc3RydWN0b3IoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApIHtcblxuXHRcdHN1cGVyKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKTtcblxuXHRcdHRoaXMuY2xhc3NOYW1lID0gJ0dldFgnO1xuXG5cdH1cblxuXHRldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICkge1xuXG5cdFx0cmV0dXJuIHBvcy54O1xuXG5cdH1cblxufVxuXG5leHBvcnQgeyBSZWxpZWZOb2RlR2V0WCB9O1xuIiwiLypcbk1pbmNlIFNsaWNlclxuXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMjEgSnVhbiBKb3NlIEx1bmEgRXNwaW5vc2FcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuXG4qL1xuXG5pbXBvcnQgeyBSZWxpZWZOb2RlIH0gZnJvbSAnLi9SZWxpZWZOb2RlLmpzJztcblxuY2xhc3MgUmVsaWVmTm9kZUdldFkgZXh0ZW5kcyBSZWxpZWZOb2RlIHtcblxuXHRjb25zdHJ1Y3RvciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICkge1xuXG5cdFx0c3VwZXIoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApO1xuXG5cdFx0dGhpcy5jbGFzc05hbWUgPSAnR2V0WSc7XG5cblx0fVxuXG5cdGV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKSB7XG5cblx0XHRyZXR1cm4gcG9zLnk7XG5cblx0fVxuXG59XG5cbmV4cG9ydCB7IFJlbGllZk5vZGVHZXRZIH07XG4iLCIvKlxuTWluY2UgU2xpY2VyXG5cbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAyMSBKdWFuIEpvc2UgTHVuYSBFc3Bpbm9zYVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuU09GVFdBUkUuXG5cbiovXG5cbmltcG9ydCB7IFJlbGllZk5vZGUgfSBmcm9tICcuL1JlbGllZk5vZGUuanMnO1xuXG5jbGFzcyBSZWxpZWZOb2RlR2V0WiBleHRlbmRzIFJlbGllZk5vZGUge1xuXG5cdGNvbnN0cnVjdG9yKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKSB7XG5cblx0XHRzdXBlciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICk7XG5cblx0XHR0aGlzLmNsYXNzTmFtZSA9ICdHZXRaJztcblxuXHR9XG5cblx0ZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApIHtcblxuXHRcdHJldHVybiBwb3MuejtcblxuXHR9XG5cbn1cblxuZXhwb3J0IHsgUmVsaWVmTm9kZUdldFogfTtcbiIsIi8qXG5NaW5jZSBTbGljZXJcblxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDIxIEp1YW4gSm9zZSBMdW5hIEVzcGlub3NhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cblxuKi9cblxuaW1wb3J0IHsgUmVsaWVmTm9kZUNlbGwgfSBmcm9tICcuL1JlbGllZk5vZGVDZWxsLmpzJztcblxuY2xhc3MgUmVsaWVmTm9kZUNoZWNrZXJlZCBleHRlbmRzIFJlbGllZk5vZGVDZWxsIHtcblxuXHRjb25zdHJ1Y3RvciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICkge1xuXG5cdFx0c3VwZXIoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApO1xuXG5cdFx0dGhpcy5jbGFzc05hbWUgPSAnQ2hlY2tlcmVkJztcblxuXHRcdHRoaXMuY2hlY2tlckZyYWN0aW9uVSA9IHBhcmFtZXRlclZhbHVlc1sgMyBdO1xuXHRcdHRoaXMuY2hlY2tlckZyYWN0aW9uViA9IHBhcmFtZXRlclZhbHVlc1sgNCBdO1xuXG5cdH1cblxuXHRldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICApIHtcblxuXHRcdGNvbnN0IGNoZWNrZXJGcmFjdGlvblUgPSB0aGlzLmNoZWNrZXJGcmFjdGlvblUuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCAgKTtcblx0XHRjb25zdCBjaGVja2VyRnJhY3Rpb25WID0gdGhpcy5jaGVja2VyRnJhY3Rpb25WLmV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggICk7XG5cblx0XHRjb25zdCBzaXplVSA9IHRoaXMuc2l6ZVUuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCAgKTtcblx0XHRjb25zdCBzaXplViA9IHRoaXMuc2l6ZVYuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCAgKTtcblxuXHRcdGNvbnN0IHJhaXNlZFUgPSBSZWxpZWZOb2RlQ2VsbC5jb29yZGluYXRlVG9DZWxsKCB1di54LCBzaXplVSApID49IGNoZWNrZXJGcmFjdGlvblU7XG5cdFx0Y29uc3QgcmFpc2VkViA9IFJlbGllZk5vZGVDZWxsLmNvb3JkaW5hdGVUb0NlbGwoIHV2LnksIHNpemVWICkgPj0gY2hlY2tlckZyYWN0aW9uVjtcblxuXHRcdHJldHVybiByYWlzZWRVICE9PSByYWlzZWRWID8gdGhpcy5jZWlsIDogdGhpcy5mbG9vcjtcblxuXHR9XG5cbn1cblxuZXhwb3J0IHsgUmVsaWVmTm9kZUNoZWNrZXJlZCB9O1xuIiwiLypcbk1pbmNlIFNsaWNlclxuXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMjEgSnVhbiBKb3NlIEx1bmEgRXNwaW5vc2FcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuXG4qL1xuXG5pbXBvcnQgeyBSZWxpZWZOb2RlQ2VsbCB9IGZyb20gJy4vUmVsaWVmTm9kZUNlbGwuanMnO1xuXG5jbGFzcyBSZWxpZWZOb2RlVGlsZXMgZXh0ZW5kcyBSZWxpZWZOb2RlQ2VsbCB7XG5cblx0Y29uc3RydWN0b3IoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApIHtcblxuXHRcdHN1cGVyKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKTtcblxuXHRcdHRoaXMuY2xhc3NOYW1lID0gJ1RpbGVzJztcblxuXHRcdHRoaXMuYmV2ZWxGcmFjdGlvbiA9IHBhcmFtZXRlclZhbHVlc1sgMyBdO1xuXG5cdFx0dGhpcy5hbHRlcm5hdGVkQnJpY2tzID0gcGFyYW1ldGVyVmFsdWVzWyA0IF07XG5cblx0XHR0aGlzLnJhbmdlID0gdGhpcy5jZWlsIC0gdGhpcy5mbG9vcjtcblxyXG5cdH1cblxuXHRldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICkge1xuXG5cdFx0Y29uc3QgYmV2ZWxGcmFjdGlvbiA9IHRoaXMuYmV2ZWxGcmFjdGlvbi5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICk7XG5cdFx0Y29uc3QgdGlsZUZyYWN0aW9uID0gMSAtIGJldmVsRnJhY3Rpb247XG5cblx0XHRjb25zdCBzaXplVSA9IHRoaXMuc2l6ZVUuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApO1xuXHRcdGNvbnN0IHNpemVWID0gdGhpcy5zaXplVi5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICk7XG5cblx0XHRsZXQgdSA9IHV2Lng7XG5cblx0XHRpZiAoIHRoaXMuYWx0ZXJuYXRlZEJyaWNrcyApIHtcblxuXHRcdFx0Y29uc3QgYnJpY2tSb3cgPSBNYXRoLmZsb29yKCB1di55IC8gc2l6ZVYgKTtcblx0XHRcdGlmICggYnJpY2tSb3cgJiAxICkgdSAtPSAwLjUgKiBzaXplVTtcblxuXHRcdFx0dSA9IE1hdGguYWJzKCBSZWxpZWZOb2RlQ2VsbC5jb29yZGluYXRlVG9DZWxsKCBNYXRoLmFicyggdSApLCBzaXplVSApICk7XG5cblx0XHR9XG5cdFx0ZWxzZSB1ID0gTWF0aC5hYnMoIFJlbGllZk5vZGVDZWxsLmNvb3JkaW5hdGVUb0NlbGwoIHUsIHNpemVVICkgKTtcblxuXHRcdGNvbnN0IHYgPSBNYXRoLmFicyggUmVsaWVmTm9kZUNlbGwuY29vcmRpbmF0ZVRvQ2VsbCggdXYueSwgc2l6ZVYgKSApO1xuXG5cdFx0Y29uc3QgYSA9IHNpemVVIC8gc2l6ZVY7XG5cdFx0aWYgKCB1IDwgdGlsZUZyYWN0aW9uICYmIHYgPCAxIC0gYmV2ZWxGcmFjdGlvbiAqIGEgKSByZXR1cm4gdGhpcy5jZWlsO1xuXG5cdFx0Y29uc3QgdkxpbmUgPSAxIC0gYSArIGEgKiB1O1xuXG5cdFx0aWYgKCB2IDwgdkxpbmUgKSB7XG5cblx0XHRcdHJldHVybiAtIHRoaXMucmFuZ2UgKiAoIHUgLSAxICsgYmV2ZWxGcmFjdGlvbiApIC8gYmV2ZWxGcmFjdGlvbiArIHRoaXMuY2VpbDtcblxuXHRcdH1cblx0XHRlbHNlIHtcblxuXHRcdFx0cmV0dXJuIC0gdGhpcy5yYW5nZSAqICggdiAtIDEgKyBiZXZlbEZyYWN0aW9uICogYSApIC8gKCBiZXZlbEZyYWN0aW9uICogYSApICsgdGhpcy5jZWlsO1xuXG5cdFx0fVxuXG5cdH1cblxufVxuXG5leHBvcnQgeyBSZWxpZWZOb2RlVGlsZXMgfTtcbiIsIi8qXG5NaW5jZSBTbGljZXJcblxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDIxIEp1YW4gSm9zZSBMdW5hIEVzcGlub3NhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cblxuKi9cblxuaW1wb3J0IHsgUmVsaWVmTm9kZSB9IGZyb20gJy4vUmVsaWVmTm9kZS5qcyc7XG5cbmNsYXNzIFJlbGllZk5vZGVTaW1wbGV4VVYgZXh0ZW5kcyBSZWxpZWZOb2RlIHtcblxuXHRjb25zdHJ1Y3RvciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICkge1xuXG5cdFx0c3VwZXIoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApO1xuXG5cdFx0dGhpcy5jbGFzc05hbWUgPSAnU2ltcGxleFVWJztcblxuXHRcdHRoaXMuc2NhbGVVID0gcGFyYW1ldGVyVmFsdWVzWyAxIF07XG5cdFx0dGhpcy5zY2FsZVYgPSBwYXJhbWV0ZXJWYWx1ZXNbIDIgXTtcblx0XHR0aGlzLnNpbXBsZXggPSBjb250ZXh0LnNpbXBsZXg7XG5cblx0XHR0aGlzLnJhbmdlID0gdGhpcy5jZWlsIC0gdGhpcy5mbG9vcjtcblxuXHR9XG5cblx0ZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApIHtcblxuXHRcdGNvbnN0IHNjYWxlVSA9IHRoaXMuc2NhbGVVLmV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKTtcblx0XHRjb25zdCBzY2FsZVYgPSB0aGlzLnNjYWxlVi5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICk7XG5cblx0XHRyZXR1cm4gdGhpcy5mbG9vciArIHRoaXMucmFuZ2UgKiAoIHRoaXMuc2ltcGxleC5ub2lzZSggc2NhbGVVICogdXYueCwgc2NhbGVWICogdXYueSApICogMC41ICsgMC41ICk7XG5cblx0fVxuXG59XG5cbmV4cG9ydCB7IFJlbGllZk5vZGVTaW1wbGV4VVYgfTtcbiIsIi8qXG5NaW5jZSBTbGljZXJcblxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDIxIEp1YW4gSm9zZSBMdW5hIEVzcGlub3NhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cblxuKi9cblxuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gJ3RocmVlJztcblxuaW1wb3J0IHsgUmVsaWVmTm9kZSB9IGZyb20gJy4vUmVsaWVmTm9kZS5qcyc7XG5cbmNsYXNzIFJlbGllZk5vZGVQZXJsaW5VViBleHRlbmRzIFJlbGllZk5vZGUge1xuXG5cdGNvbnN0cnVjdG9yKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKSB7XG5cblx0XHRzdXBlciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICk7XG5cblx0XHR0aGlzLmNsYXNzTmFtZSA9ICdQZXJsaW5VVic7XG5cblx0XHR0aGlzLm51bUl0ZXJhdGlvbnMgPSBwYXJhbWV0ZXJWYWx1ZXNbIDEgXTtcblx0XHR0aGlzLnNpemUgPSBwYXJhbWV0ZXJWYWx1ZXNbIDIgXTtcblx0XHR0aGlzLm11bHRTaXplID0gcGFyYW1ldGVyVmFsdWVzWyAzIF07XG5cdFx0dGhpcy5tdWx0Q29udHJpYnV0aW9uID0gcGFyYW1ldGVyVmFsdWVzWyA0IF07XG5cblx0XHR0aGlzLnNpbXBsZXggPSBjb250ZXh0LnNpbXBsZXg7XG5cblx0XHR0aGlzLnJhbmdlID0gdGhpcy5jZWlsIC0gdGhpcy5mbG9vcjtcblxuXHRcdHRoaXMudmVjMjEgPSBuZXcgVmVjdG9yMigpO1xuXG5cdH1cblxuXHRldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICkge1xuXG5cdFx0Y29uc3Qgc2l6ZSA9IHRoaXMuc2l6ZS5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICk7XG5cblx0XHRjb25zdCBtdWx0U2l6ZSA9IHRoaXMubXVsdFNpemUuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApO1xuXHRcdGNvbnN0IG11bHRDb250cmlidXRpb24gPSB0aGlzLm11bHRDb250cmlidXRpb24uZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApO1xuXG5cdFx0bGV0IHZhbHVlID0gMDtcblx0XHRsZXQgbWF4VmFsdWUgPSAwO1xuXHRcdGxldCBtdWx0Q29udHJpYiA9IDE7XG5cdFx0Y29uc3QgdmVjMjEgPSB0aGlzLnZlYzIxO1xuXHRcdHZlYzIxLnNldCggMC41LCAwLjUgKS5hZGQoIHV2ICkubXVsdGlwbHlTY2FsYXIoIHNpemUgKTtcblx0XHRmb3IgKCBsZXQgaSA9IDAsIGwgPSB0aGlzLm51bUl0ZXJhdGlvbnM7IGkgPCBsOyBpICsrICkge1xuXG5cdFx0XHR2ZWMyMS5tdWx0aXBseVNjYWxhciggbXVsdFNpemUgKTtcblx0XHRcdG11bHRDb250cmliICo9IG11bHRDb250cmlidXRpb247XG5cdFx0XHRtYXhWYWx1ZSArPSBtdWx0Q29udHJpYjtcblxuXHRcdFx0dmFsdWUgKz0gbXVsdENvbnRyaWIgKiB0aGlzLnNpbXBsZXgubm9pc2UoIHZlYzIxLngsIHZlYzIxLnkgKTtcblxuXHRcdH1cblxuXHRcdHZhbHVlIC89IG1heFZhbHVlO1xuXG5cdFx0cmV0dXJuIHRoaXMuZmxvb3IgKyB0aGlzLnJhbmdlICogKCB2YWx1ZSAqIDAuNSArIDAuNSApO1xuXG5cdH1cblxufVxuXG5leHBvcnQgeyBSZWxpZWZOb2RlUGVybGluVVYgfTtcblxuLypcbnZlYzIgcnVpZG8zZCggdmVjMyBwb3MsIGludCBudW1JdGVyYXRpb25zLCBmbG9hdCBzaXplLCBmbG9hdCBtdWx0U2l6ZSwgZmxvYXQgbXVsdENvbnRyaWJ1dGlvbiApXG57XG4gIC8vIE9idGFpbiBhIHZlYzIgbm9pc2UgKDAuLjEgaW4gdGhlIDIgZGltZW5zaW9ucykgYmFzZWQgb24gbW9kZWwgcG9zaXRpb25cbiAgZmxvYXQgbXVsdENvbnRyaWIgPSAxLjA7XG4gIGZsb2F0IG1heFZhbHVlID0gMC4wO1xuICB2ZWMyIG5vaXNlID0gdmVjMiggMC4wICk7XG4gIGZvciAoIGludCBpID0gMTsgaSA8PSBudW1JdGVyYXRpb25zOyBpKysgKSB7XG4gICAgc2l6ZSAqPSBtdWx0U2l6ZTtcbiAgICBtdWx0Q29udHJpYiAqPSBtdWx0Q29udHJpYnV0aW9uO1xuICAgIG1heFZhbHVlICs9IG11bHRDb250cmliO1xuICAgIHZlYzIgbiA9IHRleHR1cmUoIHNhbXBsZXIwLCBzaXplICogcG9zLnh5eiApLnh5O1xuICAgIG4ueCA9IGFicyggMi4wICogbi54IC0xLjAgKTtcbiAgICBuLnkgPSBhYnMoIDIuMCAqIG4ueSAtMS4wICk7XG4gICAgbm9pc2UgKz0gbXVsdENvbnRyaWIgKiAoIG4gKTtcbiAgfVxuICBub2lzZSAvPSBtYXhWYWx1ZTtcbiAgcmV0dXJuIG5vaXNlO1xufVxuKi9cbiIsIi8qXG5NaW5jZSBTbGljZXJcblxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDIxIEp1YW4gSm9zZSBMdW5hIEVzcGlub3NhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cblxuKi9cblxuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gJ3RocmVlJztcbmltcG9ydCB7IFJlbGllZk5vZGUgfSBmcm9tICcuL1JlbGllZk5vZGUuanMnO1xuXG5jbGFzcyBSZWxpZWZOb2RlVm9yb25vaVVWIGV4dGVuZHMgUmVsaWVmTm9kZSB7XG5cblx0Y29uc3RydWN0b3IoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApIHtcblxuXHRcdHN1cGVyKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKTtcblxuXHRcdHRoaXMuY2xhc3NOYW1lID0gJ1Zvcm9ub2lVVic7XG5cblx0XHR0aGlzLm51bVBvaW50cyA9IHBhcmFtZXRlclZhbHVlc1sgMSBdO1xuXHRcdHRoaXMubGluZVRoaWNrbmVzcyA9IHBhcmFtZXRlclZhbHVlc1sgMiBdO1xuXG5cdFx0dGhpcy5wcm5nID0gY29udGV4dC5wcm5nO1xuXHRcdHRoaXMucmFuZ2UgPSB0aGlzLmNlaWwgLSB0aGlzLmZsb29yO1xuXG5cdFx0dGhpcy5wb2ludHMgPSBbIF07XG5cdFx0Zm9yICggbGV0IGkgPSAwOyBpIDwgdGhpcy5udW1Qb2ludHM7IGkgKysgKSB7XG5cblx0XHRcdHRoaXMucG9pbnRzLnB1c2goIG5ldyBWZWN0b3IyKCB0aGlzLnBybmcucmFuZG9tKCksIHRoaXMucHJuZy5yYW5kb20oKSApICk7XG5cblx0XHR9XG5cblx0XHR0aGlzLnZlYzIxID0gbmV3IFZlY3RvcjIoKTtcblx0XHR0aGlzLnZlYzIyID0gbmV3IFZlY3RvcjIoKTtcblxuXG5cdH1cblxuXHRldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICkge1xuXG5cdFx0Y29uc3QgbGluZVRoaWNrbmVzcyA9IHRoaXMubGluZVRoaWNrbmVzcy5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICk7XG5cdFx0Y29uc3QgbGluZVRoaWNrbmVzczIgPSBsaW5lVGhpY2tuZXNzICogMC41O1xuXG5cdFx0bGV0IG1pbkRpc3QxID0gKyBJbmZpbml0eTtcblx0XHRsZXQgbWluSW5kZXgxID0gLSAxO1xuXHRcdGZvciAoIGxldCBpID0gMDsgaSA8IHRoaXMubnVtUG9pbnRzOyBpICsrICkge1xuXG5cdFx0XHR0aGlzLnZlYzIxLnN1YlZlY3RvcnMoIHV2LCB0aGlzLnBvaW50c1sgaSBdICk7XG5cdFx0XHRjb25zdCBkaXN0ID0gdGhpcy52ZWMyMS5sZW5ndGgoKTtcblxuXHRcdFx0aWYgKCBkaXN0IDwgbWluRGlzdDEgKSB7XG5cblx0XHRcdFx0bWluRGlzdDEgPSBkaXN0O1xuXHRcdFx0XHRtaW5JbmRleDEgPSBpO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHR0aGlzLnZlYzIyLnN1YlZlY3RvcnMoIHV2LCB0aGlzLnBvaW50c1sgbWluSW5kZXgxIF0gKS5ub3JtYWxpemUoKS5tdWx0aXBseVNjYWxhciggbGluZVRoaWNrbmVzczIgKS5hZGQoIHV2ICk7XG5cblx0XHRsZXQgbWluRGlzdDIgPSArIEluZmluaXR5O1xuXHRcdGxldCBtaW5JbmRleDIgPSAtIDE7XG5cdFx0Zm9yICggbGV0IGkgPSAwOyBpIDwgdGhpcy5udW1Qb2ludHM7IGkgKysgKSB7XG5cblx0XHRcdHRoaXMudmVjMjEuc3ViVmVjdG9ycyggdGhpcy52ZWMyMiwgdGhpcy5wb2ludHNbIGkgXSApO1xuXHRcdFx0Y29uc3QgZGlzdCA9IHRoaXMudmVjMjEubGVuZ3RoKCk7XG5cblx0XHRcdGlmICggZGlzdCA8IG1pbkRpc3QyICkge1xuXG5cdFx0XHRcdG1pbkRpc3QyID0gZGlzdDtcblx0XHRcdFx0bWluSW5kZXgyID0gaTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0Y29uc3QgZGlzdFRvVm9yb25vaSA9IE1hdGguYWJzKCBtaW5EaXN0MiAtIG1pbkRpc3QxICk7XG5cblx0XHRjb25zdCBpc0luTGluZSA9ICggZGlzdFRvVm9yb25vaSA8IGxpbmVUaGlja25lc3MyICkgJiYgKCBtaW5JbmRleDEgIT09IG1pbkluZGV4MiApO1xuXG5cdFx0Ly9yZXR1cm4gdGhpcy5mbG9vciArIHRoaXMucmFuZ2UgKiAoIGlzSW5MaW5lID8gTWF0aC5tYXgoIDAsIGRpc3RUb1Zvcm9ub2kgLyBsaW5lVGhpY2tuZXNzMiApIDogMSAgKTtcblx0XHRyZXR1cm4gdGhpcy5mbG9vciArIHRoaXMucmFuZ2UgKiAoIGlzSW5MaW5lID8gMCA6IDEgICk7XG5cblx0fVxuXG59XG5cbmV4cG9ydCB7IFJlbGllZk5vZGVWb3Jvbm9pVVYgfTtcbiIsIi8qXG5NaW5jZSBTbGljZXJcblxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDIxIEp1YW4gSm9zZSBMdW5hIEVzcGlub3NhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cblxuKi9cblxuaW1wb3J0IHsgUmVsaWVmTm9kZSB9IGZyb20gJy4vUmVsaWVmTm9kZS5qcyc7XG5cbmNsYXNzIFJlbGllZk5vZGVDaXJjbGVzIGV4dGVuZHMgUmVsaWVmTm9kZSB7XG5cblx0Y29uc3RydWN0b3IoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApIHtcblxuXHRcdHN1cGVyKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKTtcblxuXHRcdHRoaXMuY2xhc3NOYW1lID0gJ0NpcmNsZXMnO1xuXG5cdFx0dGhpcy5udW1DaXJjbGVzID0gcGFyYW1ldGVyVmFsdWVzWyAxIF0gKiAyO1xuXG5cdFx0dGhpcy5vZmZzZXRVID0gcGFyYW1ldGVyVmFsdWVzWyAyIF07XG5cdFx0dGhpcy5vZmZzZXRWID0gcGFyYW1ldGVyVmFsdWVzWyAzIF07XG5cblx0XHR0aGlzLnJhbmdlID0gdGhpcy5jZWlsIC0gdGhpcy5mbG9vcjtcblxuXHR9XG5cblx0ZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApIHtcblxuXHRcdGNvbnN0IHUgPSB1di54ICsgdGhpcy5vZmZzZXRVLmV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKTtcblx0XHRjb25zdCB2ID0gdXYueSArIHRoaXMub2Zmc2V0Vi5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICk7XG5cblx0XHRjb25zdCByID0gTWF0aC5zcXJ0KCB1ICogdSArIHYgKiB2ICk7XG5cblx0XHRyZXR1cm4gdGhpcy5mbG9vciArIHRoaXMucmFuZ2UgKiAoIE1hdGguZmxvb3IoIHIgKiB0aGlzLm51bUNpcmNsZXMgKSAmIDEgPyAxIDogMCApO1xuXG5cblx0fVxuXG59XG5cbmV4cG9ydCB7IFJlbGllZk5vZGVDaXJjbGVzIH07XG4iLCIvKlxuTWluY2UgU2xpY2VyXG5cbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAyMSBKdWFuIEpvc2UgTHVuYSBFc3Bpbm9zYVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuU09GVFdBUkUuXG5cbiovXG5cbmltcG9ydCB7IFJlbGllZk5vZGVDZWxsIH0gZnJvbSAnLi9SZWxpZWZOb2RlQ2VsbC5qcyc7XG5cbmNsYXNzIFJlbGllZk5vZGVTcG90cyBleHRlbmRzIFJlbGllZk5vZGVDZWxsIHtcblxuXHRjb25zdHJ1Y3RvciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICkge1xuXG5cdFx0c3VwZXIoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApO1xuXG5cdFx0dGhpcy5jbGFzc05hbWUgPSAnU3BvdHMnO1xuXG5cdFx0dGhpcy5zcG90UmFkaXVzID0gcGFyYW1ldGVyVmFsdWVzWyAzIF07XG5cblx0XHR0aGlzLnJhbmdlID0gdGhpcy5jZWlsIC0gdGhpcy5mbG9vcjtcblxuXHR9XG5cblx0ZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApIHtcblxuXHRcdGNvbnN0IHNpemVVID0gdGhpcy5zaXplVS5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICk7XG5cdFx0Y29uc3Qgc2l6ZVYgPSB0aGlzLnNpemVWLmV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKTtcblxuXHRcdGNvbnN0IGNlbGxVID0gUmVsaWVmTm9kZUNlbGwuY29vcmRpbmF0ZVRvQ2VsbCggdXYueCwgc2l6ZVUgKTtcblx0XHRjb25zdCBjZWxsViA9IFJlbGllZk5vZGVDZWxsLmNvb3JkaW5hdGVUb0NlbGwoIHV2LnksIHNpemVWICk7XG5cblx0XHR1di54IC09ICggY2VsbFUgKiAwLjUgKyAwLjUgKSAqIHNpemVVO1xuXHRcdHV2LnkgLT0gKCBjZWxsViAqIDAuNSArIDAuNSApICogc2l6ZVY7XG5cblx0XHRjb25zdCByYWRpdXMgPSB0aGlzLnNwb3RSYWRpdXMuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApO1xuXG5cdFx0Y29uc3QgciA9IE1hdGguc3FydCggY2VsbFUgKiBjZWxsVSArIGNlbGxWICogY2VsbFYgKTtcblxuXHRcdGlmICggciA+IHJhZGl1cyApIHJldHVybiB0aGlzLmZsb29yO1xuXG5cdFx0Y29uc3QgaCA9IDEgLSByIC8gcmFkaXVzO1xuXG5cdFx0cmV0dXJuIHRoaXMuZmxvb3IgKyB0aGlzLnJhbmdlICogaDtcblxuXHR9XG5cbn1cblxuZXhwb3J0IHsgUmVsaWVmTm9kZVNwb3RzIH07XG4iLCIvKlxuTWluY2UgU2xpY2VyXG5cbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAyMSBKdWFuIEpvc2UgTHVuYSBFc3Bpbm9zYVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuU09GVFdBUkUuXG5cbiovXG5cbmltcG9ydCB7IFJlbGllZk5vZGUgfSBmcm9tICcuL1JlbGllZk5vZGUuanMnO1xuXG5jbGFzcyBSZWxpZWZOb2RlUHJlc2V0IGV4dGVuZHMgUmVsaWVmTm9kZSB7XG5cblx0Y29uc3RydWN0b3IoIG5hbWUsIHBhcmFtZXRlclNpZ25hdHVyZXMsIHBhcmFtZXRlclZhbHVlcywgY29udGV4dCApIHtcblxuXHRcdHN1cGVyKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKTtcblxuXHRcdHRoaXMuY2xhc3NOYW1lID0gJ1ByZXNldCc7XG5cblx0XHR0aGlzLnByZXNldCA9IHBhcmFtZXRlclZhbHVlc1sgMCBdO1xuXG5cdH1cblxuXHRldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICkge1xuXG5cdFx0aWYgKCAhIHRoaXMucHJlc2V0ICkgcmV0dXJuIDA7XG5cblx0XHRyZXR1cm4gdGhpcy5wcmVzZXQuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApO1xuXG5cdH1cblxufVxuXG5leHBvcnQgeyBSZWxpZWZOb2RlUHJlc2V0IH07XG4iLCIvKlxuTWluY2UgU2xpY2VyXG5cbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAyMSBKdWFuIEpvc2UgTHVuYSBFc3Bpbm9zYVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuU09GVFdBUkUuXG5cbiovXG5cbmltcG9ydCB7IFJlbGllZk5vZGUgfSBmcm9tICcuL1JlbGllZk5vZGUuanMnO1xuXG5jbGFzcyBSZWxpZWZOb2RlTWF0ZXJpYWxTZWxlY3RvciBleHRlbmRzIFJlbGllZk5vZGUge1xuXG5cdGNvbnN0cnVjdG9yKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKSB7XG5cblx0XHRzdXBlciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICk7XG5cblx0XHR0aGlzLmNsYXNzTmFtZSA9ICdNYXRlcmlhbFNlbGVjdG9yJztcblxuXHRcdHRoaXMubWF0ZXJpYWxzID0gcGFyYW1ldGVyVmFsdWVzWyAwIF07XG5cblx0fVxuXG5cdGV2YWx1YXRlKCB1diwgcG9zLCBub3JtYWwsIG1hdGVyaWFsSW5kZXggKSB7XG5cblx0XHRpZiAoIG1hdGVyaWFsSW5kZXggPj0gdGhpcy5tYXRlcmlhbHMubGVuZ3RoICkgcmV0dXJuIDA7XG5cblx0XHRyZXR1cm4gdGhpcy5tYXRlcmlhbHNbIG1hdGVyaWFsSW5kZXggXS5ldmFsdWF0ZSggdXYsIHBvcywgbm9ybWFsLCBtYXRlcmlhbEluZGV4ICApO1xuXG5cdH1cblxufVxuXG5leHBvcnQgeyBSZWxpZWZOb2RlTWF0ZXJpYWxTZWxlY3RvciB9O1xuIiwiLypcbk1pbmNlIFNsaWNlclxuXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMjEgSnVhbiBKb3NlIEx1bmEgRXNwaW5vc2FcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuXG4qL1xuXG5pbXBvcnQgeyBSZWxpZWZOb2RlIH0gZnJvbSAnLi9SZWxpZWZOb2RlLmpzJztcblxuY2xhc3MgUmVsaWVmTm9kZU11bHRpcGxleCBleHRlbmRzIFJlbGllZk5vZGUge1xuXG5cdGNvbnN0cnVjdG9yKCBuYW1lLCBwYXJhbWV0ZXJTaWduYXR1cmVzLCBwYXJhbWV0ZXJWYWx1ZXMsIGNvbnRleHQgKSB7XG5cblx0XHRzdXBlciggbmFtZSwgcGFyYW1ldGVyU2lnbmF0dXJlcywgcGFyYW1ldGVyVmFsdWVzLCBjb250ZXh0ICk7XG5cblx0XHR0aGlzLmNsYXNzTmFtZSA9ICdNdWx0aXBsZXgnO1xuXG5cdFx0dGhpcy5ub2RlcyA9IHBhcmFtZXRlclZhbHVlc1sgMCBdO1xuXG5cdFx0dGhpcy5pbmRleE5vZGUgPSBwYXJhbWV0ZXJWYWx1ZXNbIDEgXTtcblxuXHR9XG5cblx0ZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApIHtcblxuXHRcdGNvbnN0IGluZGV4ID0gTWF0aC5mbG9vciggdGhpcy5pbmRleE5vZGUuZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCApICk7XG5cblx0XHRpZiAoIGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLm5vZGVzLmxlbmd0aCApIHJldHVybiAwO1xuXG5cdFx0cmV0dXJuIHRoaXMubm9kZXNbIGluZGV4IF0uZXZhbHVhdGUoIHV2LCBwb3MsIG5vcm1hbCwgbWF0ZXJpYWxJbmRleCAgKTtcblxuXHR9XG5cbn1cblxuZXhwb3J0IHsgUmVsaWVmTm9kZU11bHRpcGxleCB9O1xuIiwiLypcbk1pbmNlIFNsaWNlclxuXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMjEgSnVhbiBKb3NlIEx1bmEgRXNwaW5vc2FcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuXG4qL1xuXG5pbXBvcnQgKiBhcyBDb25zdGFudHMgZnJvbSAnLi4vbm9kZXMvQ29uc3RhbnRzLmpzJztcbmltcG9ydCB7IFJlbGllZk5vZGVDb25zdGFudCB9IGZyb20gJy4vUmVsaWVmTm9kZUNvbnN0YW50LmpzJztcbmltcG9ydCB7IFJlbGllZk5vZGVJbWFnZVVWIH0gZnJvbSAnLi9SZWxpZWZOb2RlSW1hZ2VVVi5qcyc7XG5pbXBvcnQgeyBSZWxpZWZOb2RlSW1hZ2VUaWxlZFVWIH0gZnJvbSAnLi9SZWxpZWZOb2RlSW1hZ2VUaWxlZFVWLmpzJztcbmltcG9ydCB7IFJlbGllZk5vZGVBZGQgfSBmcm9tICcuL1JlbGllZk5vZGVBZGQuanMnO1xuaW1wb3J0IHsgUmVsaWVmTm9kZU5lZ2F0ZSB9IGZyb20gJy4vUmVsaWVmTm9kZU5lZ2F0ZS5qcyc7XG5pbXBvcnQgeyBSZWxpZWZOb2RlTXVsdGlwbHkgfSBmcm9tICcuL1JlbGllZk5vZGVNdWx0aXBseS5qcyc7XG5pbXBvcnQgeyBSZWxpZWZOb2RlRGl2aWRlIH0gZnJvbSAnLi9SZWxpZWZOb2RlRGl2aWRlLmpzJztcbmltcG9ydCB7IFJlbGllZk5vZGVQb3dlciB9IGZyb20gJy4vUmVsaWVmTm9kZVBvd2VyLmpzJztcbmltcG9ydCB7IFJlbGllZk5vZGVTaW4gfSBmcm9tICcuL1JlbGllZk5vZGVTaW4uanMnO1xuaW1wb3J0IHsgUmVsaWVmTm9kZUNvcyB9IGZyb20gJy4vUmVsaWVmTm9kZUNvcy5qcyc7XG5pbXBvcnQgeyBSZWxpZWZOb2RlTWl4IH0gZnJvbSAnLi9SZWxpZWZOb2RlTWl4LmpzJztcbmltcG9ydCB7IFJlbGllZk5vZGVNaW4gfSBmcm9tICcuL1JlbGllZk5vZGVNaW4uanMnO1xuaW1wb3J0IHsgUmVsaWVmTm9kZU1heCB9IGZyb20gJy4vUmVsaWVmTm9kZU1heC5qcyc7XG5pbXBvcnQgeyBSZWxpZWZOb2RlTGVzc1RoYW4gfSBmcm9tICcuL1JlbGllZk5vZGVMZXNzVGhhbi5qcyc7XG5pbXBvcnQgeyBSZWxpZWZOb2RlTm90Qm90dG9tIH0gZnJvbSAnLi9SZWxpZWZOb2RlTm90Qm90dG9tLmpzJztcbmltcG9ydCB7IFJlbGllZk5vZGVRdWFudGl6ZSB9IGZyb20gJy4vUmVsaWVmTm9kZVF1YW50aXplLmpzJztcbmltcG9ydCB7IFJlbGllZk5vZGVFdmFsdWF0ZSB9IGZyb20gJy4vUmVsaWVmTm9kZUV2YWx1YXRlLmpzJztcbmltcG9ydCB7IFJlbGllZk5vZGVHZXRVIH0gZnJvbSAnLi9SZWxpZWZOb2RlR2V0VS5qcyc7XG5pbXBvcnQgeyBSZWxpZWZOb2RlR2V0ViB9IGZyb20gJy4vUmVsaWVmTm9kZUdldFYuanMnO1xuaW1wb3J0IHsgUmVsaWVmTm9kZUdldFggfSBmcm9tICcuL1JlbGllZk5vZGVHZXRYLmpzJztcbmltcG9ydCB7IFJlbGllZk5vZGVHZXRZIH0gZnJvbSAnLi9SZWxpZWZOb2RlR2V0WS5qcyc7XG5pbXBvcnQgeyBSZWxpZWZOb2RlR2V0WiB9IGZyb20gJy4vUmVsaWVmTm9kZUdldFouanMnO1xuaW1wb3J0IHsgUmVsaWVmTm9kZUNoZWNrZXJlZCB9IGZyb20gJy4vUmVsaWVmTm9kZUNoZWNrZXJlZC5qcyc7XG5pbXBvcnQgeyBSZWxpZWZOb2RlVGlsZXMgfSBmcm9tICcuL1JlbGllZk5vZGVUaWxlcy5qcyc7XG5pbXBvcnQgeyBSZWxpZWZOb2RlU2ltcGxleFVWIH0gZnJvbSAnLi9SZWxpZWZOb2RlU2ltcGxleFVWLmpzJztcbmltcG9ydCB7IFJlbGllZk5vZGVQZXJsaW5VViB9IGZyb20gJy4vUmVsaWVmTm9kZVBlcmxpblVWLmpzJztcbmltcG9ydCB7IFJlbGllZk5vZGVWb3Jvbm9pVVYgfSBmcm9tICcuL1JlbGllZk5vZGVWb3Jvbm9pVVYuanMnO1xuaW1wb3J0IHsgUmVsaWVmTm9kZUNpcmNsZXMgfSBmcm9tICcuL1JlbGllZk5vZGVDaXJjbGVzLmpzJztcbmltcG9ydCB7IFJlbGllZk5vZGVTcG90cyB9IGZyb20gJy4vUmVsaWVmTm9kZVNwb3RzLmpzJztcbmltcG9ydCB7IFJlbGllZk5vZGVQcmVzZXQgfSBmcm9tICcuL1JlbGllZk5vZGVQcmVzZXQuanMnO1xuaW1wb3J0IHsgUmVsaWVmTm9kZU1hdGVyaWFsU2VsZWN0b3IgfSBmcm9tICcuL1JlbGllZk5vZGVNYXRlcmlhbFNlbGVjdG9yLmpzJztcbmltcG9ydCB7IFJlbGllZk5vZGVNdWx0aXBsZXggfSBmcm9tICcuL1JlbGllZk5vZGVNdWx0aXBsZXguanMnO1xuXG5mdW5jdGlvbiBnZXRNb2RlUGFyYW1ldGVyU2lnbmF0dXJlKCkge1xuXG5cdHJldHVybiB7XG5cdFx0bmFtZTogJ01vZGUnLFxuXHRcdHR5cGU6ICdzdHJpbmcnLFxuXHR9O1xuXG59XG5cbmZ1bmN0aW9uIGdldENvbnN0YW50VmFsdWVOb2RlKCB2YWx1ZSApIHtcblxuXHRyZXR1cm4ge1xuXHRcdGNsYXNzTmFtZTogJ0NvbnN0YW50Jyxcblx0XHRwYXJhbWV0ZXJWYWx1ZXM6IFsgdmFsdWUgXVxuXHR9O1xuXG59XG5cbmNvbnN0IHJlbGllZk5vZGVDbGFzc2VzID0ge1xuXHQnQ29uc3RhbnQnOiB7XG5cdFx0Y2xhc3NPYmplY3Q6IFJlbGllZk5vZGVDb25zdGFudCxcblx0XHRwYXJhbWV0ZXJzOiBbXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdWYWx1ZScsXG5cdFx0XHRcdHR5cGU6ICdudW1iZXInXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRkZWZhdWx0Tm9kZVZhbHVlOiB7XG5cdFx0XHRwYXJhbWV0ZXJWYWx1ZXM6IFtcblx0XHRcdFx0MFxuXHRcdFx0XVxuXHRcdH1cblx0fSxcblx0J0ltYWdlVVYnOiB7XG5cdFx0Y2xhc3NPYmplY3Q6IFJlbGllZk5vZGVJbWFnZVVWLFxuXHRcdHBhcmFtZXRlcnM6IFtcblx0XHRcdGdldE1vZGVQYXJhbWV0ZXJTaWduYXR1cmUoKSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0ltYWdlIHNpemUgVScsXG5cdFx0XHRcdHR5cGU6ICdudW1iZXInXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnSW1hZ2Ugc2l6ZSBWJyxcblx0XHRcdFx0dHlwZTogJ251bWJlcidcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdPZmZzZXQgVScsXG5cdFx0XHRcdHR5cGU6ICdudW1iZXInXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnT2Zmc2V0IFYnLFxuXHRcdFx0XHR0eXBlOiAnbnVtYmVyJ1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0ltYWdlJyxcblx0XHRcdFx0dHlwZTogJ2ltYWdlJ1xuXHRcdFx0fVxuXHRcdF0sXG5cdFx0ZGVmYXVsdE5vZGVWYWx1ZToge1xuXHRcdFx0cGFyYW1ldGVyVmFsdWVzOiBbXG5cdFx0XHRcdENvbnN0YW50cy5SRUxJRUZfRU1CT1NTLFxuXHRcdFx0XHQxLFxuXHRcdFx0XHQxLFxuXHRcdFx0XHQwLFxuXHRcdFx0XHQwLFxuXHRcdFx0XHRcIk5vbmVcIlxuXHRcdFx0XVxuXHRcdH1cblx0fSxcblx0J0ltYWdlVGlsZWRVVic6IHtcblx0XHRjbGFzc09iamVjdDogUmVsaWVmTm9kZUltYWdlVGlsZWRVVixcblx0XHRwYXJhbWV0ZXJzOiBbXG5cdFx0XHRnZXRNb2RlUGFyYW1ldGVyU2lnbmF0dXJlKCksXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdTaXplIFUnLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdTaXplIFYnLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdJbWFnZSBzaXplIFUnLFxuXHRcdFx0XHR0eXBlOiAnbnVtYmVyJ1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0ltYWdlIHNpemUgVicsXG5cdFx0XHRcdHR5cGU6ICdudW1iZXInXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnT2Zmc2V0IFUnLFxuXHRcdFx0XHR0eXBlOiAnbnVtYmVyJ1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ09mZnNldCBWJyxcblx0XHRcdFx0dHlwZTogJ251bWJlcidcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdJbWFnZScsXG5cdFx0XHRcdHR5cGU6ICdpbWFnZSdcblx0XHRcdH1cblx0XHRdLFxuXHRcdGRlZmF1bHROb2RlVmFsdWU6IHtcblx0XHRcdHBhcmFtZXRlclZhbHVlczogW1xuXHRcdFx0XHRDb25zdGFudHMuUkVMSUVGX0VNQk9TUyxcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDAuMSApLFxuXHRcdFx0XHRnZXRDb25zdGFudFZhbHVlTm9kZSggMC4xICksXG5cdFx0XHRcdDIsXG5cdFx0XHRcdDIsXG5cdFx0XHRcdC0xLFxuXHRcdFx0XHQtMSxcblx0XHRcdFx0XCJOb25lXCJcblx0XHRcdF1cblx0XHR9XG5cdH0sXG5cdCdBZGQnOiB7XG5cdFx0Y2xhc3NPYmplY3Q6IFJlbGllZk5vZGVBZGQsXG5cdFx0cGFyYW1ldGVyczogW1xuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnQScsXG5cdFx0XHRcdHR5cGU6ICdub2RlJ1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0InLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH1cblx0XHRdLFxuXHRcdGRlZmF1bHROb2RlVmFsdWU6IHtcblx0XHRcdHBhcmFtZXRlclZhbHVlczogW1xuXHRcdFx0XHRnZXRDb25zdGFudFZhbHVlTm9kZSggMCApLFxuXHRcdFx0XHRnZXRDb25zdGFudFZhbHVlTm9kZSggMCApXG5cdFx0XHRdXG5cdFx0fVxuXHR9LFxuXHQnTmVnYXRlJzoge1xuXHRcdGNsYXNzT2JqZWN0OiBSZWxpZWZOb2RlTmVnYXRlLFxuXHRcdHBhcmFtZXRlcnM6IFtcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0EnLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH1cblx0XHRdLFxuXHRcdGRlZmF1bHROb2RlVmFsdWU6IHtcblx0XHRcdHBhcmFtZXRlclZhbHVlczogW1xuXHRcdFx0XHRnZXRDb25zdGFudFZhbHVlTm9kZSggMCApXG5cdFx0XHRdXG5cdFx0fVxuXHR9LFxuXHQnTXVsdGlwbHknOiB7XG5cdFx0Y2xhc3NPYmplY3Q6IFJlbGllZk5vZGVNdWx0aXBseSxcblx0XHRwYXJhbWV0ZXJzOiBbXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdBJyxcblx0XHRcdFx0dHlwZTogJ25vZGUnXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnQicsXG5cdFx0XHRcdHR5cGU6ICdub2RlJ1xuXHRcdFx0fVxuXHRcdF0sXG5cdFx0ZGVmYXVsdE5vZGVWYWx1ZToge1xuXHRcdFx0cGFyYW1ldGVyVmFsdWVzOiBbXG5cdFx0XHRcdGdldENvbnN0YW50VmFsdWVOb2RlKCAxICksXG5cdFx0XHRcdGdldENvbnN0YW50VmFsdWVOb2RlKCAxIClcblx0XHRcdF1cblx0XHR9XG5cdH0sXG5cdCdNaXgnOiB7XG5cdFx0Y2xhc3NPYmplY3Q6IFJlbGllZk5vZGVNaXgsXG5cdFx0cGFyYW1ldGVyczogW1xuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnQScsXG5cdFx0XHRcdHR5cGU6ICdub2RlJ1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0InLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdGYWN0b3InLFxuXHRcdFx0XHR0eXBlOiAnbm9kZScsXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRkZWZhdWx0Tm9kZVZhbHVlOiB7XG5cdFx0XHRwYXJhbWV0ZXJWYWx1ZXM6IFtcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDAgKSxcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDAgKSxcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDAuNSApXG5cdFx0XHRdXG5cdFx0fVxuXHR9LFxuXHQnTWluJzoge1xuXHRcdGNsYXNzT2JqZWN0OiBSZWxpZWZOb2RlTWluLFxuXHRcdHBhcmFtZXRlcnM6IFtcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0EnLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdCJyxcblx0XHRcdFx0dHlwZTogJ25vZGUnXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRkZWZhdWx0Tm9kZVZhbHVlOiB7XG5cdFx0XHRwYXJhbWV0ZXJWYWx1ZXM6IFtcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDAgKSxcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDAgKVxuXHRcdFx0XVxuXHRcdH1cblx0fSxcblx0J01heCc6IHtcblx0XHRjbGFzc09iamVjdDogUmVsaWVmTm9kZU1heCxcblx0XHRwYXJhbWV0ZXJzOiBbXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdBJyxcblx0XHRcdFx0dHlwZTogJ25vZGUnXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnQicsXG5cdFx0XHRcdHR5cGU6ICdub2RlJ1xuXHRcdFx0fVxuXHRcdF0sXG5cdFx0ZGVmYXVsdE5vZGVWYWx1ZToge1xuXHRcdFx0cGFyYW1ldGVyVmFsdWVzOiBbXG5cdFx0XHRcdGdldENvbnN0YW50VmFsdWVOb2RlKCAwICksXG5cdFx0XHRcdGdldENvbnN0YW50VmFsdWVOb2RlKCAwIClcblx0XHRcdF1cblx0XHR9XG5cdH0sXG5cdCdMZXNzVGhhbic6IHtcblx0XHRjbGFzc09iamVjdDogUmVsaWVmTm9kZUxlc3NUaGFuLFxuXHRcdHBhcmFtZXRlcnM6IFtcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0EnLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdCJyxcblx0XHRcdFx0dHlwZTogJ25vZGUnXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRkZWZhdWx0Tm9kZVZhbHVlOiB7XG5cdFx0XHRwYXJhbWV0ZXJWYWx1ZXM6IFtcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDAgKSxcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDAgKVxuXHRcdFx0XVxuXHRcdH1cblx0fSxcblx0J05vdEJvdHRvbSc6IHtcblx0XHRjbGFzc09iamVjdDogUmVsaWVmTm9kZU5vdEJvdHRvbSxcblx0XHRwYXJhbWV0ZXJzOiBbIF0sXG5cdFx0ZGVmYXVsdE5vZGVWYWx1ZToge1xuXHRcdFx0cGFyYW1ldGVyVmFsdWVzOiBbIF1cblx0XHR9XG5cdH0sXG5cdCdEaXZpZGUnOiB7XG5cdFx0Y2xhc3NPYmplY3Q6IFJlbGllZk5vZGVEaXZpZGUsXG5cdFx0cGFyYW1ldGVyczogW1xuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnQScsXG5cdFx0XHRcdHR5cGU6ICdub2RlJ1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0InLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH1cblx0XHRdLFxuXHRcdGRlZmF1bHROb2RlVmFsdWU6IHtcblx0XHRcdHBhcmFtZXRlclZhbHVlczogW1xuXHRcdFx0XHRnZXRDb25zdGFudFZhbHVlTm9kZSggMCApLFxuXHRcdFx0XHRnZXRDb25zdGFudFZhbHVlTm9kZSggMCApXG5cdFx0XHRdXG5cdFx0fVxuXHR9LFxuXHQnUG93ZXInOiB7XG5cdFx0Y2xhc3NPYmplY3Q6IFJlbGllZk5vZGVQb3dlcixcblx0XHRwYXJhbWV0ZXJzOiBbXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdBJyxcblx0XHRcdFx0dHlwZTogJ25vZGUnXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnQicsXG5cdFx0XHRcdHR5cGU6ICdub2RlJ1xuXHRcdFx0fVxuXHRcdF0sXG5cdFx0ZGVmYXVsdE5vZGVWYWx1ZToge1xuXHRcdFx0cGFyYW1ldGVyVmFsdWVzOiBbXG5cdFx0XHRcdGdldENvbnN0YW50VmFsdWVOb2RlKCAwICksXG5cdFx0XHRcdGdldENvbnN0YW50VmFsdWVOb2RlKCAwIClcblx0XHRcdF1cblx0XHR9XG5cdH0sXG5cdCdTaW4nOiB7XG5cdFx0Y2xhc3NPYmplY3Q6IFJlbGllZk5vZGVTaW4sXG5cdFx0cGFyYW1ldGVyczogW1xuXHRcdFx0Z2V0TW9kZVBhcmFtZXRlclNpZ25hdHVyZSgpLFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnQScsXG5cdFx0XHRcdHR5cGU6ICdub2RlJ1xuXHRcdFx0fVxuXHRcdF0sXG5cdFx0ZGVmYXVsdE5vZGVWYWx1ZToge1xuXHRcdFx0cGFyYW1ldGVyVmFsdWVzOiBbXG5cdFx0XHRcdENvbnN0YW50cy5SRUxJRUZfRU1CT1NTLFxuXHRcdFx0XHRnZXRDb25zdGFudFZhbHVlTm9kZSggMCApXG5cdFx0XHRdXG5cdFx0fVxuXHR9LFxuXHQnQ29zJzoge1xuXHRcdGNsYXNzT2JqZWN0OiBSZWxpZWZOb2RlQ29zLFxuXHRcdHBhcmFtZXRlcnM6IFtcblx0XHRcdGdldE1vZGVQYXJhbWV0ZXJTaWduYXR1cmUoKSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0EnLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH1cblx0XHRdLFxuXHRcdGRlZmF1bHROb2RlVmFsdWU6IHtcblx0XHRcdHBhcmFtZXRlclZhbHVlczogW1xuXHRcdFx0XHRDb25zdGFudHMuUkVMSUVGX0VNQk9TUyxcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDAgKVxuXHRcdFx0XVxuXHRcdH1cblx0fSxcblx0J1F1YW50aXplJzoge1xuXHRcdGNsYXNzT2JqZWN0OiBSZWxpZWZOb2RlUXVhbnRpemUsXG5cdFx0cGFyYW1ldGVyczogW1xuXHRcdFx0Z2V0TW9kZVBhcmFtZXRlclNpZ25hdHVyZSgpLFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnQScsXG5cdFx0XHRcdHR5cGU6ICdub2RlJ1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ1N0ZXAgc2l6ZScsXG5cdFx0XHRcdHR5cGU6ICdub2RlJ1xuXHRcdFx0fVxuXHRcdF0sXG5cdFx0ZGVmYXVsdE5vZGVWYWx1ZToge1xuXHRcdFx0cGFyYW1ldGVyVmFsdWVzOiBbXG5cdFx0XHRcdENvbnN0YW50cy5SRUxJRUZfRU1CT1NTLFxuXHRcdFx0XHRnZXRDb25zdGFudFZhbHVlTm9kZSggMCApLFxuXHRcdFx0XHRnZXRDb25zdGFudFZhbHVlTm9kZSggMC4xIClcblx0XHRcdF1cblx0XHR9XG5cdH0sXG5cdCdFdmFsdWF0ZSc6IHtcblx0XHRjbGFzc09iamVjdDogUmVsaWVmTm9kZUV2YWx1YXRlLFxuXHRcdHBhcmFtZXRlcnM6IFtcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0EnLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdVJyxcblx0XHRcdFx0dHlwZTogJ25vZGUnXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnVicsXG5cdFx0XHRcdHR5cGU6ICdub2RlJ1xuXHRcdFx0fSxcblx0XHRdLFxuXHRcdGRlZmF1bHROb2RlVmFsdWU6IHtcblx0XHRcdHBhcmFtZXRlclZhbHVlczogW1xuXHRcdFx0XHRnZXRDb25zdGFudFZhbHVlTm9kZSggMCApLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y2xhc3NOYW1lOiAnR2V0VScsXG5cdFx0XHRcdFx0cGFyYW1ldGVyVmFsdWVzOiBbIF1cblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNsYXNzTmFtZTogJ0dldFYnLFxuXHRcdFx0XHRcdHBhcmFtZXRlclZhbHVlczogWyBdXG5cdFx0XHRcdH1cblx0XHRcdF1cblx0XHR9XG5cdH0sXG5cdCdHZXRVJzoge1xuXHRcdGNsYXNzT2JqZWN0OiBSZWxpZWZOb2RlR2V0VSxcblx0XHRwYXJhbWV0ZXJzOiBbXG5cdFx0XSxcblx0XHRkZWZhdWx0Tm9kZVZhbHVlOiB7XG5cdFx0XHRwYXJhbWV0ZXJWYWx1ZXM6IFsgXVxuXHRcdH1cblx0fSxcblx0J0dldFYnOiB7XG5cdFx0Y2xhc3NPYmplY3Q6IFJlbGllZk5vZGVHZXRWLFxuXHRcdHBhcmFtZXRlcnM6IFtcblx0XHRdLFxuXHRcdGRlZmF1bHROb2RlVmFsdWU6IHtcblx0XHRcdHBhcmFtZXRlclZhbHVlczogWyBdXG5cdFx0fVxuXHR9LFxuXHQnR2V0WCc6IHtcblx0XHRjbGFzc09iamVjdDogUmVsaWVmTm9kZUdldFgsXG5cdFx0cGFyYW1ldGVyczogW1xuXHRcdF0sXG5cdFx0ZGVmYXVsdE5vZGVWYWx1ZToge1xuXHRcdFx0cGFyYW1ldGVyVmFsdWVzOiBbIF1cblx0XHR9XG5cdH0sXG5cdCdHZXRZJzoge1xuXHRcdGNsYXNzT2JqZWN0OiBSZWxpZWZOb2RlR2V0WSxcblx0XHRwYXJhbWV0ZXJzOiBbXG5cdFx0XSxcblx0XHRkZWZhdWx0Tm9kZVZhbHVlOiB7XG5cdFx0XHRwYXJhbWV0ZXJWYWx1ZXM6IFsgXVxuXHRcdH1cblx0fSxcblx0J0dldFonOiB7XG5cdFx0Y2xhc3NPYmplY3Q6IFJlbGllZk5vZGVHZXRaLFxuXHRcdHBhcmFtZXRlcnM6IFtcblx0XHRdLFxuXHRcdGRlZmF1bHROb2RlVmFsdWU6IHtcblx0XHRcdHBhcmFtZXRlclZhbHVlczogWyBdXG5cdFx0fVxuXHR9LFxuXHQnQ2hlY2tlcmVkJzoge1xuXHRcdGNsYXNzT2JqZWN0OiBSZWxpZWZOb2RlQ2hlY2tlcmVkLFxuXHRcdHBhcmFtZXRlcnM6IFtcblx0XHRcdGdldE1vZGVQYXJhbWV0ZXJTaWduYXR1cmUoKSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ1NpemUgVScsXG5cdFx0XHRcdHR5cGU6ICdub2RlJ1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ1NpemUgVicsXG5cdFx0XHRcdHR5cGU6ICdub2RlJ1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0NoZWNrZXIgZnJhY3Rpb24gVScsXG5cdFx0XHRcdHR5cGU6ICdub2RlJ1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0NoZWNrZXIgZnJhY3Rpb24gVicsXG5cdFx0XHRcdHR5cGU6ICdub2RlJ1xuXHRcdFx0fVxuXHRcdF0sXG5cdFx0ZGVmYXVsdE5vZGVWYWx1ZToge1xuXHRcdFx0cGFyYW1ldGVyVmFsdWVzOiBbXG5cdFx0XHRcdENvbnN0YW50cy5SRUxJRUZfRU1CT1NTLFxuXHRcdFx0XHRnZXRDb25zdGFudFZhbHVlTm9kZSggMC4wNSApLFxuXHRcdFx0XHRnZXRDb25zdGFudFZhbHVlTm9kZSggMC4wNSApLFxuXHRcdFx0XHRnZXRDb25zdGFudFZhbHVlTm9kZSggMCApLFxuXHRcdFx0XHRnZXRDb25zdGFudFZhbHVlTm9kZSggMCApXG5cdFx0XHRdXG5cdFx0fVxuXHR9LFxuXHQnVGlsZXMnOiB7XG5cdFx0Y2xhc3NPYmplY3Q6IFJlbGllZk5vZGVUaWxlcyxcblx0XHRwYXJhbWV0ZXJzOiBbXG5cdFx0XHRnZXRNb2RlUGFyYW1ldGVyU2lnbmF0dXJlKCksXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdTaXplIFUnLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdTaXplIFYnLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdCZXZlbCBmcmFjdGlvbicsXG5cdFx0XHRcdHR5cGU6ICdub2RlJ1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0FsdGVybmF0ZWQgYnJpY2tzJyxcblx0XHRcdFx0dHlwZTogJ2Jvb2xlYW4nXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRkZWZhdWx0Tm9kZVZhbHVlOiB7XG5cdFx0XHRwYXJhbWV0ZXJWYWx1ZXM6IFtcblx0XHRcdFx0Q29uc3RhbnRzLlJFTElFRl9FTUJPU1MsXG5cdFx0XHRcdGdldENvbnN0YW50VmFsdWVOb2RlKCAwLjIgKSxcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDAuMiApLFxuXHRcdFx0XHRnZXRDb25zdGFudFZhbHVlTm9kZSggMC4zICksXG5cdFx0XHRcdGZhbHNlXG5cdFx0XHRdXG5cdFx0fVxuXHR9LFxuXHQnU2ltcGxleFVWJzoge1xuXHRcdGNsYXNzT2JqZWN0OiBSZWxpZWZOb2RlU2ltcGxleFVWLFxuXHRcdHBhcmFtZXRlcnM6IFtcblx0XHRcdGdldE1vZGVQYXJhbWV0ZXJTaWduYXR1cmUoKSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ1NjYWxlIFUnLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdTY2FsZSBWJyxcblx0XHRcdFx0dHlwZTogJ25vZGUnXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRkZWZhdWx0Tm9kZVZhbHVlOiB7XG5cdFx0XHRwYXJhbWV0ZXJWYWx1ZXM6IFtcblx0XHRcdFx0Q29uc3RhbnRzLlJFTElFRl9FTUJPU1MsXG5cdFx0XHRcdGdldENvbnN0YW50VmFsdWVOb2RlKCA1ICksXG5cdFx0XHRcdGdldENvbnN0YW50VmFsdWVOb2RlKCA1IClcblx0XHRcdF1cblx0XHR9XG5cdH0sXG5cdCdQZXJsaW5VVic6IHtcblx0XHRjbGFzc09iamVjdDogUmVsaWVmTm9kZVBlcmxpblVWLFxuXHRcdHBhcmFtZXRlcnM6IFtcblx0XHRcdGdldE1vZGVQYXJhbWV0ZXJTaWduYXR1cmUoKSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ051bWJlciBvZiBpdGVyYXRpb25zJyxcblx0XHRcdFx0dHlwZTogJ251bWJlcidcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdTaXplJyxcblx0XHRcdFx0dHlwZTogJ25vZGUnXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnU2l6ZSBtdWx0aXBsaWVyJyxcblx0XHRcdFx0dHlwZTogJ25vZGUnXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnQ29udHJpYnV0aW9uIG11bHRpcGxpZXInLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH1cblx0XHRdLFxuXHRcdGRlZmF1bHROb2RlVmFsdWU6IHtcblx0XHRcdHBhcmFtZXRlclZhbHVlczogW1xuXHRcdFx0XHRDb25zdGFudHMuUkVMSUVGLFxuXHRcdFx0XHQxMCxcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDUgKSxcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDEuNSApLFxuXHRcdFx0XHRnZXRDb25zdGFudFZhbHVlTm9kZSggMC44IClcblx0XHRcdF1cblx0XHR9XG5cdH0sXG5cdCdWb3Jvbm9pVVYnOiB7XG5cdFx0Y2xhc3NPYmplY3Q6IFJlbGllZk5vZGVWb3Jvbm9pVVYsXG5cdFx0cGFyYW1ldGVyczogW1xuXHRcdFx0Z2V0TW9kZVBhcmFtZXRlclNpZ25hdHVyZSgpLFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnTnVtYmVyIG9mIHBvaW50cycsXG5cdFx0XHRcdHR5cGU6ICdudW1iZXInXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnTGluZSB0aGlja25lc3MnLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH1cblx0XHRdLFxuXHRcdGRlZmF1bHROb2RlVmFsdWU6IHtcblx0XHRcdHBhcmFtZXRlclZhbHVlczogW1xuXHRcdFx0XHRDb25zdGFudHMuUkVMSUVGX0VNQk9TUyxcblx0XHRcdFx0NTAsXG5cdFx0XHRcdGdldENvbnN0YW50VmFsdWVOb2RlKCAwLjAxIClcblx0XHRcdF1cblx0XHR9XG5cdH0sXG5cdCdDaXJjbGVzJzoge1xuXHRcdGNsYXNzT2JqZWN0OiBSZWxpZWZOb2RlQ2lyY2xlcyxcblx0XHRwYXJhbWV0ZXJzOiBbXG5cdFx0XHRnZXRNb2RlUGFyYW1ldGVyU2lnbmF0dXJlKCksXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdOdW1iZXIgb2YgY2lyY2xlcycsXG5cdFx0XHRcdHR5cGU6ICdudW1iZXInXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnT2Zmc2V0IFUnLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdPZmZzZXQgVicsXG5cdFx0XHRcdHR5cGU6ICdub2RlJ1xuXHRcdFx0fVxuXHRcdF0sXG5cdFx0ZGVmYXVsdE5vZGVWYWx1ZToge1xuXHRcdFx0cGFyYW1ldGVyVmFsdWVzOiBbXG5cdFx0XHRcdENvbnN0YW50cy5SRUxJRUZfRU1CT1NTLFxuXHRcdFx0XHQxMCxcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIC0gMC41ICksXG5cdFx0XHRcdGdldENvbnN0YW50VmFsdWVOb2RlKCAtIDAuNSApXG5cdFx0XHRdXG5cdFx0fVxuXHR9LFxuXHQnU3BvdHMnOiB7XG5cdFx0Y2xhc3NPYmplY3Q6IFJlbGllZk5vZGVTcG90cyxcblx0XHRwYXJhbWV0ZXJzOiBbXG5cdFx0XHRnZXRNb2RlUGFyYW1ldGVyU2lnbmF0dXJlKCksXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdTaXplIFUnLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdTaXplIFYnLFxuXHRcdFx0XHR0eXBlOiAnbm9kZSdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdTcG90IHJhZGl1cycsXG5cdFx0XHRcdHR5cGU6ICdub2RlJ1xuXHRcdFx0fVxuXHRcdF0sXG5cdFx0ZGVmYXVsdE5vZGVWYWx1ZToge1xuXHRcdFx0cGFyYW1ldGVyVmFsdWVzOiBbXG5cdFx0XHRcdENvbnN0YW50cy5SRUxJRUZfRU1CT1NTLFxuXHRcdFx0XHRnZXRDb25zdGFudFZhbHVlTm9kZSggMC4xICksXG5cdFx0XHRcdGdldENvbnN0YW50VmFsdWVOb2RlKCAwLjEgKSxcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDAuMyApLFxuXHRcdFx0XVxuXHRcdH1cblx0fSxcblx0J1ByZXNldCc6IHtcblx0XHRjbGFzc09iamVjdDogUmVsaWVmTm9kZVByZXNldCxcblx0XHRwYXJhbWV0ZXJzOiBbXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdQcmVzZXQgbmFtZScsXG5cdFx0XHRcdHR5cGU6ICdwcmVzZXQnXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRkZWZhdWx0Tm9kZVZhbHVlOiB7XG5cdFx0XHRwYXJhbWV0ZXJWYWx1ZXM6IFtcblx0XHRcdFx0XCJcIlxuXHRcdFx0XVxuXHRcdH1cblx0fSxcblx0J01hdGVyaWFsU2VsZWN0b3InOiB7XG5cdFx0Y2xhc3NPYmplY3Q6IFJlbGllZk5vZGVNYXRlcmlhbFNlbGVjdG9yLFxuXHRcdHBhcmFtZXRlcnM6IFtcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ01hdGVyaWFscycsXG5cdFx0XHRcdHR5cGU6ICdub2RlYXJyYXknXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRkZWZhdWx0Tm9kZVZhbHVlOiB7XG5cdFx0XHRwYXJhbWV0ZXJWYWx1ZXM6IFtcblx0XHRcdFx0WyBdXG5cdFx0XHRdXG5cdFx0fVxuXHR9LFxuXHQnTXVsdGlwbGV4Jzoge1xuXHRcdGNsYXNzT2JqZWN0OiBSZWxpZWZOb2RlTXVsdGlwbGV4LFxuXHRcdHBhcmFtZXRlcnM6IFtcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ05vZGVzJyxcblx0XHRcdFx0dHlwZTogJ25vZGVhcnJheSdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdJbmRleCcsXG5cdFx0XHRcdHR5cGU6ICdub2RlJ1xuXHRcdFx0fVxuXHRcdF0sXG5cdFx0ZGVmYXVsdE5vZGVWYWx1ZToge1xuXHRcdFx0cGFyYW1ldGVyVmFsdWVzOiBbXG5cdFx0XHRcdFsgXSxcblx0XHRcdFx0Z2V0Q29uc3RhbnRWYWx1ZU5vZGUoIDAgKVxuXHRcdFx0XVxuXHRcdH1cblx0fVxuXG59O1xuXG5PYmplY3Qua2V5cyggcmVsaWVmTm9kZUNsYXNzZXMgKS5mb3JFYWNoKCAoIGNsYXNzTmFtZSApID0+IHtcblxuXHRyZWxpZWZOb2RlQ2xhc3Nlc1sgY2xhc3NOYW1lIF0uY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuXHRyZWxpZWZOb2RlQ2xhc3Nlc1sgY2xhc3NOYW1lIF0uZGVmYXVsdE5vZGVWYWx1ZS5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG5cbn0gKTtcblxuZXhwb3J0IHsgcmVsaWVmTm9kZUNsYXNzZXMgfTtcbiIsIi8qXG5NaW5jZSBTbGljZXJcblxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDIxIEp1YW4gSm9zZSBMdW5hIEVzcGlub3NhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cblxuKi9cblxuaW1wb3J0IHtcblx0VmVjdG9yMixcblx0VmVjdG9yMyxcblx0UXVhdGVybmlvbixcblx0TWF0cml4NCxcblx0Qm94Myxcblx0VHJpYW5nbGUsXG5cdE1lc2gsXG5cdFJheWNhc3Rlcixcblx0TWVzaFBob25nTWF0ZXJpYWwsXG5cdFNwaGVyZUdlb21ldHJ5LFxuXHREb3VibGVTaWRlLFxuXHRCYWNrU2lkZSxcblx0QnVmZmVyR2VvbWV0cnlcbn0gZnJvbSAndGhyZWUnO1xuaW1wb3J0IHsgQnVmZmVyR2VvbWV0cnlVdGlscyB9IGZyb20gJ3RocmVlL2V4YW1wbGVzL2pzbS91dGlscy9CdWZmZXJHZW9tZXRyeVV0aWxzLmpzJztcbmltcG9ydCB7IE1lc2hCVkggfSBmcm9tICd0aHJlZS1tZXNoLWJ2aCc7XG5pbXBvcnQgeyBTaW1wbGV4Tm9pc2UgfSBmcm9tICd0aHJlZS9leGFtcGxlcy9qc20vbWF0aC9TaW1wbGV4Tm9pc2UuanMnO1xuXG5pbXBvcnQgeyBQc2V1ZG9SYW5kb21HZW5lcmF0b3IsIENhY2hlZFJhbmRvbUdlbmVyYXRvciB9IGZyb20gJy4uL3V0aWxzL1JhbmRvbS5qcyc7XG5pbXBvcnQgeyByZWxpZWZOb2RlQ2xhc3NlcyB9IGZyb20gJy4uL25vZGVzL3JlbGllZk5vZGVDbGFzc2VzLmpzJztcbmltcG9ydCB7IFJlbGllZk5vZGUgfSBmcm9tICcuLi9ub2Rlcy9SZWxpZWZOb2RlLmpzJztcbmltcG9ydCB7IFJlbGllZk5vZGVDb25zdGFudCB9IGZyb20gJy4uL25vZGVzL1JlbGllZk5vZGVDb25zdGFudC5qcyc7XG5cbmNsYXNzIFNsaWNlciB7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cblx0XHR0aGlzLm1lc2ggPSBudWxsO1xuXHRcdHRoaXMuYnZoID0gbnVsbDtcblx0XHR0aGlzLnNldHRpbmdzID0gbnVsbDtcblx0XHR0aGlzLnJheWNhc3RlciA9IG5ldyBSYXljYXN0ZXIoIG5ldyBWZWN0b3IzKCksIG5ldyBWZWN0b3IzKCAwLCAwLCAxICkgKTtcblx0XHR0aGlzLnJlbGllZlByZXNldCA9IG51bGw7XG5cdFx0dGhpcy5yZWxpZWZOb2RlID0gbnVsbDtcblxuXHRcdC8vIFRlbXAgdmFyaWFibGVzXG5cblx0XHR0aGlzLnZveGVsUG9zaXRpb24gPSBuZXcgVmVjdG9yMygpO1xuXHRcdHRoaXMuY2xvc2VzdFBvaW50ID0gbmV3IFZlY3RvcjMoKTtcblx0XHR0aGlzLmNsb3Nlc3RVVkRpc3RhbmNlID0gbmV3IFZlY3RvcjMoKTtcblx0XHR0aGlzLmNsb3Nlc3ROb3JtYWwgPSBuZXcgVmVjdG9yMygpO1xuXHRcdHRoaXMudXZDb29yZHMgPSBuZXcgVmVjdG9yMigpO1xuXHRcdHRoaXMuYm94MyA9IG5ldyBCb3gzKCk7XG5cdFx0dGhpcy5tYXRyaXg0SWRlbnRpdHkgPSBuZXcgTWF0cml4NCgpLmlkZW50aXR5KCk7XG5cdFx0dGhpcy52ZWMzMSA9IG5ldyBWZWN0b3IzKCk7XG5cblx0XHR0aGlzLmluZGljZXMgPSBudWxsO1xuXHRcdHRoaXMucG9zaXRpb25zID0gbnVsbDtcblx0XHR0aGlzLnV2cyA9IG51bGw7XG5cblx0XHR0aGlzLnZBID0gbmV3IFZlY3RvcjMoKTtcblx0XHR0aGlzLnZCID0gbmV3IFZlY3RvcjMoKTtcblx0XHR0aGlzLnZDID0gbmV3IFZlY3RvcjMoKTtcblxuXHRcdHRoaXMudXZBID0gbmV3IFZlY3RvcjIoKTtcblx0XHR0aGlzLnV2QiA9IG5ldyBWZWN0b3IyKCk7XG5cdFx0dGhpcy51dkMgPSBuZXcgVmVjdG9yMigpO1xuXG5cdFx0dGhpcy5ncm91cHMgPSBudWxsO1xuXG5cdFx0dGhpcy5pbnNpZGVTb2xpZERpcmVjdGlvbiA9IG5ldyBWZWN0b3IzKCAxLjIzNDU2Nzg5LCAwLjEyMzQ1Njc4OSwgMC41Njc4OTEyMzQgKS5ub3JtYWxpemUoKTtcblxuXHR9XG5cblx0c2V0dXBQcmludCggZ2VvbWV0cnksIGltYWdlcywgc2V0dGluZ3MgKSB7XG5cblx0XHR0aGlzLm1lc2ggPSBuZXcgTWVzaCggZ2VvbWV0cnksIG5ldyBNZXNoUGhvbmdNYXRlcmlhbCggeyBzaWRlOiBEb3VibGVTaWRlIH0gKSApO1xuXG5cdFx0dGhpcy5idmggPSBcdG5ldyBNZXNoQlZIKCBnZW9tZXRyeSApO1xuXG5cdFx0dGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzO1xuXG5cdFx0aWYgKCBzZXR0aW5ncy5yZWxpZWZFbmFibGVkICkge1xuXG5cdFx0XHR0aGlzLnJlbGllZlByZXNldCA9IHRoaXMuc2V0dGluZ3MucmVsaWVmUHJlc2V0c1sgdGhpcy5zZXR0aW5ncy5yZWxpZWZQcmVzZXROYW1lIF07XG5cblx0XHRcdHRoaXMuY29udGV4dCA9IFNsaWNlci5jcmVhdGVDb250ZXh0KCB0aGlzLnJlbGllZlByZXNldCA/IHRoaXMucmVsaWVmUHJlc2V0LnJhbmRvbVNlZWQgOiAwLCBpbWFnZXMsIHNldHRpbmdzLnJlbGllZlByZXNldHMgKTtcblxuXHRcdFx0Y29uc3QgcmVsaWVmTm9kZUpTT04gPSB0aGlzLnJlbGllZlByZXNldCA/IHRoaXMucmVsaWVmUHJlc2V0LnJlbGllZk5vZGVKU09OIDogbnVsbDtcblxuXHRcdFx0dGhpcy5yZWxpZWZOb2RlID0gUmVsaWVmTm9kZS5tYWtlUmVsaWVmVHJlZUZyb21KU09OKCByZWxpZWZOb2RlSlNPTiwgdGhpcy5jb250ZXh0ICk7XG5cblx0XHRcdGNvbnN0IGVyciA9IHRoaXMucmVsaWVmTm9kZSA/IHRoaXMucmVsaWVmTm9kZS5pc1ZhbGlkKCkgOiBudWxsO1xuXG5cdFx0XHRpZiAoIHRoaXMucmVsaWVmTm9kZSApIHtcblxuXHRcdFx0XHRpZiAoIGVyciApIHtcblxuXHRcdFx0XHRcdGNvbnNvbGUud2FybiggZXJyICk7XG5cdFx0XHRcdFx0dGhpcy5yZWxpZWZOb2RlID0gbnVsbDtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdH1cblx0XHRlbHNlIHtcblxuXHRcdFx0dGhpcy5yZWxpZWZOb2RlID0gbnVsbDtcblx0XHRcdHRoaXMuY29udGV4dCA9IG51bGw7XG5cblx0XHR9XG5cblx0XHRpZiAoICggc2V0dGluZ3MuYW50aWFsaWFzaW5nTGV2ZWwgIT09IDEgKSAmJiAoICEgdGhpcy5yZWxpZWZOb2RlICkgKSB7XG5cblx0XHRcdC8vIEZvcmNlIHJlbmRlcmluZyB3aXRoIG5vZGVzIGlmIGFudGlhbGlhc2luZyBpcyBzZXRcblxuXHRcdFx0aWYgKCAhIHRoaXMuY29udGV4dCApIHtcblxuXHRcdFx0XHR0aGlzLmNvbnRleHQgPSBTbGljZXIuY3JlYXRlQ29udGV4dCggMCwgaW1hZ2VzLCBzZXR0aW5ncy5yZWxpZWZQcmVzZXRzICk7XG5cclx0XHRcdH1cblxuXHRcdFx0dGhpcy5yZWxpZWZOb2RlID0gbmV3IFJlbGllZk5vZGVDb25zdGFudChcblx0XHRcdFx0XCJcIixcblx0XHRcdFx0cmVsaWVmTm9kZUNsYXNzZXNbIFwiQ29uc3RhbnRcIiBdLnBhcmFtZXRlcnMsXG5cdFx0XHRcdFsgMCBdLFxuXHRcdFx0XHR0aGlzLmNvbnRleHRcblx0XHRcdCk7XG5cblx0XHR9XG5cblx0XHRpZiAoIHRoaXMucmVsaWVmTm9kZSApIHtcblxuXHRcdFx0dGhpcy5pbmRpY2VzID0gdGhpcy5idmguZ2VvbWV0cnkuZ2V0SW5kZXgoKS5hcnJheTtcblx0XHRcdHRoaXMucG9zaXRpb25zID0gdGhpcy5idmguZ2VvbWV0cnkuZ2V0QXR0cmlidXRlKCAncG9zaXRpb24nICk7XG5cdFx0XHR0aGlzLnV2cyA9IHRoaXMuYnZoLmdlb21ldHJ5LmdldEF0dHJpYnV0ZSggJ3V2JyApO1xuXHRcdFx0dGhpcy5ncm91cHMgPSB0aGlzLmJ2aC5nZW9tZXRyeS5ncm91cHM7XG5cblx0XHR9XG5cblx0fVxuXG5cdHN0YXRpYyBjcmVhdGVDb250ZXh0KCByYW5kb21TZWVkLCBpbWFnZXMsIHByZXNldHMgKSB7XG5cblx0XHRjb25zdCBwcm5nID0gbmV3IFBzZXVkb1JhbmRvbUdlbmVyYXRvcigpO1xuXHRcdGNvbnN0IGNhY2hlZFBybmcgPSBuZXcgQ2FjaGVkUmFuZG9tR2VuZXJhdG9yKCAyMDAwMDAwLCBwcm5nLCByYW5kb21TZWVkICk7XG5cdFx0Y29uc3Qgc2ltcGxleCA9IG5ldyBTaW1wbGV4Tm9pc2UoIGNhY2hlZFBybmcgKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRwcm5nOiBjYWNoZWRQcm5nLFxuXHRcdFx0c2ltcGxleDogc2ltcGxleCxcblx0XHRcdGltYWdlczogaW1hZ2VzLFxuXHRcdFx0cHJlc2V0czogcHJlc2V0c1xuXHRcdH07XG5cclx0fVxuXG5cdHNsaWNlTGF5ZXIoIGxheWVySW5kZXgsIGltYWdlICkge1xuXG5cdFx0aWYgKCB0aGlzLnJlbGllZk5vZGUgKSB7XG5cblx0XHRcdHRoaXMuc2xpY2VMYXllcldpdGhEaXN0YW5jZSggbGF5ZXJJbmRleCwgaW1hZ2UgKTtcblxuXHRcdH1cblx0XHRlbHNlIHtcblxuXHRcdFx0dGhpcy5zbGljZUxheWVyUmF5Y2FzdGluZyggbGF5ZXJJbmRleCwgaW1hZ2UgKTtcblxuXHRcdH1cblxuXHR9XG5cblx0c2xpY2VMYXllclJheWNhc3RpbmcoIGxheWVySW5kZXgsIGltYWdlICkge1xuXG5cdFx0Ly8gUmF5Y2FzdCBsYXllciBzZWN0aW9uIChubyBhbnRpYWxpYXNpbmcpXG5cblx0XHQvKlxuXHRcdFx0QmV3YXJlIGRpZmZlcmVudCBjb29yZGluYXRlIHN5c3RlbSBheGlzOlxuXHRcdFx0WCBpbiBtYWNoaW5lIGlzIFogaW4gVGhyZWUuanNcblx0XHRcdFkgaW4gbWFjaGluZSBpcyBYIGluIFRocmVlLmpzXG5cdFx0XHRaIGluIG1hY2hpbmUgaXMgWSBpbiBUaHJlZS5qc1xuXHRcdCovXG5cdFx0Y29uc3QgbGF5ZXJIZWlnaHQgPSB0aGlzLnNldHRpbmdzLmxheWVySGVpZ2h0O1xuXHRcdGNvbnN0IGluaXRpYWxSYXlaID0gLSB0aGlzLnNldHRpbmdzLm1hY2hpbmVYICogMC41IC0gdGhpcy5zZXR0aW5ncy5tYXhEaXN0YW5jZTtcblx0XHRjb25zdCByZXNvbHV0aW9uWCA9IHRoaXMuc2V0dGluZ3MucmVzb2x1dGlvblk7XG5cdFx0Y29uc3QgcmVzb2x1dGlvblogPSB0aGlzLnNldHRpbmdzLnJlc29sdXRpb25YO1xuXHRcdGNvbnN0IHZveGVsWFNpemUgPSB0aGlzLnNldHRpbmdzLm1hY2hpbmVZIC8gcmVzb2x1dGlvblg7XG5cdFx0Y29uc3Qgdm94ZWxaU2l6ZSA9IHRoaXMuc2V0dGluZ3MubWFjaGluZVggLyByZXNvbHV0aW9uWjtcblx0XHRjb25zdCBpbml0aWFsTGF5ZXJSYXlYID0gdGhpcy5zZXR0aW5ncy5tYWNoaW5lWSAqIDAuNSAtIHZveGVsWFNpemUgKiAwLjU7XG5cdFx0Y29uc3QgcGl4ZWxPZmZzZXQgPSB0aGlzLnNldHRpbmdzLm1hY2hpbmVYICogMC41O1xuXG5cdFx0Y29uc3QgbWVzaCA9IHRoaXMubWVzaDtcblx0XHRjb25zdCByYXljYXN0ZXIgPSB0aGlzLnJheWNhc3Rlcjtcblx0XHRjb25zdCByYXkgPSB0aGlzLnJheWNhc3Rlci5yYXk7XG5cdFx0Y29uc3QgYnZoID0gdGhpcy5idmg7XG5cblx0XHRyYXkuZGlyZWN0aW9uLnNldCggMCwgMCwgMSApO1xuXG5cdFx0Ly8gQ2xlYXIgaW1hZ2Vcblx0XHRpbWFnZS5maWxsKCAwICk7XG5cblx0XHQvLyBDYXN0IHJheXMgYWNyb3NzIHRoZSBsYXllclxuXHRcdGZvciAoIGxldCBsYXllclJheUluZGV4ID0gMDsgbGF5ZXJSYXlJbmRleCA8IHJlc29sdXRpb25YOyBsYXllclJheUluZGV4ICsrICkge1xuXG5cdFx0XHRsZXQgeCA9IGluaXRpYWxMYXllclJheVggLSBsYXllclJheUluZGV4ICogdm94ZWxYU2l6ZTtcblx0XHRcdHRoaXMucmF5Y2FzdGVyLnJheS5vcmlnaW4uc2V0KCB4LCBsYXllckhlaWdodCAqICggbGF5ZXJJbmRleCArIDAuNSApLCBpbml0aWFsUmF5WiApO1xuXG5cdFx0XHRjb25zdCBpbnRlcnNlY3Rpb25zID0gWyBdO1xuXHRcdFx0YnZoLnJheWNhc3QoIG1lc2gsIHJheWNhc3RlciwgcmF5LCBpbnRlcnNlY3Rpb25zICk7XG5cblx0XHRcdC8vIGludGVyc2VjdHNbIGkgXS4gZGlzdGFuY2UgcG9pbnQgdXYgZmFjZS5ub3JtYWxcblxuXHRcdFx0aW50ZXJzZWN0aW9ucy5zb3J0KCAoIGEsIGIgKSA9PiB7XG5cdFx0XHRcdGlmICggYS5kaXN0YW5jZSA9PT0gYi5kaXN0YW5jZSApIHJldHVybiAwO1xuXHRcdFx0XHRyZXR1cm4gYS5kaXN0YW5jZSA8IGIuZGlzdGFuY2UgPyAtIDEgOiAxO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRjb25zdCBmaXJzdFBpeGVsSW5kZXggPSBsYXllclJheUluZGV4ICogcmVzb2x1dGlvblo7XG5cblx0XHRcdC8vIFNldCBwaXhlbHMgd2hpY2ggYXJlIGluc2lkZSB0aGUgc29saWRzXG5cdFx0XHRjb25zdCBudW1JbnRlcnNlY3Rpb25zID0gaW50ZXJzZWN0aW9ucy5sZW5ndGg7XG5cdFx0XHRsZXQgaW50ZXJzZWN0aW9uSW5kZXgwID0gMDtcblx0XHRcdHdoaWxlICggaW50ZXJzZWN0aW9uSW5kZXgwIDwgbnVtSW50ZXJzZWN0aW9ucyApIHtcblxuXHRcdFx0XHQvLyBGaW5kIGZyb250LWZhY2luZyBpbnRlcnNlY3Rpb25cblx0XHRcdFx0bGV0IGludGVyc2VjdGlvbjA7XG5cdFx0XHRcdHdoaWxlICggaW50ZXJzZWN0aW9uSW5kZXgwIDwgbnVtSW50ZXJzZWN0aW9ucyApIHtcblxuXHRcdFx0XHRcdGludGVyc2VjdGlvbjAgPSBpbnRlcnNlY3Rpb25zWyBpbnRlcnNlY3Rpb25JbmRleDAgXTtcblxuXHRcdFx0XHRcdC8vY29uc3QgaXNGcm9udEZhY2luZyA9IGludGVyc2VjdGlvbjAuZmFjZS5ub3JtYWwueCA8IDA7XG5cdFx0XHRcdFx0Y29uc3QgaXNGcm9udEZhY2luZyA9IGludGVyc2VjdGlvbjAuZmFjZS5ub3JtYWwuZG90KCByYXljYXN0ZXIucmF5LmRpcmVjdGlvbiApIDwgMDtcblxuXHRcdFx0XHRcdC8vIEZvdW5kIGl0XG5cdFx0XHRcdFx0aWYgKCBpc0Zyb250RmFjaW5nICkgYnJlYWs7XG5cblx0XHRcdFx0XHRpbnRlcnNlY3Rpb25JbmRleDAgKys7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggaW50ZXJzZWN0aW9uSW5kZXgwID49IG51bUludGVyc2VjdGlvbnMgKSBicmVhaztcblxuXHRcdFx0XHQvLyBGaW5kIGJhY2stZmFjaW5nIGludGVyc2VjdGlvbiBhZnRlciB0aGUgcmF5IGhhcyBsZWZ0IGFsbCBjb250YWluZWQgc29saWRzIGJlaGluZC5cblx0XHRcdFx0bGV0IG51bVNvbGlkc0luc2lkZSA9IDA7XG5cdFx0XHRcdGxldCBpbnRlcnNlY3Rpb25JbmRleDEgPSBpbnRlcnNlY3Rpb25JbmRleDAgKyAxO1xuXHRcdFx0XHRsZXQgaW50ZXJzZWN0aW9uMTtcblx0XHRcdFx0d2hpbGUgKCBpbnRlcnNlY3Rpb25JbmRleDEgPCBudW1JbnRlcnNlY3Rpb25zICkge1xuXG5cdFx0XHRcdFx0aW50ZXJzZWN0aW9uMSA9IGludGVyc2VjdGlvbnNbIGludGVyc2VjdGlvbkluZGV4MSBdO1xuXG5cdFx0XHRcdFx0Ly9jb25zdCBpc0Zyb250RmFjaW5nID0gaW50ZXJzZWN0aW9uMS5mYWNlLm5vcm1hbC54IDwgMDtcblx0XHRcdFx0XHRjb25zdCBpc0Zyb250RmFjaW5nID0gaW50ZXJzZWN0aW9uMS5mYWNlLm5vcm1hbC5kb3QoIHJheWNhc3Rlci5yYXkuZGlyZWN0aW9uICkgPCAwO1xuXG5cdFx0XHRcdFx0aWYgKCAhIGlzRnJvbnRGYWNpbmcgKSB7XG5cblx0XHRcdFx0XHRcdGlmICggbnVtU29saWRzSW5zaWRlID09PSAwICkge1xuXHRcdFx0XHRcdFx0XHQvLyBGb3VuZCBpdFxuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0bnVtU29saWRzSW5zaWRlIC0tO1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgbnVtU29saWRzSW5zaWRlICsrO1xuXG5cdFx0XHRcdFx0aW50ZXJzZWN0aW9uSW5kZXgxICsrO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIGludGVyc2VjdGlvbkluZGV4MSA+PSBudW1JbnRlcnNlY3Rpb25zICkgYnJlYWs7XG5cblx0XHRcdFx0dmFyIG1pblhJbmRleCA9IE1hdGgubWF4KCAwLCBNYXRoLm1pbiggcmVzb2x1dGlvblogLSAxLCBNYXRoLmZsb29yKCAoIGludGVyc2VjdGlvbjAucG9pbnQueiArIHBpeGVsT2Zmc2V0ICkgLyB2b3hlbFpTaXplICkgKSApO1xuXHRcdFx0XHR2YXIgbWF4WEluZGV4ID0gTWF0aC5tYXgoIDAsIE1hdGgubWluKCByZXNvbHV0aW9uWiAtIDEsIE1hdGgucm91bmQoICggaW50ZXJzZWN0aW9uMS5wb2ludC56ICsgcGl4ZWxPZmZzZXQgKSAvIHZveGVsWlNpemUgKSApICk7XG5cblx0XHRcdFx0aW1hZ2UuZmlsbCggMjU1LCBmaXJzdFBpeGVsSW5kZXggKyBtaW5YSW5kZXgsIGZpcnN0UGl4ZWxJbmRleCArIG1heFhJbmRleCApO1xuXG5cdFx0XHRcdGludGVyc2VjdGlvbkluZGV4MCA9IGludGVyc2VjdGlvbkluZGV4MSArIDE7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9XG5cblx0c3RhdGljIGlzRnJvbnRGYWNpbmdJbnRlcnNlY3Rpb24oIGludGVyc2VjdGlvbiwgZGlyZWN0aW9uICkge1xuXG5cdFx0cmV0dXJuIGludGVyc2VjdGlvbi5mYWNlLm5vcm1hbC5kb3QoIGRpcmVjdGlvbiApIDwgMDtcblxuXHR9XG5cblx0c2xpY2VMYXllcldpdGhEaXN0YW5jZSggbGF5ZXJJbmRleCwgaW1hZ2UgKSB7XG5cblx0XHRjb25zdCBzY29wZSA9IHRoaXM7XG5cblx0XHQvLyBSYXljYXN0IGxheWVyIHNlY3Rpb24gYnkgY29tcHV0aW5nIGRpc3RhbmNlIHRvIHN1cmZhY2UsIHRha2luZyBpbnRvIGFjY291bnQgcmVsaWVmL2VtYm9zcyB0ZXh0dXJlXG5cblx0XHQvKlxuXHRcdFx0QmV3YXJlIGRpZmZlcmVudCBjb29yZGluYXRlIHN5c3RlbSBheGlzOlxuXHRcdFx0WCBpbiBtYWNoaW5lIGlzIFogaW4gVGhyZWUuanNcblx0XHRcdFkgaW4gbWFjaGluZSBpcyBYIGluIFRocmVlLmpzXG5cdFx0XHRaIGluIG1hY2hpbmUgaXMgWSBpbiBUaHJlZS5qc1xuXHRcdCovXG5cdFx0Y29uc3QgbGF5ZXJIZWlnaHQgPSB0aGlzLnNldHRpbmdzLmxheWVySGVpZ2h0O1xuXHRcdGNvbnN0IHJlc29sdXRpb25YID0gdGhpcy5zZXR0aW5ncy5yZXNvbHV0aW9uWTtcblx0XHRjb25zdCByZXNvbHV0aW9uWiA9IHRoaXMuc2V0dGluZ3MucmVzb2x1dGlvblg7XG5cdFx0Y29uc3Qgdm94ZWxYU2l6ZSA9IHRoaXMuc2V0dGluZ3MubWFjaGluZVkgLyByZXNvbHV0aW9uWDtcblx0XHRjb25zdCB2b3hlbFpTaXplID0gdGhpcy5zZXR0aW5ncy5tYWNoaW5lWCAvIHJlc29sdXRpb25aO1xuXHRcdGNvbnN0IGluaXRpYWxSYXlaID0gLSB0aGlzLnNldHRpbmdzLm1hY2hpbmVYICogMC41ICsgdm94ZWxaU2l6ZSAqIDAuNTtcblx0XHRjb25zdCBpbml0aWFsUmF5WCA9IHRoaXMuc2V0dGluZ3MubWFjaGluZVkgKiAwLjUgLSB2b3hlbFhTaXplICogMC41O1xuXHRcdGNvbnN0IHkgPSBsYXllckhlaWdodCAqIGxheWVySW5kZXg7XG5cdFx0Y29uc3QgcGl4ZWxPZmZzZXRYID0gdGhpcy5zZXR0aW5ncy5tYWNoaW5lWSAqIDAuNTtcblx0XHRjb25zdCBwaXhlbE9mZnNldFogPSB0aGlzLnNldHRpbmdzLm1hY2hpbmVYICogMC41O1xuXHRcdGNvbnN0IGFudGlhbGlhc2luZyA9IE1hdGguZmxvb3IoIHRoaXMuc2V0dGluZ3MuYW50aWFsaWFzaW5nTGV2ZWwgKTtcblxuXHRcdGNvbnN0IG1lc2ggPSB0aGlzLm1lc2g7XG5cdFx0Y29uc3QgcmF5Y2FzdGVyID0gdGhpcy5yYXljYXN0ZXI7XG5cdFx0Y29uc3QgcmF5ID0gdGhpcy5yYXljYXN0ZXIucmF5O1xuXHRcdGNvbnN0IGJ2aCA9IHRoaXMuYnZoO1xuXHRcdGNvbnN0IGJveDMgPSB0aGlzLmJveDM7XG5cdFx0Y29uc3QgbWF0cml4NElkZW50aXR5ID0gdGhpcy5tYXRyaXg0SWRlbnRpdHk7XG5cdFx0Y29uc3QgdXZDb29yZHMgPSB0aGlzLnV2Q29vcmRzO1xuXHRcdGNvbnN0IHZveGVsUG9zaXRpb24gPSB0aGlzLnZveGVsUG9zaXRpb247XG5cdFx0Y29uc3QgY2xvc2VzdFBvaW50ID0gdGhpcy5jbG9zZXN0UG9pbnQ7XG5cdFx0Y29uc3QgY2xvc2VzdFVWRGlzdGFuY2UgPSB0aGlzLmNsb3Nlc3RVVkRpc3RhbmNlO1xuXHRcdGNvbnN0IGNsb3Nlc3ROb3JtYWwgPSB0aGlzLmNsb3Nlc3ROb3JtYWw7XG5cblx0XHR0aGlzLmNvbnRleHQucHJuZy5zZXRTZWVkKCAwICk7XG5cblx0XHRjb25zdCByZWxpZWZOb2RlID0gdGhpcy5yZWxpZWZOb2RlO1xuXHRcdGNvbnN0IHJlbGllZk1heFNpemUgPSB0aGlzLnJlbGllZlByZXNldCA/IHRoaXMucmVsaWVmUHJlc2V0Lm1heEhlaWdodCA6IDA7XG5cblx0XHRjb25zdCBzdWJ2b3hlbENvbnRyaWJ1dGlvbiA9IDI1NiAvIE1hdGgucG93KCBhbnRpYWxpYXNpbmcsIDMgKTtcblx0XHQvL2NvbnN0IHN1YnZveGVsQ29udHJpYnV0aW9uID0gMjU2IC8gTWF0aC5wb3coIGFudGlhbGlhc2luZywgMiApO1xuXG5cdFx0Y29uc3QgYW50aWFsaWFzaW5nVm94ZWxTaXplRmFjdG9yID0gYW50aWFsaWFzaW5nID09PSAxID8gMSA6IDEgKyBhbnRpYWxpYXNpbmcgKiAwLjI7XG5cdFx0Y29uc3QgYW50aWFsaWFzaW5nVm94ZWxTaXplWCA9IGFudGlhbGlhc2luZ1ZveGVsU2l6ZUZhY3RvciAqIHZveGVsWFNpemU7XG5cdFx0Y29uc3QgYW50aWFsaWFzaW5nVm94ZWxTaXplWiA9IGFudGlhbGlhc2luZ1ZveGVsU2l6ZUZhY3RvciAqIHZveGVsWlNpemU7XG5cdFx0Y29uc3QgYW50aWFsaWFzaW5nVm94ZWxTaXplWSA9IGFudGlhbGlhc2luZ1ZveGVsU2l6ZUZhY3RvciAqIGxheWVySGVpZ2h0O1xuXHRcdGNvbnN0IHN1YlBvc1hJbmMgPSBhbnRpYWxpYXNpbmdWb3hlbFNpemVYIC8gYW50aWFsaWFzaW5nO1xuXHRcdGNvbnN0IHN1YlBvc1pJbmMgPSBhbnRpYWxpYXNpbmdWb3hlbFNpemVaIC8gYW50aWFsaWFzaW5nO1xuXHRcdGNvbnN0IHN1YlBvc1lJbmMgPSBhbnRpYWxpYXNpbmdWb3hlbFNpemVZIC8gYW50aWFsaWFzaW5nO1xuXHRcdGNvbnN0IHN1YlBvc1hPZmZzZXQgPSAwLjUgKiB2b3hlbFhTaXplIC0gYW50aWFsaWFzaW5nVm94ZWxTaXplWCAqIDAuNSArIDAuNSAqIHN1YlBvc1hJbmM7XG5cdFx0Y29uc3Qgc3ViUG9zWk9mZnNldCA9IDAuNSAqIHZveGVsWlNpemUgLSBhbnRpYWxpYXNpbmdWb3hlbFNpemVaICogMC41ICsgMC41ICogc3ViUG9zWkluYztcblx0XHRjb25zdCBzdWJQb3NZT2Zmc2V0ID0gMC41ICogbGF5ZXJIZWlnaHQgLSBhbnRpYWxpYXNpbmdWb3hlbFNpemVZICogMC41ICsgMC41ICogc3ViUG9zWUluYztcblxuXHRcdC8vIENsZWFyIGltYWdlXG5cdFx0aW1hZ2UuZmlsbCggMCApO1xuXG5cdFx0ZnVuY3Rpb24gaXNQb2ludEluc2lkZU1lc2goIHBvaW50ICkge1xuXG5cdFx0XHRjb25zdCBpbnRlcnNlY3Rpb25zID0gWyBdO1xuXG5cdFx0XHRyYXkub3JpZ2luLmNvcHkoIHBvaW50ICk7XG5cdFx0XHRyYXkuZGlyZWN0aW9uLmNvcHkoIHNjb3BlLmluc2lkZVNvbGlkRGlyZWN0aW9uICk7XG5cblx0XHRcdGJ2aC5yYXljYXN0KCBtZXNoLCByYXljYXN0ZXIsIHJheSwgaW50ZXJzZWN0aW9ucyApO1xuXG5cdFx0XHRpbnRlcnNlY3Rpb25zLnNvcnQoICggYSwgYiApID0+IHtcblx0XHRcdFx0aWYgKCBhLmRpc3RhbmNlID09PSBiLmRpc3RhbmNlICkgcmV0dXJuIDA7XG5cdFx0XHRcdHJldHVybiBhLmRpc3RhbmNlIDwgYi5kaXN0YW5jZSA/IC0gMSA6IDE7XG5cdFx0XHR9ICk7XG5cblx0XHRcdGxldCBudW1Tb2xpZHMgPSAwO1xuXHRcdFx0Zm9yICggbGV0IGkgPSAwLCBpbCA9IGludGVyc2VjdGlvbnMubGVuZ3RoOyBpIDwgaWw7IGkgKysgKSB7XG5cblx0XHRcdFx0Y29uc3QgaXNGcm9udEZhY2luZyA9IGludGVyc2VjdGlvbnNbIGkgXS5mYWNlLm5vcm1hbC5kb3QoIHJheWNhc3Rlci5yYXkuZGlyZWN0aW9uICkgPCAwO1xuXG5cdFx0XHRcdG51bVNvbGlkcyArPSBpc0Zyb250RmFjaW5nID8gMSA6IC0gMTtcblxyXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbnVtU29saWRzIDwgMDtcblxyXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGxheWVyRGlzdGFuY2VSZWN1cnNpdmUoIGkwLCBqMCwgaTEsIGoxICkge1xuXG5cdFx0XHQvLyBGaWxsIGltYWdlIHJlY3Vyc2l2ZWx5IGluIHF1YWQtcGFydGl0aW9uZWQgYm94ZXMgYW5kIHVzaW5nIGRpc3RhbmNlIHRvIHN1cmZhY2UuXG5cblx0XHRcdGlmICggaTEgPCBpMCB8fCBqMSA8IGowICkgcmV0dXJuO1xuXG5cdFx0XHRjb25zdCBkaSA9IGkxIC0gaTAgKyAxO1xuXHRcdFx0Y29uc3QgZGogPSBqMSAtIGowICsgMTtcblxuXHRcdFx0Ly8gTGVhZiBjb25kaXRpb25cblx0XHRcdGNvbnN0IGxlYWZTaXplVm94ZWxzID0gMTA7XG5cdFx0XHRpZiAoIGRpIDw9IGxlYWZTaXplVm94ZWxzIHx8IGRqIDw9IGxlYWZTaXplVm94ZWxzICkge1xuXG5cdFx0XHRcdGZvciAoIGxldCBtID0gMDsgbSA8IGRpOyBtICsrICkge1xuXG5cdFx0XHRcdFx0Zm9yICggbGV0IG4gPSAwOyBuIDwgZGo7IG4gKysgKSB7XG5cblx0XHRcdFx0XHRcdGxldCBjdXJyZW50Vm94ZWxDb250cmlidXRpb24gPSAwO1xuXG5cdFx0XHRcdFx0XHRsZXQgdlBvc1kgPSBzdWJQb3NZT2Zmc2V0O1xuXG5cdFx0XHRcdFx0XHRmb3IgKCBsZXQgdmsgPSAwOyB2ayA8IGFudGlhbGlhc2luZzsgdmsgKysgKSB7XG5cblx0XHRcdFx0XHRcdFx0bGV0IHZQb3NYID0gc3ViUG9zWE9mZnNldDtcblxuXHRcdFx0XHRcdFx0XHRmb3IgKCBsZXQgdmogPSAwOyB2aiA8IGFudGlhbGlhc2luZzsgdmogKysgKSB7XG5cblx0XHRcdFx0XHRcdFx0XHRsZXQgdlBvc1ogPSBzdWJQb3NaT2Zmc2V0O1xuXG5cdFx0XHRcdFx0XHRcdFx0Zm9yICggbGV0IHZpID0gMDsgdmkgPCBhbnRpYWxpYXNpbmc7IHZpICsrICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRzY29wZS52b3hlbFBvc2l0aW9uLnNldChcblx0XHRcdFx0XHRcdFx0XHRcdFx0LSAoIGkwICsgbSApICogdm94ZWxYU2l6ZSArIHBpeGVsT2Zmc2V0WCAtIHZQb3NYLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR5ICsgdlBvc1ksXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCggajAgKyBuICkgKiB2b3hlbFpTaXplIC0gcGl4ZWxPZmZzZXRaICsgdlBvc1pcblx0XHRcdFx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdC8vIFJlbGllZiBjb21wdXRhdGlvblxuXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBtYXRlcmlhbEluZGV4ID0gc2NvcGUuY2xvc2VzdFBvaW50VG9NZXNoKCB2b3hlbFBvc2l0aW9uLCBjbG9zZXN0UG9pbnQsIGNsb3Nlc3RVVkRpc3RhbmNlLCBjbG9zZXN0Tm9ybWFsICk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IGlzSW5zaWRlID0gaXNQb2ludEluc2lkZU1lc2goIHNjb3BlLnZveGVsUG9zaXRpb24gKTtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IGRpc3RhbmNlID0gY2xvc2VzdFVWRGlzdGFuY2UueiAqICggaXNJbnNpZGUgPyAtIDEgOiAxICk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdHV2Q29vcmRzLmNvcHkoIGNsb3Nlc3RVVkRpc3RhbmNlICk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdGxldCBub2RlVmFsdWUgPSByZWxpZWZOb2RlLmV2YWx1YXRlKCB1dkNvb3Jkcywgdm94ZWxQb3NpdGlvbiwgY2xvc2VzdE5vcm1hbCwgbWF0ZXJpYWxJbmRleCApO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCBpc05hTiggbm9kZVZhbHVlICkgKSBub2RlVmFsdWUgPSAwO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBoZWlnaHQgPSBNYXRoLm1heCggLSAxLCBNYXRoLm1pbiggMSwgbm9kZVZhbHVlICkgKSAqIHJlbGllZk1heFNpemU7XG5cblx0XHRcdFx0XHRcdFx0XHRcdGlmICggZGlzdGFuY2UgPD0gaGVpZ2h0ICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFN1YnZveGVsIGlzIHVuZGVyIHRoZSByZWxpZWYgc3VyZmFjZSBhbmQgaGVuY2UgaXMgc29saWRcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50Vm94ZWxDb250cmlidXRpb24gKz0gc3Vidm94ZWxDb250cmlidXRpb247XG5cblx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdFx0dlBvc1ogKz0gc3ViUG9zWkluYztcblxuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdHZQb3NYICs9IHN1YlBvc1hJbmM7XG5cblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdHZQb3NZICs9IHN1YlBvc1lJbmM7XG5cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKCBjdXJyZW50Vm94ZWxDb250cmlidXRpb24gPiAwICkge1xuXG5cdFx0XHRcdFx0XHRcdGltYWdlWyAoIGkwICsgbSApICogcmVzb2x1dGlvblogKyBuICsgajAgXSA9IE1hdGgubWluKCAyNTUsIGN1cnJlbnRWb3hlbENvbnRyaWJ1dGlvbiApO1xuXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblxuXHRcdFx0XHRjb25zdCBpSGFsZiA9IE1hdGguZmxvb3IoICggaTAgKyBpMSApICogMC41ICk7XG5cdFx0XHRcdGNvbnN0IGpIYWxmID0gTWF0aC5mbG9vciggKCBqMCArIGoxICkgKiAwLjUgKTtcblxuXHRcdFx0XHQvLyBDaGVjayBpZiBib3ggY29sbGlkZXMgd2l0aCBtZXNoXG5cblx0XHRcdFx0Ym94My5taW4uc2V0KCAtICggaTEgKyAxICkgKiB2b3hlbFhTaXplICsgcGl4ZWxPZmZzZXRYIC0gcmVsaWVmTWF4U2l6ZSwgeSAtIHJlbGllZk1heFNpemUsIGowICogdm94ZWxaU2l6ZSAtIHBpeGVsT2Zmc2V0WiAtIHJlbGllZk1heFNpemUgKTtcblx0XHRcdFx0Ym94My5tYXguc2V0KCAtICggaTAgKSAqIHZveGVsWFNpemUgKyBwaXhlbE9mZnNldFggKyByZWxpZWZNYXhTaXplLCB5ICsgcmVsaWVmTWF4U2l6ZSwgKCBqMSArIDEgKSAqIHZveGVsWlNpemUgLSBwaXhlbE9mZnNldFogKyByZWxpZWZNYXhTaXplICk7XG5cdFx0XHRcdGlmICggYnZoLmludGVyc2VjdHNCb3goIG51bGwsIGJveDMsIG1hdHJpeDRJZGVudGl0eSApICkge1xuXG5cdFx0XHRcdFx0Ly8gU3ViZGl2aXNpb24gb2YgYm94IGluIDQgc21hbGxlciBib3hlc1xuXG5cdFx0XHRcdFx0bGF5ZXJEaXN0YW5jZVJlY3Vyc2l2ZSggaTAsIGowLCBpSGFsZiwgakhhbGYgKTtcblx0XHRcdFx0XHRsYXllckRpc3RhbmNlUmVjdXJzaXZlKCBpMCwgakhhbGYgKyAxLCBpSGFsZiwgajEgKTtcblx0XHRcdFx0XHRsYXllckRpc3RhbmNlUmVjdXJzaXZlKCBpSGFsZiArIDEsIGowLCBpMSwgakhhbGYgKTtcblx0XHRcdFx0XHRsYXllckRpc3RhbmNlUmVjdXJzaXZlKCBpSGFsZiArIDEsIGpIYWxmICsgMSwgaTEsIGoxICk7XG5cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblxuXHRcdFx0XHRcdC8vIEJveCBkb2VzIG5vdCBpbnRlcnNlY3QuIElmIGluc2lkZSB0aGUgbWVzaCwgZmlsbCB0aGUgYm94IGVudGlyZWx5LlxuXG5cdFx0XHRcdFx0Ym94My5nZXRDZW50ZXIoIHNjb3BlLnZveGVsUG9zaXRpb24gKTtcblx0XHRcdFx0XHRpZiAoIGlzUG9pbnRJbnNpZGVNZXNoKCBzY29wZS52b3hlbFBvc2l0aW9uICkgKSB7XG5cblx0XHRcdFx0XHRcdGZvciAoIGxldCBtID0gMDsgbSA8IGRpOyBtICsrICkge1xuXG5cdFx0XHRcdFx0XHRcdGZvciAoIGxldCBuID0gMDsgbiA8IGRqOyBuICsrICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0aW1hZ2VbICggaTAgKyBtICkgKiByZXNvbHV0aW9uWiArIG4gKyBqMCBdID0gMjU1O1xuXG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cblx0XHRsYXllckRpc3RhbmNlUmVjdXJzaXZlKCAwLCAwLCByZXNvbHV0aW9uWCAtIDEsIHJlc29sdXRpb25aIC0gMSApO1xuXG5cdH1cblxuXHRjbG9zZXN0UG9pbnRUb01lc2goIHBvaW50LCB0YXJnZXRQb3MsIHRhcmdldFVWRGlzdGFuY2UsIHRhcmdldE5vcm1hbCwgdGFyZ2V0ICkge1xuXG5cdFx0Ly8gZWFybHkgb3V0IGlmIHVuZGVyIG1pblRocmVzaG9sZFxuXHRcdC8vIHNraXAgY2hlY2tpbmcgaWYgb3ZlciBtYXhUaHJlc2hvbGRcblx0XHQvLyBzZXQgbWluVGhyZXNob2xkID0gbWF4VGhyZXNob2xkIHRvIHF1aWNrbHkgY2hlY2sgaWYgYSBwb2ludCBpcyB3aXRoaW4gYSB0aHJlc2hvbGRcblx0XHQvLyByZXR1cm5zIEluZmluaXR5IGlmIG5vIHZhbHVlIGZvdW5kXG5cdFx0Y29uc3QgbWluVGhyZXNob2xkU3EgPSAwO1xuXHRcdGNvbnN0IG1heFRocmVzaG9sZFNxID0gSW5maW5pdHk7XG5cdFx0bGV0IGNsb3Nlc3REaXN0YW5jZVNxID0gSW5maW5pdHk7XG5cdFx0bGV0IGNsb3Nlc3REaXN0YW5jZVRyaWFuZ2xlSW5kZXggPSBudWxsO1xuXG5cdFx0Y29uc3QgdGVtcCA9IHRoaXMudmVjMzE7XG5cblx0XHR0aGlzLmJ2aC5zaGFwZWNhc3QoXG5cdFx0XHR0aGlzLm1lc2gsXG5cdFx0XHR7XG5cblx0XHRcdFx0Ym91bmRzVHJhdmVyc2VPcmRlcjogKCBib3ggKSA9PiB7XG5cblx0XHRcdFx0XHR0ZW1wLmNvcHkoIHBvaW50ICkuY2xhbXAoIGJveC5taW4sIGJveC5tYXggKTtcblx0XHRcdFx0XHRyZXR1cm4gdGVtcC5kaXN0YW5jZVRvU3F1YXJlZCggcG9pbnQgKTtcblxuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdGludGVyc2VjdHNCb3VuZHM6ICggYm94LCBpc0xlYWYsIHNjb3JlICkgPT4ge1xuXG5cdFx0XHRcdFx0cmV0dXJuIHNjb3JlIDwgY2xvc2VzdERpc3RhbmNlU3EgJiYgc2NvcmUgPCBtYXhUaHJlc2hvbGRTcTtcblxuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdGludGVyc2VjdHNUcmlhbmdsZTogKCB0cmksIHRyaUluZGV4ICkgPT4ge1xuXG5cdFx0XHRcdFx0dHJpLmNsb3Nlc3RQb2ludFRvUG9pbnQoIHBvaW50LCB0ZW1wICk7XG5cdFx0XHRcdFx0Y29uc3QgZGlzdFNxID0gcG9pbnQuZGlzdGFuY2VUb1NxdWFyZWQoIHRlbXAgKTtcblx0XHRcdFx0XHRpZiAoIGRpc3RTcSA8IGNsb3Nlc3REaXN0YW5jZVNxICkge1xuXG5cdFx0XHRcdFx0XHR0YXJnZXRQb3MuY29weSggdGVtcCApO1xuXG5cdFx0XHRcdFx0XHRjbG9zZXN0RGlzdGFuY2VTcSA9IGRpc3RTcTtcblx0XHRcdFx0XHRcdGNsb3Nlc3REaXN0YW5jZVRyaWFuZ2xlSW5kZXggPSB0cmlJbmRleDtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggZGlzdFNxIDwgbWluVGhyZXNob2xkU3EgKSB7XG5cblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0sXG5cblx0XHRcdH1cblxuXHRcdCk7XG5cblx0XHRjb25zdCBhID0gdGhpcy5pbmRpY2VzWyBjbG9zZXN0RGlzdGFuY2VUcmlhbmdsZUluZGV4ICogMyBdO1xuXHRcdGNvbnN0IGIgPSB0aGlzLmluZGljZXNbIGNsb3Nlc3REaXN0YW5jZVRyaWFuZ2xlSW5kZXggKiAzICsgMSBdO1xuXHRcdGNvbnN0IGMgPSB0aGlzLmluZGljZXNbIGNsb3Nlc3REaXN0YW5jZVRyaWFuZ2xlSW5kZXggKiAzICsgMiBdO1xuXG5cdFx0dGhpcy52QS5mcm9tQnVmZmVyQXR0cmlidXRlKCB0aGlzLnBvc2l0aW9ucywgYSApO1xuXHRcdHRoaXMudkIuZnJvbUJ1ZmZlckF0dHJpYnV0ZSggdGhpcy5wb3NpdGlvbnMsIGIgKTtcblx0XHR0aGlzLnZDLmZyb21CdWZmZXJBdHRyaWJ1dGUoIHRoaXMucG9zaXRpb25zLCBjICk7XG5cblx0XHR0aGlzLnV2QS5mcm9tQnVmZmVyQXR0cmlidXRlKCB0aGlzLnV2cywgYSApO1xuXHRcdHRoaXMudXZCLmZyb21CdWZmZXJBdHRyaWJ1dGUoIHRoaXMudXZzLCBiICk7XG5cdFx0dGhpcy51dkMuZnJvbUJ1ZmZlckF0dHJpYnV0ZSggdGhpcy51dnMsIGMgKTtcblxuXHRcdFRyaWFuZ2xlLmdldFVWKFxuXHRcdFx0dGFyZ2V0UG9zLFxuXHRcdFx0dGhpcy52QSxcblx0XHRcdHRoaXMudkIsXG5cdFx0XHR0aGlzLnZDLFxuXHRcdFx0dGhpcy51dkEsXG5cdFx0XHR0aGlzLnV2Qixcblx0XHRcdHRoaXMudXZDLFxuXHRcdFx0dGFyZ2V0VVZEaXN0YW5jZVxuXHRcdCk7XG5cblx0XHQvLyB4LCB5OiB1diwgejogZGlzdGFuY2Vcblx0XHR0YXJnZXRVVkRpc3RhbmNlLnogPSBNYXRoLnNxcnQoIGNsb3Nlc3REaXN0YW5jZVNxICk7XG5cblx0XHRUcmlhbmdsZS5nZXROb3JtYWwoIHRoaXMudkEsIHRoaXMudkIsIHRoaXMudkMsIHRhcmdldE5vcm1hbCApO1xuXG5cdFx0Ly8gZmluZCB0aGUgYXNzb2NpYXRlZCBtYXRlcmlhbCBpbmRleFxuXHRcdGxldCBtYXRlcmlhbEluZGV4ID0gMDtcblx0XHRjb25zdCBmaXJzdFZlcnRleEluZGV4ID0gY2xvc2VzdERpc3RhbmNlVHJpYW5nbGVJbmRleCAqIDM7XG5cdFx0Zm9yICggbGV0IGkgPSAwLCBsID0gdGhpcy5ncm91cHMubGVuZ3RoOyBpIDwgbDsgaSArKyApIHtcblxuXHRcdFx0Y29uc3QgZ3JvdXAgPSB0aGlzLmdyb3Vwc1sgaSBdO1xuXHRcdFx0Y29uc3QgeyBzdGFydCwgY291bnQgfSA9IGdyb3VwO1xuXHRcdFx0aWYgKCBmaXJzdFZlcnRleEluZGV4ID49IHN0YXJ0ICYmIGZpcnN0VmVydGV4SW5kZXggPCBzdGFydCArIGNvdW50ICkge1xuXG5cdFx0XHRcdG1hdGVyaWFsSW5kZXggPSBncm91cC5tYXRlcmlhbEluZGV4O1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIG1hdGVyaWFsSW5kZXg7XG5cblx0fVxuXG5cblx0c3RhdGljIG1lcmdlR2VvbWV0cmllcyggZ2VvbWV0cmllcywgbWF0cmljZXMgKSB7XG5cblx0XHQvLyBNZXJnZSBhbGwgZ2VvbWV0cmllcyBpbnRvIG9uZVxuXG5cdFx0Y29uc3QgdHJhbnNmb3JtZWRHZW9tZXRyaWVzID0gWyBdO1xuXHRcdGZvciAoIGxldCBpID0gMCwgbCA9IGdlb21ldHJpZXMubGVuZ3RoOyBpIDwgbDsgaSArKyApIHtcblxuXHRcdFx0Y29uc3QgdHJhbnNmb3JtZWRHZW9tZXRyeSA9IGdlb21ldHJpZXNbIGkgXS5jbG9uZSgpO1xuXHRcdFx0dHJhbnNmb3JtZWRHZW9tZXRyeS5hcHBseU1hdHJpeDQoIG1hdHJpY2VzWyBpIF0gKTtcblx0XHRcdHRyYW5zZm9ybWVkR2VvbWV0cmllcy5wdXNoKCB0cmFuc2Zvcm1lZEdlb21ldHJ5ICk7XG5cblx0XHR9XG5cblx0XHRjb25zdCBtZXJnZWRHZW9tZXRyeSA9IHRoaXMubWVyZ2VCdWZmZXJHZW9tZXRyaWVzKCB0cmFuc2Zvcm1lZEdlb21ldHJpZXMgKTtcblx0XHRpZiAoICEgbWVyZ2VkR2VvbWV0cnkgKSB7XG5cblx0XHRcdGNvbnNvbGUuZXJyb3IoIFwiRXJyb3IgbWVyZ2luZyB0aGUgbW9kZWxzIGludG8gb25lIGdlb21ldHJ5LlwiICk7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdH1cblxuXHRcdHJldHVybiBtZXJnZWRHZW9tZXRyeTtcblxuXHR9XG5cblx0c3RhdGljIG1lcmdlQnVmZmVyR2VvbWV0cmllcyggZ2VvbWV0cmllcyApIHtcblxuXHRcdGNvbnN0IGlzSW5kZXhlZCA9IGdlb21ldHJpZXNbIDAgXS5pbmRleCAhPT0gbnVsbDtcblxuXHRcdGNvbnN0IGF0dHJpYnV0ZXNVc2VkID0gbmV3IFNldCggT2JqZWN0LmtleXMoIGdlb21ldHJpZXNbIDAgXS5hdHRyaWJ1dGVzICkgKTtcblxuXHRcdGNvbnN0IGF0dHJpYnV0ZXMgPSB7fTtcblxuXHRcdGNvbnN0IG1lcmdlZEdlb21ldHJ5ID0gbmV3IEJ1ZmZlckdlb21ldHJ5KCk7XG5cblx0XHRsZXQgdGhlcmVBcmVHcm91cHMgPSBmYWxzZTtcblx0XHRmb3IgKCBsZXQgaSA9IDA7IGkgPCBnZW9tZXRyaWVzLmxlbmd0aDsgKysgaSApIHtcblxuXHRcdFx0Y29uc3QgZ2VvbWV0cnkgPSBnZW9tZXRyaWVzWyBpIF07XG5cdFx0XHRpZiAoIGdlb21ldHJ5Lmdyb3Vwcy5sZW5ndGggPiAwICkge1xuXG5cdFx0XHRcdHRoZXJlQXJlR3JvdXBzID0gdHJ1ZTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdGxldCBvZmZzZXQgPSAwO1xuXHRcdGxldCBuZXh0R3JvdXBJZCA9IDA7XG5cblx0XHRmb3IgKCBsZXQgaSA9IDA7IGkgPCBnZW9tZXRyaWVzLmxlbmd0aDsgKysgaSApIHtcblxuXHRcdFx0Y29uc3QgZ2VvbWV0cnkgPSBnZW9tZXRyaWVzWyBpIF07XG5cdFx0XHRsZXQgYXR0cmlidXRlc0NvdW50ID0gMDtcblxuXHRcdFx0Ly8gZW5zdXJlIHRoYXQgYWxsIGdlb21ldHJpZXMgYXJlIGluZGV4ZWQsIG9yIG5vbmVcblxuXHRcdFx0aWYgKCBpc0luZGV4ZWQgIT09ICggZ2VvbWV0cnkuaW5kZXggIT09IG51bGwgKSApIHtcblxuXHRcdFx0XHRjb25zb2xlLmVycm9yKCAnU2xpY2VyLm1lcmdlQnVmZmVyR2VvbWV0cmllcygpIGZhaWxlZCB3aXRoIGdlb21ldHJ5IGF0IGluZGV4ICcgKyBpICsgJy4gQWxsIGdlb21ldHJpZXMgbXVzdCBoYXZlIGNvbXBhdGlibGUgYXR0cmlidXRlczsgbWFrZSBzdXJlIGluZGV4IGF0dHJpYnV0ZSBleGlzdHMgYW1vbmcgYWxsIGdlb21ldHJpZXMsIG9yIGluIG5vbmUgb2YgdGhlbS4nICk7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXG5cdFx0XHR9XG5cblx0XHRcdC8vIGdhdGhlciBhdHRyaWJ1dGVzLCBleGl0IGVhcmx5IGlmIHRoZXkncmUgZGlmZmVyZW50XG5cblx0XHRcdGZvciAoIGNvbnN0IG5hbWUgaW4gZ2VvbWV0cnkuYXR0cmlidXRlcyApIHtcblxuXHRcdFx0XHRpZiAoICEgYXR0cmlidXRlc1VzZWQuaGFzKCBuYW1lICkgKSB7XG5cblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCAnU2xpY2VyLm1lcmdlQnVmZmVyR2VvbWV0cmllcygpIGZhaWxlZCB3aXRoIGdlb21ldHJ5IGF0IGluZGV4ICcgKyBpICsgJy4gQWxsIGdlb21ldHJpZXMgbXVzdCBoYXZlIGNvbXBhdGlibGUgYXR0cmlidXRlczsgbWFrZSBzdXJlIFwiJyArIG5hbWUgKyAnXCIgYXR0cmlidXRlIGV4aXN0cyBhbW9uZyBhbGwgZ2VvbWV0cmllcywgb3IgaW4gbm9uZSBvZiB0aGVtLicgKTtcblx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBhdHRyaWJ1dGVzWyBuYW1lIF0gPT09IHVuZGVmaW5lZCApIGF0dHJpYnV0ZXNbIG5hbWUgXSA9IFtdO1xuXG5cdFx0XHRcdGF0dHJpYnV0ZXNbIG5hbWUgXS5wdXNoKCBnZW9tZXRyeS5hdHRyaWJ1dGVzWyBuYW1lIF0gKTtcblxuXHRcdFx0XHRhdHRyaWJ1dGVzQ291bnQgKys7XG5cblx0XHRcdH1cblxuXHRcdFx0Ly8gZW5zdXJlIGdlb21ldHJpZXMgaGF2ZSB0aGUgc2FtZSBudW1iZXIgb2YgYXR0cmlidXRlc1xuXG5cdFx0XHRpZiAoIGF0dHJpYnV0ZXNDb3VudCAhPT0gYXR0cmlidXRlc1VzZWQuc2l6ZSApIHtcblxuXHRcdFx0XHRjb25zb2xlLmVycm9yKCAnU2xpY2VyLm1lcmdlQnVmZmVyR2VvbWV0cmllcygpIGZhaWxlZCB3aXRoIGdlb21ldHJ5IGF0IGluZGV4ICcgKyBpICsgJy4gTWFrZSBzdXJlIGFsbCBnZW9tZXRyaWVzIGhhdmUgdGhlIHNhbWUgbnVtYmVyIG9mIGF0dHJpYnV0ZXMuJyApO1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdFx0fVxuXG5cdFx0XHQvLyBDcmVhdGUgbWVzaGdyb3Vwc1xuXG5cdFx0XHRpZiAoIHRoZXJlQXJlR3JvdXBzICkge1xuXG5cdFx0XHRcdGNvbnN0IGpsID0gZ2VvbWV0cnkuZ3JvdXBzLmxlbmd0aDtcblxuXHRcdFx0XHRpZiAoIGpsID4gMCApIHtcblxuXHRcdFx0XHRcdGZvciAoIGxldCBqID0gMDsgaiA8IGpsOyBqICsrICkge1xuXG5cdFx0XHRcdFx0XHRjb25zdCBjb3VudCA9IGdlb21ldHJ5Lmdyb3Vwc1sgaiBdLmNvdW50O1xuXG5cdFx0XHRcdFx0XHRtZXJnZWRHZW9tZXRyeS5hZGRHcm91cCggb2Zmc2V0LCBjb3VudCwgbmV4dEdyb3VwSWQgKysgKTtcblx0XHRcdFx0XHRcdG9mZnNldCArPSBjb3VudDtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXG5cblx0XHRcdFx0XHRsZXQgY291bnQ7XG5cdFx0XHRcdFx0aWYgKCBpc0luZGV4ZWQgKSBjb3VudCA9IGdlb21ldHJ5LmdldEluZGV4KCkuYXJyYXkubGVuZ3RoO1xuXHRcdFx0XHRcdGVsc2UgY291bnQgPSBnZW9tZXRyeS5nZXRBdHRyaWJ1dGUoICdwb3NpdGlvbicgKS5hcnJheS5sZW5ndGggLyAzO1xuXG5cdFx0XHRcdFx0bWVyZ2VkR2VvbWV0cnkuYWRkR3JvdXAoIG9mZnNldCwgY291bnQsIG5leHRHcm91cElkICsrICk7XG5cdFx0XHRcdFx0b2Zmc2V0ICs9IGNvdW50O1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0Ly8gbWVyZ2UgaW5kaWNlc1xuXG5cdFx0aWYgKCBpc0luZGV4ZWQgKSB7XG5cblx0XHRcdGxldCBpbmRleE9mZnNldCA9IDA7XG5cdFx0XHRjb25zdCBtZXJnZWRJbmRleCA9IFtdO1xuXG5cdFx0XHRmb3IgKCBsZXQgaSA9IDA7IGkgPCBnZW9tZXRyaWVzLmxlbmd0aDsgKysgaSApIHtcblxuXHRcdFx0XHRjb25zdCBpbmRleCA9IGdlb21ldHJpZXNbIGkgXS5pbmRleDtcblxuXHRcdFx0XHRmb3IgKCBsZXQgaiA9IDA7IGogPCBpbmRleC5jb3VudDsgKysgaiApIHtcblxuXHRcdFx0XHRcdG1lcmdlZEluZGV4LnB1c2goIGluZGV4LmdldFgoIGogKSArIGluZGV4T2Zmc2V0ICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGluZGV4T2Zmc2V0ICs9IGdlb21ldHJpZXNbIGkgXS5hdHRyaWJ1dGVzLnBvc2l0aW9uLmNvdW50O1xuXG5cdFx0XHR9XG5cblx0XHRcdG1lcmdlZEdlb21ldHJ5LnNldEluZGV4KCBtZXJnZWRJbmRleCApO1xuXG5cdFx0fVxuXG5cdFx0Ly8gbWVyZ2UgYXR0cmlidXRlc1xuXG5cdFx0Zm9yICggY29uc3QgbmFtZSBpbiBhdHRyaWJ1dGVzICkge1xuXG5cdFx0XHRjb25zdCBtZXJnZWRBdHRyaWJ1dGUgPSBCdWZmZXJHZW9tZXRyeVV0aWxzLm1lcmdlQnVmZmVyQXR0cmlidXRlcyggYXR0cmlidXRlc1sgbmFtZSBdICk7XG5cblx0XHRcdGlmICggISBtZXJnZWRBdHRyaWJ1dGUgKSB7XG5cblx0XHRcdFx0Y29uc29sZS5lcnJvciggJ1RIUkVFLkJ1ZmZlckdlb21ldHJ5VXRpbHM6IC5tZXJnZUJ1ZmZlckdlb21ldHJpZXMoKSBmYWlsZWQgd2hpbGUgdHJ5aW5nIHRvIG1lcmdlIHRoZSAnICsgbmFtZSArICcgYXR0cmlidXRlLicgKTtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHRcdH1cblxuXHRcdFx0bWVyZ2VkR2VvbWV0cnkuc2V0QXR0cmlidXRlKCBuYW1lLCBtZXJnZWRBdHRyaWJ1dGUgKTtcblxuXHRcdH1cblxuXHRcdHJldHVybiBtZXJnZWRHZW9tZXRyeTtcblxuXHR9XG5cblxuXHRzdGF0aWMgY3JlYXRlSW1hZ2UoIHJlc29sdXRpb25YLCByZXNvbHV0aW9uWSApIHtcblxuXHRcdHJldHVybiBuZXcgVWludDhBcnJheSggcmVzb2x1dGlvblggKiByZXNvbHV0aW9uWSApO1xuXG5cdH1cblxuXHRzdGF0aWMgY3JlYXRlU2hhcmVkSW1hZ2UoIHJlc29sdXRpb25YLCByZXNvbHV0aW9uWSApIHtcblxuXHRcdHJldHVybiBuZXcgU2hhcmVkQXJyYXlCdWZmZXIoIHJlc29sdXRpb25YICogcmVzb2x1dGlvblkgKTtcblxuXHR9XG5cblx0c3RhdGljIHBhaW50SW1hZ2VJbkNhbnZhcyggciwgZywgYiwgaW1hZ2UsIGNhbnZhcywgY2FudmFzQ3R4LCBpbWFnZURhdGEgKSB7XG5cblx0XHQvLyBSZXR1cm5zIG51bWJlciBvZiBwaXhlbHMgZGlmZmVyZW50IHRoYW4gemVyb1xuXG5cdFx0aWYgKCBpbWFnZSA9PT0gbnVsbCApIHtcblxuXHRcdFx0Y2FudmFzQ3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG5cdFx0XHRjYW52YXNDdHguZmlsbFJlY3QoIDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCApO1xuXHRcdFx0cmV0dXJuIDA7XG5cblx0XHR9XG5cblx0XHRjb25zdCBkYXRhID0gaW1hZ2VEYXRhLmRhdGE7XG5cblx0XHRjb25zdCBudW1QaXhlbHMgPSBjYW52YXMud2lkdGggKiBjYW52YXMuaGVpZ2h0O1xuXHRcdGxldCBudW1Ob25aZXJvUGl4ZWxzID0gMDtcblx0XHRsZXQgcCA9IDA7XG5cdFx0Zm9yICggbGV0IGkgPSAwOyBpIDwgbnVtUGl4ZWxzOyBpICsrICkge1xuXG5cdFx0XHRjb25zdCBncmF5ID0gaW1hZ2VbIGkgXTtcblxuXHRcdFx0ZGF0YVsgcCBdID0gcjtcblx0XHRcdGRhdGFbIHAgKyAxIF0gPSBnO1xuXHRcdFx0ZGF0YVsgcCArIDIgXSA9IGI7XG5cdFx0XHRkYXRhWyBwICsgMyBdID0gZ3JheTtcblxuXHRcdFx0cCArPSA0O1xuXG5cdFx0XHRpZiAoIGdyYXkgIT09IDAgKSBudW1Ob25aZXJvUGl4ZWxzICsrO1xuXG5cdFx0fVxuXG5cdFx0Y2FudmFzQ3R4LnB1dEltYWdlRGF0YSggaW1hZ2VEYXRhLCAwLCAwICk7XG5cblx0XHRyZXR1cm4gbnVtTm9uWmVyb1BpeGVscztcblxuXHR9XG5cblx0Y291bnRQaXhlbHNJbkltYWdlKCBpbWFnZSApIHtcblxuXHRcdGNvbnN0IHJlc29sdXRpb25YID0gdGhpcy5zZXR0aW5ncy5yZXNvbHV0aW9uWTtcblx0XHRjb25zdCByZXNvbHV0aW9uWiA9IHRoaXMuc2V0dGluZ3MucmVzb2x1dGlvblg7XG5cblx0XHRsZXQgbnVtUGl4ZWxzID0gMDtcblxuXHRcdGZvciAoIGxldCBpID0gMCwgaWwgPSByZXNvbHV0aW9uWiAqIHJlc29sdXRpb25YOyBpIDwgaWw7IGkgKysgKSB7XG5cblx0XHRcdGlmICggaW1hZ2VbIGkgXSAhPT0gMCApIG51bVBpeGVscyArKztcblxuXHRcdH1cblxuXHRcdHJldHVybiBudW1QaXhlbHM7XG5cblx0fVxuXG59XG5cbmV4cG9ydCB7IFNsaWNlciB9O1xuIiwiLypcbk1pbmNlIFNsaWNlclxuXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMjEgSnVhbiBKb3NlIEx1bmEgRXNwaW5vc2FcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuXG4qL1xuXG5pbXBvcnQgeyBCdWZmZXJHZW9tZXRyeSwgQnVmZmVyQXR0cmlidXRlIH0gZnJvbSAndGhyZWUnO1xuXG5cbmNsYXNzIEdlb21ldHJ5U2VyaWFsaXplciB7XG5cblx0c3RhdGljIHNlcmlhbGl6ZSggYnVmZmVyR2VvbWV0cnkgKSB7XG5cblx0XHQvLyBUaGUgZ2VvbWV0cnkgbXVzdCBoYXZlIHBvc2l0aW9uIGFuZCB1diBhdHRyaWJ1dGVzLlxuXHRcdC8vIFJldHVybnMgSlNPTiBvYmplY3RcblxuXHRcdGNvbnN0IGluZGV4ID0gYnVmZmVyR2VvbWV0cnkuZ2V0SW5kZXgoKTtcblxuXHRcdHJldHVybiB7XG5cblx0XHRcdGluZGV4OiBpbmRleCAhPT0gbnVsbCA/IGluZGV4LmFycmF5IDogbnVsbCxcblxuXHRcdFx0cG9zaXRpb246IGJ1ZmZlckdlb21ldHJ5LmdldEF0dHJpYnV0ZSggJ3Bvc2l0aW9uJyApLmFycmF5LFxuXG5cdFx0XHR1djogYnVmZmVyR2VvbWV0cnkuZ2V0QXR0cmlidXRlKCAndXYnICkuYXJyYXksXG5cblx0XHRcdGdyb3VwczogR2VvbWV0cnlTZXJpYWxpemVyLnNlcmlhbGl6ZUdyb3VwcyggYnVmZmVyR2VvbWV0cnkgKVxuXG5cdFx0fTtcblxuXHR9XG5cblx0c3RhdGljIHNlcmlhbGl6ZUdyb3VwcyggYnVmZmVyR2VvbWV0cnkgKSB7XG5cblx0XHRjb25zdCBncm91cHMgPSBbIF07XG5cdFx0Zm9yICggbGV0IGkgPSAwLCBpbCA9IGJ1ZmZlckdlb21ldHJ5Lmdyb3Vwcy5sZW5ndGg7IGkgPCBpbDsgaSArKyApIHtcblxuXHRcdFx0Y29uc3QgZyA9IGJ1ZmZlckdlb21ldHJ5Lmdyb3Vwc1sgaSBdO1xuXG5cdFx0XHRncm91cHMucHVzaCgge1xuXHRcdFx0XHRzdGFydDogZy5zdGFydCxcblx0XHRcdFx0Y291bnQ6IGcuY291bnQsXG5cdFx0XHRcdG1hdGVyaWFsSW5kZXg6IGcubWF0ZXJpYWxJbmRleFxuXHRcdFx0fSApO1xuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIGdyb3VwcztcblxuXHR9XG5cblx0c3RhdGljIGRlc2VyaWFsaXplKCBzZXJpYWxpemVkRGF0YSApIHtcblxuXHRcdC8vIFJldHVybnMgQnVmZmVyR2VvbWV0cnlcblxuXHRcdGNvbnN0IGJ1ZmZlckdlb21ldHJ5ID0gbmV3IEJ1ZmZlckdlb21ldHJ5KCk7XG5cblx0XHRpZiAoIHNlcmlhbGl6ZWREYXRhLmluZGV4ICE9PSBudWxsICkgYnVmZmVyR2VvbWV0cnkuc2V0SW5kZXgoIHNlcmlhbGl6ZWREYXRhLmluZGV4ICk7XG5cdFx0YnVmZmVyR2VvbWV0cnkuc2V0QXR0cmlidXRlKCAncG9zaXRpb24nLCBuZXcgQnVmZmVyQXR0cmlidXRlKCBzZXJpYWxpemVkRGF0YS5wb3NpdGlvbiwgMyApICk7XG5cdFx0YnVmZmVyR2VvbWV0cnkuc2V0QXR0cmlidXRlKCAndXYnLCBuZXcgQnVmZmVyQXR0cmlidXRlKCBzZXJpYWxpemVkRGF0YS51diwgMiApICk7XG5cblx0XHRmb3IgKCBsZXQgaSA9IDAsIGlsID0gc2VyaWFsaXplZERhdGEuZ3JvdXBzLmxlbmd0aDsgaSA8IGlsOyBpICsrICkge1xuXG5cdFx0XHRjb25zdCBnID0gc2VyaWFsaXplZERhdGEuZ3JvdXBzWyBpIF07XG5cblx0XHRcdGJ1ZmZlckdlb21ldHJ5LmFkZEdyb3VwKCBnLnN0YXJ0LCBnLmNvdW50LCBnLm1hdGVyaWFsSW5kZXggKTtcblxuXHRcdH1cblxuXHRcdHJldHVybiBidWZmZXJHZW9tZXRyeTtcblxuXHR9XG5cbn1cblxuZXhwb3J0IHsgR2VvbWV0cnlTZXJpYWxpemVyIH07IiwiLypcbk1pbmNlIFNsaWNlclxuXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMjEgSnVhbiBKb3NlIEx1bmEgRXNwaW5vc2FcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuXG4qL1xuXG5pbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSAndGhyZWUnO1xuaW1wb3J0IHsgZW5jb2RlIH0gZnJvbSAnZmFzdC1wbmcnO1xuXG5pbXBvcnQgeyBTbGljZXIgfSBmcm9tICcuL3NsaWNpbmcvU2xpY2VyLmpzJztcbmltcG9ydCB7IEdlb21ldHJ5U2VyaWFsaXplciB9IGZyb20gJy4vdXRpbHMvR2VvbWV0cnlTZXJpYWxpemVyLmpzJztcblxubGV0IG15V29ya2VySW5kZXggPSBudWxsO1xuXG5cbmNvbnN0IHNsaWNlciA9IG5ldyBTbGljZXIoKTtcbmxldCByZXNvbHV0aW9uWCA9IDA7XG5sZXQgcmVzb2x1dGlvblkgPSAwO1xubGV0IGltYWdlID0gbnVsbDtcbmxldCBpbWFnZVBORyA9IG51bGw7XG5cbnNlbGYub25tZXNzYWdlID0gKCBldmVudCApID0+IHtcblxuXHRzd2l0Y2ggKCBldmVudC5kYXRhLnR5cGUgKSB7XG5cblx0XHRjYXNlICdpbml0SW5kZXgnOlxuXHRcdFx0bXlXb3JrZXJJbmRleCA9IGV2ZW50LmRhdGEud29ya2VySW5kZXg7XG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgJ2luaXRXb3JrZXInOlxuXHRcdFx0b25Jbml0V29ya2VyTWVzc2FnZSggZXZlbnQuZGF0YSApO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlICdqb2InOlxuXG5cdFx0XHRjb25zdCBwYXJhbWV0ZXJzID0gZXZlbnQuZGF0YS5wYXJhbWV0ZXJzO1xuXG5cdFx0XHRjb25zdCByZXN1bHQgPSBleGVjdXRlSm9iKCBwYXJhbWV0ZXJzICk7XG5cblx0XHRcdHNlbGYucG9zdE1lc3NhZ2UoIHtcblx0XHRcdFx0dHlwZTogXCJqb2JSZXN1bHRcIixcblx0XHRcdFx0d29ya2VySW5kZXg6IG15V29ya2VySW5kZXgsXG5cdFx0XHRcdHJlc3VsdDogcmVzdWx0XG5cdFx0XHR9ICk7XG5cblx0XHRicmVhaztcblxuXHR9XG5cbn07XG5cbmZ1bmN0aW9uIG9uSW5pdFdvcmtlck1lc3NhZ2UoIG1lc3NhZ2UgKSB7XG5cblx0aW5pdFByaW50KCBtZXNzYWdlICk7XG5cbn1cblxuZnVuY3Rpb24gZXhlY3V0ZUpvYiggcGFyYW1ldGVycyApIHtcblxuXHRzd2l0Y2ggKCBwYXJhbWV0ZXJzLmpvYlR5cGUgKSB7XG5cblx0XHRjYXNlICdzbGljZUxheWVyJzpcblx0XHRcdHJldHVybiBzbGljZUxheWVyKCBwYXJhbWV0ZXJzICk7XG5cblx0fVxuXG5cdHJldHVybiBudWxsO1xuXG59XG5cbmZ1bmN0aW9uIGluaXRQcmludCggcGFyYW1ldGVycyApIHtcblxuXHRjb25zdCBnZW9tZXRyeSA9IEdlb21ldHJ5U2VyaWFsaXplci5kZXNlcmlhbGl6ZSggcGFyYW1ldGVycy5nZW9tZXRyeSApO1xuXG5cdHNsaWNlci5zZXR1cFByaW50KCBnZW9tZXRyeSwgcGFyYW1ldGVycy5pbWFnZXMsIHBhcmFtZXRlcnMucHJpbnRTZXR0aW5ncyApO1xuXG5cdHJlc29sdXRpb25YID0gcGFyYW1ldGVycy5wcmludFNldHRpbmdzLnJlc29sdXRpb25YO1xuXHRyZXNvbHV0aW9uWSA9IHBhcmFtZXRlcnMucHJpbnRTZXR0aW5ncy5yZXNvbHV0aW9uWTtcblxuXHRpbWFnZSA9IFNsaWNlci5jcmVhdGVJbWFnZSggcmVzb2x1dGlvblgsIHJlc29sdXRpb25ZICk7XG5cblx0aW1hZ2VQTkcgPSB7XG5cdFx0d2lkdGg6IHJlc29sdXRpb25YLFxuXHRcdGhlaWdodDogcmVzb2x1dGlvblksXG5cdFx0ZGF0YTogaW1hZ2UsXG5cdFx0ZGVwdGg6IDgsXG5cdFx0Y2hhbm5lbHM6IDFcblx0fTtcblxufVxuXG5mdW5jdGlvbiBzbGljZUxheWVyKCBwYXJhbWV0ZXJzICkge1xuXG5cdHNsaWNlci5zbGljZUxheWVyKCBwYXJhbWV0ZXJzLmxheWVySW5kZXgsIGltYWdlICk7XG5cblx0aWYgKCBwYXJhbWV0ZXJzLnJlc3VsdFR5cGVQTkdDb250ZW50ICkge1xuXG5cdFx0Y29uc3QgcG5nTGF5ZXJEYXRhID0gZW5jb2RlKCBpbWFnZVBORyApO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGxheWVySW5kZXg6IHBhcmFtZXRlcnMubGF5ZXJJbmRleCxcblx0XHRcdG51bU5vblplcm9QaXhlbHM6IHNsaWNlci5jb3VudFBpeGVsc0luSW1hZ2UoIGltYWdlICksXG5cdFx0XHRwbmdMYXllckRhdGE6IHBuZ0xheWVyRGF0YVxuXHRcdH07XG5cblx0fVxuXHRlbHNlIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRsYXllckluZGV4OiBwYXJhbWV0ZXJzLmxheWVySW5kZXgsXG5cdFx0XHRpbWFnZTogaW1hZ2Vcblx0XHR9O1xuXG5cdH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuLy8gdGhlIHN0YXJ0dXAgZnVuY3Rpb25cbl9fd2VicGFja19yZXF1aXJlX18ueCA9ICgpID0+IHtcblx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG5cdC8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxuXHR2YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFs1MzRdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyg3MjkpKSlcblx0X193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcblx0cmV0dXJuIF9fd2VicGFja19leHBvcnRzX187XG59O1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZiA9IHt9O1xuLy8gVGhpcyBmaWxlIGNvbnRhaW5zIG9ubHkgdGhlIGVudHJ5IGNodW5rLlxuLy8gVGhlIGNodW5rIGxvYWRpbmcgZnVuY3Rpb24gZm9yIGFkZGl0aW9uYWwgY2h1bmtzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmUgPSAoY2h1bmtJZCkgPT4ge1xuXHRyZXR1cm4gUHJvbWlzZS5hbGwoT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5mKS5yZWR1Y2UoKHByb21pc2VzLCBrZXkpID0+IHtcblx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmZba2V5XShjaHVua0lkLCBwcm9taXNlcyk7XG5cdFx0cmV0dXJuIHByb21pc2VzO1xuXHR9LCBbXSkpO1xufTsiLCIvLyBUaGlzIGZ1bmN0aW9uIGFsbG93IHRvIHJlZmVyZW5jZSBhc3luYyBjaHVua3MgYW5kIHNpYmxpbmcgY2h1bmtzIGZvciB0aGUgZW50cnlwb2ludFxuX193ZWJwYWNrX3JlcXVpcmVfXy51ID0gKGNodW5rSWQpID0+IHtcblx0Ly8gcmV0dXJuIHVybCBmb3IgZmlsZW5hbWVzIGJhc2VkIG9uIHRlbXBsYXRlXG5cdHJldHVybiBcIlwiICsgY2h1bmtJZCArIFwiLm1haW4uanNcIjtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjXG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkgc2NyaXB0VXJsID0gc2NyaXB0c1tzY3JpcHRzLmxlbmd0aCAtIDFdLnNyY1xuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgY2h1bmtzXG4vLyBcIjFcIiBtZWFucyBcImFscmVhZHkgbG9hZGVkXCJcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdDcyOTogMVxufTtcblxuLy8gaW1wb3J0U2NyaXB0cyBjaHVuayBsb2FkaW5nXG52YXIgaW5zdGFsbENodW5rID0gKGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Zm9yKHZhciBtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdH1cblx0fVxuXHRpZihydW50aW1lKSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR3aGlsZShjaHVua0lkcy5sZW5ndGgpXG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRzLnBvcCgpXSA9IDE7XG5cdHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xufTtcbl9fd2VicGFja19yZXF1aXJlX18uZi5pID0gKGNodW5rSWQsIHByb21pc2VzKSA9PiB7XG5cdC8vIFwiMVwiIGlzIHRoZSBzaWduYWwgZm9yIFwiYWxyZWFkeSBsb2FkZWRcIlxuXHRpZighaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0aWYodHJ1ZSkgeyAvLyBhbGwgY2h1bmtzIGhhdmUgSlNcblx0XHRcdGltcG9ydFNjcmlwdHMoX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgX193ZWJwYWNrX3JlcXVpcmVfXy51KGNodW5rSWQpKTtcblx0XHR9XG5cdH1cbn07XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rTWluY2VTbGljZXJcIl0gPSBzZWxmW1wid2VicGFja0NodW5rTWluY2VTbGljZXJcIl0gfHwgW107XG52YXIgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24gPSBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IGluc3RhbGxDaHVuaztcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdCIsInZhciBuZXh0ID0gX193ZWJwYWNrX3JlcXVpcmVfXy54O1xuX193ZWJwYWNrX3JlcXVpcmVfXy54ID0gKCkgPT4ge1xuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5lKDUzNCkudGhlbihuZXh0KTtcbn07IiwiIiwiLy8gcnVuIHN0YXJ0dXBcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy54KCk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=