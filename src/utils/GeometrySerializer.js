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

import { BufferGeometry, BufferAttribute } from 'three';


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

		const bufferGeometry = new BufferGeometry();

		if ( serializedData.index !== null ) bufferGeometry.setIndex( serializedData.index );
		bufferGeometry.setAttribute( 'position', new BufferAttribute( serializedData.position, 3 ) );
		bufferGeometry.setAttribute( 'uv', new BufferAttribute( serializedData.uv, 2 ) );

		for ( let i = 0, il = serializedData.groups.length; i < il; i ++ ) {

			const g = serializedData.groups[ i ];

			bufferGeometry.addGroup( g.start, g.count, g.materialIndex );

		}

		return bufferGeometry;

	}

}

export { GeometrySerializer };