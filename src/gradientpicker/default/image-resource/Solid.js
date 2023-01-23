import Color from '@easylogic/color';
import { ColorStep } from "./ColorStep";
import { Gradient } from './Gradient';

export class Solid extends Gradient {

	getDefaultObject( obj = {} ) {
		return super.getDefaultObject( {
			type: "solid",
			color: '',
			colorsteps: [],
			...obj
		} );
	}

	getColorString() {
		return this.json.colorsteps[ 0 ].color;
	}

	toString() {
		return this.json.colorsteps[ 0 ].color;
	}

	static parse( str ) {
		console.log( this );
		return new Solid( {
			color: str,
			colorsteps: [
				new ColorStep( { index: 0, color: str, percent: 0 } ),
				new ColorStep( { index: 1, color: Color.blend( str, Color.random(), 1 ), percent: 100 } ),
			]
		} );
	}
}