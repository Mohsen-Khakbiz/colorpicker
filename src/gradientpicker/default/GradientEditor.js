import Color from '@easylogic/color';
import UIElement from '~/colorpicker/UIElement';
import { calculateAngle, round } from '~/util/functions/math';
import { Length } from './Length';

var radialTypeList = [
	'circle',
	'circle closest-side',
	'circle closest-corner',
	'circle farthest-side',
	'circle farthest-corner',
	'ellipse',
	'ellipse closest-side',
	'ellipse closest-corner',
	'ellipse farthest-side',
	'ellipse farthest-corner',
];

export default class GradientEditor extends UIElement {
	initialize() {
		super.initialize();

		const defaultColor = Color.random();

		this.type = 'solid';
		this.index = 0;
		this.colorsteps = [
			{ offset: Length.percent( 0 ), color: defaultColor },
			{ offset: Length.percent( 100 ), color: Color.blend( defaultColor, Color.random(), 1 ) },
		];
		this.radialPosition = [ Length.percent( 50 ), Length.percent( 50 ) ];
		this.radialType = 'ellipse';
	}

	'@changeRadialPosition'( posX, posY ) {
		if ( this.type.includes( 'linear-gradient' ) ) {
			this[ '@changeKeyValue' ](
				'angle',
				Length.deg(
					calculateAngle( posX.value - 50, posY.value - 50 ).toFixed( 0 )
				)
			);
		} else {
			this[ '@changeKeyValue' ]( 'radialPosition', [ posX, posY ] );
		}

		this.reloadInputValue();
	}

	'@setGradientEditor'( str, index = 0, type = 'solid', angle, radialPosition, radialType ) {

		this.toggleComponents( type );

		if ( type === 'solid' ) {

			this.color = str;
			this.type = type;

			this.refresh();
			this.selectStep( 0 );
			this.reloadInputValue();

			return;
		}

		if ( !str || str === '' ) {
			str = `${ this.color || Color.random() } 0%`;
		}

		var results = Color.convertMatches( str );
		var colorsteps = results.str
			.split( ',' )
			.map( it => it.trim() )
			.map( it => {
				var res = it.split( ' ' ).filter( str => str.length );
				if ( res.length === 1 ) {
					res = [ this.color || Color.random(), res[ 0 ] ];
				}
				var color = res[ 0 ];
				var offset = Length.parse( res[ 1 ] );
				if ( !color.startsWith( 'var(' ) ) {
					color = Color.reverseMatches( color, results.matches );
				}
				if ( offset.isDeg() ) {
					offset = Length.percent( ( offset.value / 360 ) * 100 );
				}
				return { color, offset };
			} );

		if ( colorsteps.length === 1 ) {
			colorsteps.push( {
				color: colorsteps[ 0 ].color,
				offset: Length.percent( 100 ),
			} );
		};

		this.cachedStepListRect = null;

		this.colorsteps = colorsteps;
		this.index = index;
		this.type = type;
		this.angle = Length.parse( angle || '0deg' );
		this.radialPosition = radialPosition || [ Length.percent( 50 ), Length.percent( 50 ), ];
		this.radialType = radialType;

		this.refresh();
		this.selectStep( index );
		this.reloadInputValue();

	}

	template() {
		return /*html*/ `
        <div class='gradient-editor' data-selected-editor='${ this.type }'>
            <div class='gradient-steps' data-editor='gradient' ref="$gradientSteps">
                <div class="hue-container" ref="$back"></div>
                <div class="hue" ref="$steps">
                    <div class='step-list' ref="$stepList" ></div>
                </div>
            </div>
            <div class='sub-editor' ref='$subEditor'>
              <div data-editor='angle'>
                <label>Angle</label>
                <div class='unit'>
                  <div><input type='range' data-key='angle' min='0' max="360" step='1' ref='$angle' /> </div>
                  <div><input type='number' data-key='angle' min='0' max="360" step='1' ref='$angleNumber' /></div>
                  <span>deg</span>
                </div>
              </div>
              <div data-editor='centerX'>
                <label>Center X</label>
                <div class='unit'>
                  <div><input type='range' data-key='centerX' min='-100' max="100" step='1' ref='$centerX' /></div>
                  <div><input type='number' data-key='centerX' min='-100' max="100" step='1' ref='$centerXNumber' /></div>
                  <div><select ref='$centerXSelect'>
                      <option value='%'>%</option>
                      <option value='px'>px</option>
                      <option value='em'>em</option>
                    </select></div>
                </div>
              </div>
              <div data-editor='centerY'>
                <label>Center Y</label>
                <div class='unit'>
                  <div><input type='range' data-key='centerY' min='-100' max="100" step='1' ref='$centerY' /></div>
                  <div><input type='number' data-key='centerX' min='-100' max="100" step='1' ref='$centerYNumber' /></div>
                  <div><select ref='$centerYSelect'>
                      <option value='%'>%</option>
                      <option value='px'>px</option>
                      <option value='em'>em</option>
                    </select></div>
                </div>
              </div>
              <div data-editor='radialType'>
                <label>Type</label>
                <div><select ref='$radialType'>
                  ${ radialTypeList
				.map( ( k ) => {
					var selected =
						this.radialType === k ? 'selected' : '';
					return `<option value="${ k }" ${ selected }>${ k }</option>`;
				} )
				.join( '' ) }
                </select></div>
              </div>
            </div>
        </div>
      `;
	}

	'input $angle'( e ) {
		this.refs.$angleNumber.val( this.refs.$angle.val() );
		this[ '@changeKeyValue' ]( 'angle', Length.deg( this.refs.$angle.val() ) );
	}
	'input $angleNumber'( e ) {
		this.refs.$angle.val( this.refs.$angleNumber.val() );
		this[ '@changeKeyValue' ]( 'angle', Length.deg( this.refs.$angle.val() ) );
	}

	'input $centerX'( e ) {
		this.refs.$centerXNumber.val( this.refs.$centerX.val() );
		this[ '@changeKeyValue' ]( 'radialPositionX' );
	}
	'input $centerXNumber'( e ) {
		this.refs.$centerX.val( this.refs.$centerXNumber.val() );
		this[ '@changeKeyValue' ]( 'radialPositionX' );
	}

	'input $centerY'( e ) {
		this.refs.$centerYNumber.val( this.refs.$centerY.val() );
		this[ '@changeKeyValue' ]( 'radialPositionY' );
	}
	'input $centerYNumber'( e ) {
		this.refs.$centerY.val( this.refs.$centerYNumber.val() );
		this[ '@changeKeyValue' ]( 'radialPositionX' );
	}

	'change $centerXSelect'( e ) {
		this[ '@changeKeyValue' ]( 'radialPositionX' );
	}

	'change $centerYSelect'( e ) {
		this[ '@changeKeyValue' ]( 'radialPositionY' );
	}

	get radialPositionX() {
		return new Length(
			+this.refs.$centerX.val(),
			this.refs.$centerXSelect.val()
		);
	}

	get radialPositionY() {
		return new Length(
			+this.refs.$centerY.val(),
			this.refs.$centerYSelect.val()
		);
	}

	'change $radialType'( e ) {
		this[ '@changeKeyValue' ]( 'radialType', this.refs.$radialType.val() );
	}

	'@changeKeyValue'( key, value ) {
		if ( key === 'angle' ) {
			value = value.value;
		}

		if ( key === 'radialPositionX' || key === 'radialPositionY' ) {
			this[ 'radialPosition' ] = [
				this.radialPositionX,
				this.radialPositionY,
			];
		} else {
			this[ key ] = value;
		}

		this.updateData();
	}

	'@changeColorStepOffset'( key, value ) {
		if ( this.currentStep ) {
			this.currentStep.offset = value.clone();
			this.$currentStep.css( {
				left: this.currentStep.offset,
			} );
			this.$currentStep.attr( 'data-pos', parseFloat( Length.percent( percent ) ).toFixed( 2 ) );
			this.setColorUI();
			this.updateData();
		}
	}

	'click $back'( e ) {
		if ( this.startXY ) return;

		var rect = this.refs.$stepList.rect();

		var minX = rect.x;
		var maxX = rect.right;
		var ind;

		var x = e.xy.x;

		if ( x < minX ) {
			x = minX;
		} else if ( x > maxX ) {
			x = maxX;
		}
		var percent = ( ( x - minX ) / rect.width ) * 100;

		this.colorsteps.forEach( ( step, i ) => {
			if ( !step.color || step.color === '' ) {
				step.color = this.lastSelectedStepColor || Color.random();
			}
		} )

		var list = this.colorsteps.map( ( it, index ) => ( { index, color: it.color, offset: it.offset } ) );

		var prev = list.filter( it => it.offset.value <= percent ).pop();
		var next = list.filter( it => it.offset.value >= percent ).shift();
		let prevColor = prev?.color;
		let nextColor = next?.color;

		if ( prev && prevColor.startsWith( 'var(' ) ) {
			prevColor = this.getValueOfCssVar( prevColor );
		}
		if ( next && nextColor.startsWith( 'var(' ) ) {
			nextColor = this.getValueOfCssVar( nextColor );
		}

		if ( prev && next ) {
			ind = next.index;
			this.colorsteps.splice( ind, 0, {
				offset: Length.percent( percent ),
				color: Color.mix(
					prevColor,
					nextColor,
					( percent - prev.offset.value ) /
					( next.offset.value - prev.offset.value )
				),
			} );
		} else if ( prev ) {
			ind = prev.index + 1;
			this.colorsteps.splice( ind, 0, {
				offset: Length.percent( percent ),
				color: prev.color,
			} );
		} else if ( next ) {
			this.colorsteps.unshift( {
				offset: Length.percent( percent ),
				color: next.color,
			} );
			ind = 0;
		} else {
			this.colorsteps.push( {
				offset: Length.percent( 0 ),
				color: Color.random(),
			} );
			ind = this.colorsteps.length - 1;
		}

		this.refresh();
		this.updateData();

		this.selectStep( ind );
		this.$store.emit( 'selectColorStep', this.currentStep.color );
	}

	reloadStepList( isClear ) {
		const colorsteps = isClear ? [] : this.colorsteps;
		this.refs.$stepList.html(
			colorsteps
				.map( ( it, index ) => {
					let bgColor = it.color;
					if ( bgColor.startsWith( 'var(' ) ) {
						bgColor = this.getValueOfCssVar( bgColor )
					}
					return `<div class='step ${ this.colorsteps.length <= 2 ? 'hide-remove' : '' }' data-index='${ index }' style='left: ${ it.offset };' data-pos='${ parseFloat( it.offset ).toFixed( 2 ) }'>
						<div class='color-view' style="background-color: ${ bgColor }"></div>
						<button type="button" class="remove-step" title="Remove color stop">&times;</button>
					</div>`;
				} )
				.join( '' )
		);
	}

	'click $stepList .remove-step'( e ) {
		this.removeStep( e.delegateTarget?.parentElement?.dataset?.index || this.index );
	}

	removeStep( index ) {
		if ( this.colorsteps.length <= 2 ) return;
		this.colorsteps.splice( index, 1 );
		let newActiveIndex = index - 1 < 0 ? 0 : index - 1;
		this.currentStep = this.colorsteps[ newActiveIndex ];
		this.refresh();
		this.updateData();
		// select prev step
		this.selectStep( newActiveIndex );
		this.$store.emit( 'selectColorStep', this.currentStep.color );
	}

	selectStep( index ) {
		this.index = index;
		this.currentStep = this.colorsteps[ index ];
		this.refs.$stepList.attr( 'data-selected-index', index );
		this.$currentStep = this.refs.$stepList.$(
			`[data-index="${ index.toString() }"]`
		);
		if ( !this.$currentStep || !this.$currentStep.el ) return;
		this.$colorView = this.$currentStep.$( '.color-view' );
		this.prev = this.colorsteps[ index - 1 ];
		this.next = this.colorsteps[ index + 1 ];

		this.refs.$stepList.$$( '.step' ).forEach( ( step ) => {
			step.attr( 'data-is-active', false );
		} );
		this.$currentStep.attr( 'data-is-active', true );
		this.lastSelectedStepColor = this.currentStep.color;
	}

	'mousedown $stepList .step'( e ) {
		var index = +e.$delegateTarget.attr( 'data-index' );

		if ( e.altKey ) {
			this.removeStep( index );
		} else {
			this.selectStep( index );
			let currentStepColor = this.currentStep.color;

			if ( currentStepColor.startsWith( 'var(' ) ) {
				currentStepColor = currentStepColor.replace( 'var(', '' ).replace( ')', '' );
			}

			this.startXY = e.xy;
			this.refs.$stepList.attr( 'data-selected-index', index );
			this.cachedStepListRect = this.refs.$stepList.rect();
			this.$store.emit( 'selectColorStep', currentStepColor );
		}
	}

	getStepListRect() {
		return this.cachedStepListRect;
	}

	'mouseup document'( e ) {
		if ( this.startXY ) {
			this.startXY = null;
		}
	}

	'mousemove document'( e ) {
		if ( !this.startXY ) return;

		var dx = e.xy.x - this.startXY.x;
		var dy = e.xy.y - this.startXY.y;

		var rect = this.getStepListRect();

		var minX = rect.x;
		var maxX = rect.right;

		var x = this.startXY.x + dx;

		if ( x < minX ) {
			x = minX
		} else if ( x > maxX ) {
			x = maxX
		};
		var percent = ( ( x - minX ) / rect.width ) * 100;

		if ( this.prev ) {
			if ( this.prev.offset.value > percent ) {
				percent = this.prev.offset.value;
			}
		}

		if ( this.next ) {
			if ( this.next.offset.value < percent ) {
				percent = this.next.offset.value;
			}
		}

		this.currentStep.offset.set( round( percent, 100 ) );
		this.$currentStep.css( {
			left: Length.percent( percent ),
		} );
		this.$currentStep.attr( 'data-pos', parseFloat( Length.percent( percent ) ).toFixed( 2 ) );
		this.setColorUI();
		this.updateData();
	}

	refresh( isClear ) {
		this.reloadStepList( isClear );
		this.setColorUI( isClear );
		const elColorpicker = this.opt.container.querySelector( '.el-colorpicker' );
		if ( this.type !== 'solid' && isClear ) {
			elColorpicker.style.transform = 'scale(0.95)';
			elColorpicker.style.opacity = '0.7';
			elColorpicker.style.pointerEvents = 'none';
			this.refs.$subEditor.css( 'display', 'none' );
		} else {
			elColorpicker.style.transform = '';
			elColorpicker.style.opacity = '';
			elColorpicker.style.pointerEvents = '';
			this.refs.$subEditor.css( 'display', '' );
		}
	}

	getLinearGradient() {
		if ( this.colorsteps.length === 0 ) {
			return '';
		}

		if ( this.colorsteps.length === 1 ) {
			var colorstep = this.colorsteps[ 0 ];
			return `linear-gradient(to right, ${ colorstep.color } ${ colorstep.offset }, ${ colorstep.color } 100%)`;
		}

		return `linear-gradient(to right, ${ this.colorsteps
			.map( it => {
				let { color } = it;
				if ( color.startsWith( 'var(' ) ) {
					color = this.getValueOfCssVar( color )
				}
				return `${ color } ${ it.offset }`;
			} )
			.join( ',' ) })`;
	}

	setColorUI( isClear ) {
		this.refs.$stepList.css( 'background-image', isClear ? '' : this.getLinearGradient() );
		this.refs.$el.attr( 'data-selected-editor', this.type );
	}

	reloadInputValue() {
		if ( this.type === 'solid' ) return;

		let angle = this.angle.value != null ? this.angle.value : this.angle;

		this.refs.$angle.val( angle );
		this.refs.$angleNumber.val( angle );

		const radialPosition = this.radialPosition.map( ( it ) => {
			if ( it === 'center' ) {
				return Length.percent( 50 );
			}
			return it;
		} );

		this.refs.$centerX.val( radialPosition[ 0 ].value );
		this.refs.$centerXNumber.val( radialPosition[ 0 ].value );
		this.refs.$centerXSelect.val( radialPosition[ 0 ].unit );

		this.refs.$centerY.val( radialPosition[ 1 ].value );
		this.refs.$centerYNumber.val( radialPosition[ 1 ].value );
		this.refs.$centerYSelect.val( radialPosition[ 1 ].unit );

		this.refs.$radialType.val( this.radialType );
	}

	'@clearColorSteps'() {
		if ( this.type === 'solid' ) return;
		this.refresh( true );
		this.updateData( true );
	}

	'@setColorStepColor'( color ) {
		let bgColor = color;
		if ( bgColor.startsWith( 'var(' ) ) {
			bgColor = this.getValueOfCssVar( bgColor )
		}
		if ( this.currentStep ) {
			this.currentStep.color = color;
			this.$colorView.css( {
				'background-color': bgColor,
			} );
			this.setColorUI();
			this.updateData();
		}
	}

	updateData( isClear ) {
		this.$store.emit( 'changeGradientEditor', {
			type: this.type,
			index: this.index,
			angle: this.angle,
			colorsteps: isClear ? [] : this.colorsteps,
			radialPosition: this.radialPosition,
			radialType: this.radialType,
		} );
	}

	getValueOfCssVar( color ) {
		const getColorFrom = window.lqdColorPickerGetCssVarsFrom || document.documentElement;
		return getComputedStyle( getColorFrom ).getPropertyValue( color.replace( 'var(', '' ).replace( ')', '' ) ).trim()
	}

	toggleComponents( type ) {

		if ( type === 'solid' ) {
			this.refs.$gradientSteps.css( 'display', 'none' );
			this.refs.$subEditor.css( 'display', 'none' );
		} else {
			this.refs.$gradientSteps.css( 'display', '' );
			this.refs.$subEditor.css( 'display', '' );
		}

	}

}
