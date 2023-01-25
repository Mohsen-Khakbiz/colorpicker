import UIElement from '~/colorpicker/UIElement';
import './Swatch.scss';

export default class Swatch extends UIElement {

	template() {
		const colors = this.$store.dispatch( '/swatch.index' );
		if ( !( colors.length > 0 ) ) return null;
		return `
      <div class="el-cp-swatches">
        ${ this.opt.swatchTitle ? `
          <header class="el-cp-swatches__header">
            <h2 ref="$colorSwatchTitle">${ this.opt.swatchTitle }</h2>
          </header>
        ` : '' }
        <div ref="$index"></div>
      </div>
    `;
	}

	initialize() {
		super.initialize();
		setTimeout( () => {
			const getCssVarFrom = window.lqdColorPickerGetCssVarsFrom || document.documentElement;
			if ( this?.$store?.colorCssVar ) {
				this.$el.find( `[data-color=${ this.$store.colorCssVar }]` )?.classList?.add( 'is-selected' );
			}
			[ ...this.refs.$index.el.querySelectorAll( 'button' ) ].forEach( button => {
				const colorData = button.dataset.color;
				if ( colorData?.startsWith( '--' ) ) {
					button.style.setProperty( '--color', getComputedStyle( getCssVarFrom ).getPropertyValue( button.dataset.color ) );
				}
			} )
		}, 10 )
	}

	[ 'load $index' ]() {
		const colors = this.$store.dispatch( '/swatch.index' );
		return `
      <ul class="el-cp-colors">
        ${ colors.map( color => {
			return `
			<li>
				<button
				type="button"
				data-color="${ color }"
				class="el-cp-colors__item"
				style="--color: ${ color }">
				${ color }
				</button>
			</li>
		`} ).join( '' ) }
      </ul>
    `;
	}

	refresh() {
		this.load();
	}

	addColor( color ) {
		this.$store.dispatch( '/addCurrentColor', color );
	}

	[ 'click $index button' ]( e ) {
		[ ...e.$delegateTarget.el.closest( 'ul' ).querySelectorAll( 'button' ) ].forEach( button => button.classList.remove( 'is-selected' ) );
		e.$delegateTarget.el.classList.add( 'is-selected' );
		this.$store.dispatch( '/changeColor', e.$delegateTarget.attr( 'data-color' ), false, window.lqdColorPickerGetCssVarsFrom || document.documentElement );
		this.$store.emit( 'lastUpdateColor' );
	}

}
