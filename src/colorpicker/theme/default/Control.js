import UIElement from '~/colorpicker/UIElement';
import Hue from '~/colorpicker/ui/control/Hue';
import Opacity from '~/colorpicker/ui/control/Opacity';
import ColorPreview from '~/colorpicker/ui/ColorPreview';

export default class Control extends UIElement {

	components() {
		return {
			Hue,
			Opacity,
			ColorPreview,
		};
	}

	template() {
		let $opacity = this.opt.useOpacity ? `<template target="Opacity"></template>` : '';
		return `
      <article class="el-cp-color-control">
        <div class="el-cp-color-control__body">
          <template target="Hue"></template>
          ${ $opacity }
        </div>
      </article>
    `;
	}

	refresh() {
		this.Hue.setColorUI();
		if ( !!this.opt.useOpacity ) this.Opacity.setColorUI();
	}

	[ '@changeColor' ]() {
		this.refresh();
	}

	[ '@initColor' ]() {
		this.refresh();
	}

}
