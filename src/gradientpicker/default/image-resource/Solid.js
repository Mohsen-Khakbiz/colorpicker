import Color from '@easylogic/color';
import { ColorStep } from "./ColorStep";
import { Gradient } from './Gradient';

export class Solid extends Gradient {

	getDefaultObject( obj = {} ) {
		return super.getDefaultObject( {
			type: "solid",
			color: obj[ 'colorsteps' ] ? Gradient.getColor( obj.colorsteps[ 0 ]?.color || Color.random() ) : Color.random(),
			colorsteps: [
				new ColorStep( { index: 0, color: obj[ 'colorsteps' ] ? Gradient.getColor( obj.colorsteps[ 0 ]?.color || Color.random() ) : Color.random(), percent: 0 } ),
				new ColorStep( { index: 1, color: obj[ 'colorsteps' ] ? Gradient.getColor( obj.colorsteps[ 1 ]?.color || Color.random() ) : Color.random(), percent: 100 } ),
			],
			...obj
		} );
	}

	getColorString() {
		return Gradient.getColor( this.json.colorsteps[ 0 ].color );
	}

	toString() {
		return Gradient.getColor( this.json.colorsteps[ 0 ].color );
	}

	static parse( str ) {
		return new Solid( {
			color: Gradient.getColor( str ),
			colorsteps: [
				new ColorStep( { index: 0, color: Gradient.getColor( str ), percent: 0 } ),
				new ColorStep( { index: 1, color: Color.blend( Gradient.getColor( str ), Color.random(), 1 ), percent: 100 } ),
			]
		} );
	}
}