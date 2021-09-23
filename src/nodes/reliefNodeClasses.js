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

import * as Constants from '../nodes/Constants.js';
import { ReliefNodeConstant } from './ReliefNodeConstant.js';
import { ReliefNodeImageUV } from './ReliefNodeImageUV.js';
import { ReliefNodeImageTiledUV } from './ReliefNodeImageTiledUV.js';
import { ReliefNodeAdd } from './ReliefNodeAdd.js';
import { ReliefNodeNegate } from './ReliefNodeNegate.js';
import { ReliefNodeMultiply } from './ReliefNodeMultiply.js';
import { ReliefNodeDivide } from './ReliefNodeDivide.js';
import { ReliefNodePower } from './ReliefNodePower.js';
import { ReliefNodeSin } from './ReliefNodeSin.js';
import { ReliefNodeCos } from './ReliefNodeCos.js';
import { ReliefNodeMix } from './ReliefNodeMix.js';
import { ReliefNodeMin } from './ReliefNodeMin.js';
import { ReliefNodeMax } from './ReliefNodeMax.js';
import { ReliefNodeLessThan } from './ReliefNodeLessThan.js';
import { ReliefNodeNotBottom } from './ReliefNodeNotBottom.js';
import { ReliefNodeQuantize } from './ReliefNodeQuantize.js';
import { ReliefNodeEvaluate } from './ReliefNodeEvaluate.js';
import { ReliefNodeGetU } from './ReliefNodeGetU.js';
import { ReliefNodeGetV } from './ReliefNodeGetV.js';
import { ReliefNodeGetX } from './ReliefNodeGetX.js';
import { ReliefNodeGetY } from './ReliefNodeGetY.js';
import { ReliefNodeGetZ } from './ReliefNodeGetZ.js';
import { ReliefNodeCheckered } from './ReliefNodeCheckered.js';
import { ReliefNodeTiles } from './ReliefNodeTiles.js';
import { ReliefNodeSimplexUV } from './ReliefNodeSimplexUV.js';
import { ReliefNodePerlinUV } from './ReliefNodePerlinUV.js';
import { ReliefNodeVoronoiUV } from './ReliefNodeVoronoiUV.js';
import { ReliefNodeCircles } from './ReliefNodeCircles.js';
import { ReliefNodeSpots } from './ReliefNodeSpots.js';
import { ReliefNodePreset } from './ReliefNodePreset.js';
import { ReliefNodeMaterialSelector } from './ReliefNodeMaterialSelector.js';
import { ReliefNodeMultiplex } from './ReliefNodeMultiplex.js';

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
				Constants.RELIEF_EMBOSS,
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
				Constants.RELIEF_EMBOSS,
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
				Constants.RELIEF_EMBOSS,
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
				Constants.RELIEF_EMBOSS,
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
				Constants.RELIEF_EMBOSS,
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
				Constants.RELIEF_EMBOSS,
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
				Constants.RELIEF_EMBOSS,
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
				Constants.RELIEF_EMBOSS,
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
				Constants.RELIEF,
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
				Constants.RELIEF_EMBOSS,
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
				Constants.RELIEF_EMBOSS,
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
				Constants.RELIEF_EMBOSS,
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

export { reliefNodeClasses };
