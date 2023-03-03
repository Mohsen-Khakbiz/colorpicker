import Dom from '~/util/Dom';
import UIElement from '~/colorpicker/UIElement';
import ColorManager from '~/colorpicker/module/ColorManager';
import ColorSwatch from '~/colorpicker/module/ColorSwatch';
import BaseStore from '~/colorpicker/BaseStore';

export default class BaseColorPicker extends UIElement {

	constructor( opt ) {
		super( opt );
	}

	initialize() {
		if ( this.$store ) this.destroy();

		// set store
		this.$store = new BaseStore( {
			modules: [
				ColorManager,
				ColorSwatch,
			],
		} );

		// set store events
		this.$store.on( 'changeColor', () => {
			if ( !( this.opt.onChange && typeof this.opt.onChange === 'function' ) ) return;
			const color = this.$store.colorCssVar ? `var(${ this.$store.colorCssVar })` : this.getColor();
			this.opt.onChange( color );
		} );
		this.$store.on( 'lastUpdateColor', () => {
			if ( !( this.opt.onChanged && typeof this.opt.onChanged === 'function' ) ) return;
			const color = this.$store.colorCssVar ? `var(${ this.$store.colorCssVar })` : this.getColor();
			this.opt.onChanged( color );
		} );
		this.$store.on( 'changeFormat', () => {
			if ( !( this.opt.onChangeFormat && typeof this.opt.onChangeFormat === 'function' ) ) return;
			this.opt.onChangeFormat( this.$store.format );
		} );
		this.$store.on( 'clear', () => {
			if ( !( this.opt.onClear && typeof this.opt.onClear === 'function' ) ) return;
			this.opt.onClear();
		} );

		// set elements
		this.$body = new Dom( this.opt.container || document.body );
		this.$root = new Dom( 'div', 'el-colorpicker', {} );

		// append colorpicker to container
		this.$body.append( this.$root );

		// set theme
		let theme;
		switch ( this.opt.type ) {
			case 'circle':
			case 'ring':
			case 'mini':
			case 'none':
				theme = this.opt.type;
				break;
			default:
				theme = 'default';
				break;
		}
		this.$root.el.classList.add( `el-colorpicker--${ theme }` );

		// set swatchColors
		this.$store.dispatch( '/swatch.set', this.opt.swatchColors );

		// render component
		this.render( this.$root );

		const color = this.opt?.colorpicker?.color || this.opt.color || '#7fffd4';

		// set color
		this.$store.dispatch( '/changeFormat', this.opt?.colorpicker?.format || this.opt.format );
		this.$store.dispatch( '/initColor', color.trim() );

		// initial events
		this.initializeEvent();

		// call onInit
		if ( this.opt.onInit && typeof this.opt.onInit === 'function' ) {
			this.opt.onInit( this );
		}
	}

	/**
	 * get color
	 *
	 * @param {string} format hex,rgb,hsl
	 * @return {string}
	 */
	getColor( format = undefined ) {
		return this.$store.dispatch( '/toColor', format || this.opt.outputFormat );
	}

	/**
	 * set color
	 *
	 * @param {string} color
	 * @param {string} format
	 */
	setColor( color, format = undefined ) {
		this.$store.dispatch( '/changeColor', color.trim() );
	}

	clear() {
		this.$store.dispatch( '/clear' );
	}

	/**
	 * set options
	 *
	 * @param {object} options
	 */
	setOption( options ) {
		if ( !options ) return;
		this.opt = Object.assign( this.opt, options );
		this.destroy();
		this.initialize();
	}

	/**
	 * destroy colorpicker
	 */
	destroy() {
		if ( !this.$store ) return;
		super.destroy();
		this.$store.off( 'changeColor' );
		this.$store.off( 'lastUpdateColor' );
		this.$store.off( 'changeFormat' );
		this.$body.html( '' );
		delete this.$store;
		if ( this.opt.onDestroy && typeof this.opt.onDestroy === 'function' ) {
			this.opt.onDestroy();
		}
	}

}
