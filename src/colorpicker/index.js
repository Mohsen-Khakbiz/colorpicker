import Default from '~/colorpicker/theme/default';
import CircleColorPicker from '~/colorpicker/theme/circle';
import RingColorPicker from '~/colorpicker/theme/ring';
import MiniColorPicker from '~/colorpicker/theme/mini';
import NoneColorPicker from '~/colorpicker/theme/none';
import defaults from './defaults';

/**
 * ColorPicker
 *
 * @param {object} options
 */
function ColorPicker( options ) {

	let core;

	// merge options
	options = Object.assign( {}, defaults, options );

	/**
	 * switch type
	 *
	 * @param {string} type
	 * @param {ColorPicker} self
	 */
	const switchType = ( type, self = undefined ) => {
		switch ( type ) {
			case 'circle':
				core = new CircleColorPicker( options );
				break;
			case 'ring':
				core = new RingColorPicker( options );
				break;
			case 'mini':
				core = new MiniColorPicker( options );
				break;
			case 'none':
				core = new NoneColorPicker( options );
				break;
			default:
				core = new Default( options );
				break;
		}
		this.opt = core.opt;
		this.$el = core.$root.el;
	}

	switchType( options.type );

	window.lqdColorPickerGetCssVarsFrom = window.lqdColorPickerGetCssVarsFrom || this.opt.getCssVarFrom || document.documentElement;

	/**
	 * set type
	 *
	 * @param {string} type
	 */
	this.setType = function ( type ) {
		options = Object.assign( {}, this.opt, {
			type,
			color: core.getColor(),
		} );
		core.destroy();
		switchType( type, this );
	}
	this.initialize = () => {
		core.initialize();
		this.opt = core.opt;
		this.$el = core.$root.el;
	};
	this.destroy = () => {
		core.destroy();
		this.opt = null;
		this.$el = null;
	};
	this.getColor = ( format ) => {
		return core.getColor( format )
	};
	this.setColor = ( color, format ) => {
		return core.setColor( color, format )
	};
	this.setOption = ( options ) => {
		return core.setOption( options )
	};
	this.clear = () => {
		return core.clear()
	};
}

export default ColorPicker;
