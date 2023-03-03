import Color from '@easylogic/color';
import BaseColorPicker from '~/colorpicker/BaseColorPicker';
import EmbedColorPicker from './EmbedColorPicker';
import GradientEditor from './GradientEditor';
import './index.scss';
import { RepeatingLinearGradient } from './image-resource/RepeatingLinearGradient';
import { LinearGradient } from './image-resource/LinearGradient';
import { RepeatingRadialGradient } from './image-resource/RepeatingRadialGradient';
import { RadialGradient } from './image-resource/RadialGradient';
import { RepeatingConicGradient } from './image-resource/RepeatingConicGradient';
import { ConicGradient } from './image-resource/ConicGradient';
import { Length } from './Length';
import { Solid } from './image-resource/Solid';
import { Gradient } from './image-resource/Gradient';
import { ColorStep } from './image-resource/ColorStep';

const tabs = [
	{ type: 'solid', title: 'Solid' },
	{ type: 'linear-gradient', title: 'Linear Gradient' },
	{ type: 'repeating-linear-gradient', title: 'Repeating Linear Gradient' },
	{ type: 'radial-gradient', title: 'Radial Gradient' },
	{ type: 'repeating-radial-gradient', title: 'Repeating Radial Gradient' },
	{ type: 'conic-gradient', title: 'Conic Gradient' },
	{ type: 'repeating-conic-gradient', title: 'Repeating Conic Gradient' },
];
const reg = /((linear\-gradient|repeating\-linear\-gradient|radial\-gradient|repeating\-radial\-gradient|conic\-gradient|repeating\-conic\-gradient)\(([^\)]*)\))/gi;

export default class DefaultGradientPicker extends BaseColorPicker {

	components() {
		return {
			EmbedColorPicker,
			GradientEditor,
		};
	}

	parseImage( str = '' ) {
		let image = null;

		if ( str.search( reg ) < 0 ) {
			return Solid.parse( str );
		}

		if ( str.includes( 'repeating-linear-gradient' ) ) {
			image = RepeatingLinearGradient.parse( str );
		} else if ( str.includes( 'linear-gradient' ) ) {
			image = LinearGradient.parse( str );
		} else if ( str.includes( 'repeating-radial-gradient' ) ) {
			image = RepeatingRadialGradient.parse( str );
		} else if ( str.includes( 'radial' ) ) {
			image = RadialGradient.parse( str );
		} else if ( str.includes( 'repeating-conic-gradient' ) ) {
			image = RepeatingConicGradient.parse( str );
		} else if ( str.includes( 'conic' ) ) {
			image = ConicGradient.parse( str );
		}

		return image;
	}

	callbackColorValue() {
		var gradientString = this.image.toString();
		if ( typeof this.opt.onChange == 'function' ) {
			this.opt.onChange.call( this, gradientString, this.image );
		}
		if ( typeof this.colorpickerShowCallback == 'function' ) {
			this.colorpickerShowCallback( gradientString, this.image );
		}
	}

	callbackHideColorValue() {
		var gradientString = this.image.toString();
		if ( typeof this.opt.onHide == 'function' ) {
			this.opt.onHide.call( this, gradientString, this.image );
		}
		if ( typeof this.colorpickerHideCallback == 'function' ) {
			this.colorpickerHideCallback( gradientString, this.image );
		}
	}

	initialize() {
		super.initialize();

		this.selectedTab = 'linear-gradient';

		this.$root.el.classList = '';
		this.$root.el.classList.add( 'el-gradientpicker' );

		let color = this.opt.gradient || this.opt.colorpicker?.color;

		if ( !color || color === '' ) {
			color = Color.random();
		}

		this.setGradient( color.trim() );
	}

	setGradient( gradientString ) {
		this.image = this.parseImage( gradientString );
		const type = this.image.type;
		const $tabEl = this.refs.$tab.el;
		$tabEl.value = type;
		$tabEl.selectedIndex = [ ...$tabEl.options ].findIndex( opt => opt.value === type );
		$tabEl.dispatchEvent( new Event( 'change' ) );
	}

	/**
	 * get color
	 *
	 */
	getColor() {
		return this.getValue();
	}

	getValue() {
		return this.image.toString();
	}

	template() {
		let options = this.opt.types || 'all';
		let selectStyle = '';
		if ( typeof options === 'object' ) {
			options = tabs.filter( tab => options.find( opt => opt === tab.type ) )
			if ( options.length === 1 ) {
				selectStyle += 'display: none;';
			}
		} else if ( options === 'all' ) {
			options = tabs;
		}
		return /*html*/ `
      <div class="el-gradientpicker--default gradient-picker">
		<div class="picker-tab" style="${ selectStyle }">
		<select class="picker-tab-list" ref="$tab" data-value="static-gradient" data-is-image-hidden="false">
			${ options
				.map( ( it ) => {
					return `
				<option value='${ it.type }' title='${ it.title }' >
				${ it.title }
				</option>`;
				} )
				.join( '' ) }
		</select>
		<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<polyline points="6 9 12 15 18 9"></polyline>
		</svg>
		</div>
		<template target='GradientEditor'></template>
		<template target="EmbedColorPicker"></template>
      </div>
    `;
	}

	getColorString() {
		if ( !this.image ) return '';
		return this.image.getColorString();
	}

	'mouseup document'( e ) {
		if ( this.mouseDown ) {
			this.mouseDown = false;
		}
	}

	getCurrentStepColor() {
		var colorstep = this.image.colorsteps[ this.selectedColorStepIndex || 0 ];

		if ( !colorstep || ( !colorstep?.color || colorstep?.color === '' ) ) [
			colorstep = { color: this.color || Color.random() }
		]

		let stepColorsColor = colorstep.color;
		if ( stepColorsColor.startsWith( 'var(' ) ) {
			stepColorsColor = stepColorsColor.replace( 'var(', '' ).replace( ')', '' ).trim();
		}

		return stepColorsColor;
	}

	'@changeGradientEditor'( data ) {
		var colorsteps = data.colorsteps.map( ( it, index ) => {
			return new ColorStep( {
				color: it.color,
				percent: it.offset.value,
				index: ( index + 1 ) * 100,
			} );
		} );

		data = {
			...data,
			type: this.selectedTab,
			colorsteps,
		};

		this.image.reset( data );

		this.updateData();
	}

	'change $tab'( e ) {
		const type = e.target.value;
		this.selectTabContent( type );
	}

	selectTabContent( type ) {

		this.selectedTab = type;
		this.refs.$tab.attr( 'data-value', type );

		if ( type === 'solid' ) {

			this.image = new Solid( {
				colorsteps: [
					this.image?.colorsteps[ 0 ],
					this.image?.colorsteps[ 1 ],
				]
			} );

			this.$store.emit(
				'setGradientEditor',
				this.getColorString(),
				0
			);

		} else {

			this.image = this.createGradient( { type }, this.image );

			this.$store.emit(
				'setGradientEditor',
				this.getColorString(),
				this.selectedColorStepIndex,
				this.image.type,
				this.image.angle,
				this.image.radialPosition,
				this.image.radialType
			);

		}

		var color = this.getCurrentStepColor();

		this[ '@selectColorStep' ]( color );

		if ( color.startsWith( '--' ) ) {
			this.opt.container.querySelectorAll( `button[data-color]` )?.forEach( button => button.classList.remove( 'is-selected' ) );
			this.opt.container.querySelector( `[data-color=${ color }]` )?.classList?.add( 'is-selected' );
		}

		this.updateData();

	}

	createGradient( data, gradient ) {

		const colorsteps = data.colorsteps || gradient.colorsteps || [];

		// linear, conic 은 angle 도 같이 설정한다.
		let angle = data.angle || gradient.angle;

		if ( typeof angle === 'number' ) {
			angle = Length.deg( angle );
		}

		// radial 은  radialType 도 같이 설정한다.
		const radialType = data.radialType || gradient.radialType || 'ellipse';
		const radialPosition = data.radialPosition || gradient.radialPosition || [ Length.percent( 50 ), Length.percent( 50 ) ];

		let json = gradient.clone().toJSON();
		delete json.itemType;
		delete json.type;

		switch ( data.type ) {
			case 'linear-gradient':
				return new LinearGradient( { colorsteps, angle } );
			case 'repeating-linear-gradient':
				return new RepeatingLinearGradient( { colorsteps, angle } );
			case 'radial-gradient':
				return new RadialGradient( {
					colorsteps,
					radialType,
					radialPosition,
				} );
			case 'repeating-radial-gradient':
				return new RepeatingRadialGradient( {
					colorsteps,
					radialType,
					radialPosition,
				} );
			case 'conic-gradient':
				return new ConicGradient( {
					colorsteps,
					angle,
					radialPosition,
				} );
			case 'repeating-conic-gradient':
				return new RepeatingConicGradient( {
					colorsteps,
					angle,
					radialPosition,
				} );
		}

		return new Gradient();
	}

	'@changeEmbedColorPicker'( color ) {
		this.$store.emit( 'setColorStepColor', color );
	}

	'@clearEmbedColorPicker'() {
		this.$store.emit( 'clearColorSteps' );
	}

	'@selectColorStep'( color ) {
		if ( color.startsWith( '--' ) ) {
			this.opt.container.querySelectorAll( `button[data-color]` )?.forEach( button => button.classList.remove( 'is-selected' ) );
			this.opt.container.querySelector( `[data-color=${ color }]` )?.classList?.add( 'is-selected' );
		}
		this.EmbedColorPicker.setColor( color );
	}

	'@changeColorStep'( data = {} ) {
		this.image.reset( {
			...data,
		} );
	}

	updateData() {
		this.callbackColorValue();
	}
}
