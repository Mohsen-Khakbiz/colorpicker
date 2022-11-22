import Color from '@easylogic/color';
import BaseSlider from '~/colorpicker/BaseSlider';
import './ColorSlider.scss';

export default class Opacity extends BaseSlider {

  constructor (opt) {
    super(opt);
    this.minValue = 0;
    this.maxValue = 1;
  }

  template () {
    return `
      <nav class="el-cp-slider el-cp-slider--alpha">
        <p ref="$container" class="el-cp-slider__body">
          <span ref="$colorbar" class="el-cp-slider__bar"></span>
          <i ref="$bar" class="el-cp-slider__circle"></i>
        </p>
        <label>
          <input ref="$alpha" type="number" step="1" min="0" max="100"/>
        </label>
      </nav>
    `;
  }

  refresh() {
    super.refresh();
    this.setOpacityColorBar();
    this.refs.$alpha.val( (this.$store.alpha * 100).toFixed(0) );
  }

  setOpacityColorBar() {
    const start = Color.format({ ...this.$store.rgb, a: 0 }, 'rgb');
    const end = Color.format({ ...this.$store.rgb, a: 1 }, 'rgb');
    this.refs.$colorbar.css('background', `linear-gradient(to right, ${start}, ${end})`);
  }

  getDefaultValue() {
    return this.$store.alpha;
  }

  refreshColorUI(e) {
    const dist = this.getCalculatedDist(e);
    const val = (Math.floor(dist) / 100) * this.maxValue;
    this.setColorUI((dist / 100) * this.maxValue);
    this.changeColor({
      a: val,
    });
    this.refs.$alpha.val( (val * 100).toFixed(0) );
  }

  ['input $alpha']() {
    this.changeColor({
      a: this.refs.$alpha.val() / 100,
    });
  }

}
