import UIElement from '~/colorpicker/UIElement';
import { enableEyeDropper } from '~/util/functions/support';
import './Eyedropper.scss';

export default class Eyedropper extends UIElement {

	template() {
		return /*html*/`
      <nav class="el-cp-color-eyedropper">
        <button type="button" ref="$button" title="Eyedropper">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
		  </svg>
        </button>
      </nav>
    `;
	}

	async [ 'click $button' ]() {
		if ( enableEyeDropper ) {
			const eyeDropper = new EyeDropper();
			const result = await eyeDropper.open();

			this.$store.dispatch( '/changeColor', result.sRGBHex );
			this.$store.emit( 'lastUpdateColor' );
			this.opt.container.querySelector( '.el-cp-colors__item.is-selected' )?.classList?.remove( 'is-selected' );
		}
	}

}
