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

		$store.alpha = colorObj?.a || $store.alpha;

		if ( !$store.format ) {
			$store.format = colorObj?.type !== 'hsv' ? ( colorObj?.type || 'hex' ) : 'hex';
		}

		if ( colorObj?.type || colorObj?.a ) {

			switch ( colorObj.type ) {
				case 'hsl':
					$store.hsl = Object.assign( $store.prevhsl || $store.hsl, colorObj );
					$store.rgb = Color.HSLtoRGB( $store.prevhsl || $store.hsl );
					$store.hsv = Color.HSLtoHSV( colorObj );
					break;
				case 'hex':
					$store.rgb = Object.assign( $store.prevrgb || $store.rgb, colorObj );
					$store.hsl = Color.RGBtoHSL( $store.prevrgb || $store.rgb );
					$store.hsv = Color.RGBtoHSV( colorObj );
					break;
				case 'rgb':
					$store.rgb = Object.assign( $store.prevrgb || $store.rgb, colorObj );
					$store.hsl = Color.RGBtoHSL( $store.prevrgb || $store.rgb );
					$store.hsv = Color.RGBtoHSV( colorObj );
					break;
				case 'hsv':
					$store.hsv = Object.assign( $store.prevhsv || $store.hsv, colorObj );
					$store.rgb = Color.HSVtoRGB( $store.prevhsv || $store.hsv );
					$store.hsl = Color.HSVtoHSL( $store.prevhsv || $store.hsv );
					break;
			}

		} else {

			$store.prevhsv = $store.hsv;
			$store.prevrgb = $store.rgb;
			$store.prevhsl = $store.hsl;
			$store.prevformat = $store.format;

			$store.rgb = {};
			$store.hsl = { h: 0, s: 0, l: 100 };
			$store.hsv = { h: 0, s: 0, v: 1 };
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
