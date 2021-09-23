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

export {
	RandomGenerator,
	MathRandomGenerator,
	PseudoRandomGenerator,
	CachedRandomGenerator,
};
