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

		if ( typeof colorObj === 'string' ) colorObj = Color.parse( colorObj );

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

		} else {

			$store.lasthsv = $store.hsv;
			$store.lastrgb = $store.rgb;
			$store.lasthsl = $store.hsl;
			$store.lastformat = $store.format;


			$store.rgb = {};
			$store.hsl = { h: 0, s: 0, l: 100 };
			$store.hsv = { h: 0, s: 0, v: 1 };
			$store.alpha = 1;
			$store.format = 'hex';

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
