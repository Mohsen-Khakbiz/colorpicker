import Color from '@easylogic/color';
import BaseModule from '~/colorpicker/BaseModule';

export default class ColorManager extends BaseModule {

	initialize() {
		super.initialize();
		this.$store.rgb = { r: 255, g: 255, b: 255 };
		this.$store.hsl = { h: 0, s: 0, l: 100 };
		this.$store.hsv = { h: 0, s: 0, v: 1 };
		this.$store.alpha = 1;
		this.$store.format = 'hex';
	}

	[ '/changeFormat' ]( $store, format ) {
		$store.format = format;
		$store.emit( 'changeFormat' );
	}

	[ '/initColor' ]( $store, obj ) {
		$store.dispatch( '/changeColor', obj, true );
		$store.emit( 'initColor' );
	}

	[ '/changeColor' ]( $store, colorObj, isInit ) {

		let isCssVar = false;
		let colorCssVar = '';

		if ( typeof colorObj === 'string' && colorObj !== '' ) {
			// if color is a css var
			colorObj = colorObj.trim();
			if ( colorObj.startsWith( '--' ) || colorObj.startsWith( 'var(' ) ) {
				if ( colorObj.startsWith( 'var(' ) ) {
					colorObj = colorObj.replace( 'var(', '' ).replace( ')', '' ).trim();
				}
				colorCssVar = colorObj;
				const getColorFrom = window.lqdColorPickerGetCssVarsFrom || document.documentElement;
				const color = getComputedStyle( getColorFrom ).getPropertyValue( colorObj );
				colorObj = color;
				isCssVar = true;
			}
			colorObj = Color.parse( colorObj.trim() );
		};

		$store.alpha = colorObj?.a >= 0 ? colorObj.a : $store.alpha;

		if ( !$store.format ) {
			$store.format = colorObj?.type !== 'hsv' ? ( colorObj?.type || 'hex' ) : 'hex';
		}

		if ( colorObj?.type || colorObj?.a >= 0 ) {

			switch ( colorObj.type ) {
				case 'hsl':
					$store.hsl = Object.assign( $store.lasthsl || $store.hsl, colorObj );
					$store.rgb = Color.HSLtoRGB( $store.lasthsl || $store.hsl );
					$store.hsv = Color.HSLtoHSV( colorObj );
					break;
				case 'hex':
					$store.rgb = Object.assign( $store.lastrgb || $store.rgb, colorObj );
					$store.hsl = Color.RGBtoHSL( $store.lastrgb || $store.rgb );
					$store.hsv = Color.RGBtoHSV( colorObj );
					break;
				case 'rgb':
					$store.rgb = Object.assign( $store.lastrgb || $store.rgb, colorObj );
					$store.hsl = Color.RGBtoHSL( $store.lastrgb || $store.rgb );
					$store.hsv = Color.RGBtoHSV( colorObj );
					break;
				case 'hsv':
					$store.hsv = Object.assign( $store.lasthsv || $store.hsv, colorObj );
					$store.rgb = Color.HSVtoRGB( $store.lasthsv || $store.hsv );
					$store.hsl = Color.HSVtoHSL( $store.lasthsv || $store.hsv );
					break;
			}

			$store.lasthsv = $store.hsv;
			$store.lastrgb = $store.rgb;
			$store.lasthsl = $store.hsl;
			$store.lastformat = $store.format;

		} else { // clear

			$store.lasthsv = $store.hsv;
			$store.lastrgb = $store.rgb;
			$store.lasthsl = $store.hsl;
			$store.lastformat = $store.format;

			$store.rgb = {};
			$store.hsl = { h: 0, s: 0, l: 100 };
			$store.hsv = { h: 0, s: 0, v: 0 };
			$store.alpha = 1;
			$store.format = $store.format;

		}

		if ( isCssVar ) {
			$store.colorCssVar = colorCssVar;
		} else {
			$store.colorCssVar = null;
		}

		if ( !isInit ) $store.emit( 'changeColor', colorObj );

	}

	[ '/clear' ]( $store ) {
		$store.dispatch( '/changeColor', '' );
		$store.emit( 'clear' );
	}

	[ '/getHueColor' ]( $store ) {
		return Color.checkHueColor( $store.hsv.h / 360 );
	}

	[ '/toString' ]( $store, type ) {
		type = type || $store.format;
		const obj = $store[ type ] || $store.rgb;
		// if clearing color
		if ( type === '' || Object.keys( obj ).length === 0 ) {
			return '';
		}
		return Color.format( {
			...obj,
			a: $store.alpha,
		}, type );
	}

	[ '/toColor' ]( $store, type ) {
		type = type || ( $store.format === '' ? 'hex' : $store.format );
		if ( $store.colorCssVar ) {
			return `var(${ $store.colorCssVar })`;
		}
		switch ( type ) {
			case 'rgb':
				return $store.dispatch( '/toRGB' );
			case 'hsl':
				return $store.dispatch( '/toHSL' );
			case 'hex':
				return $store.dispatch( '/toHEX' );
			default:
				return $store.dispatch( '/toString', type );
		}
	}

	[ '/toRGB' ]( $store ) {
		return $store.dispatch( '/toString', 'rgb' );
	}

	[ '/toHSL' ]( $store ) {
		return $store.dispatch( '/toString', 'hsl' );
	}

	[ '/toHEX' ]( $store ) {
		return $store.dispatch( '/toString', 'hex' ).toUpperCase();
	}

}
