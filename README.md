# Colorpicker With EasyLogic

This project was created to implement a color picker. It implemented basic functions for color and implemented image filters.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![](https://data.jsdelivr.com/v1/package/npm/easylogic-colorpicker/badge)](https://www.jsdelivr.com/package/npm/easylogic-colorpicker)

[![NPM](https://nodei.co/npm/@easylogic/colorpicker.png)](https://npmjs.org/package/@easylogic/colorpicker)

Document Site: https://colorpicker.easylogic.studio/#colorpicker-for-standalone


## Install

```shell
npm install @easylogic/colorpicker
```


## Using

### module

```javascript
import ColorPicker from '@easylogic/colorpicker';
import '@easylogic/colorpicker/dist/EasyLogicColorPicker.css';

const picker = new ColorPicker({
  container: document.getElementById('basic'),
});
```

### browser

```html
<link href="https://cdn.jsdelivr.net/npm/@easylogic/colorpicker@1.10.5/dist/colorpicker.css" />

<div id="picker"></div>

<script src="https://cdn.jsdelivr.net/npm/@easylogic/colorpicker@1.10.5/dist/colorpicker.min.js"></script>

<script>
window.picker = new EasyLogicColorPicker({
  container: document.getElementById('picker'),
})
</script>
```

// TODO: jsdelivr 서비스에서 업그레이드 예정입니다.  
// TODO: codepen 데모 추가예정


## Developments

다음과 같은 과정으로 개발환경을 준비합니다.

```shell
git clone https://github.com/easylogic/easylogic-colorpicker
cd colorpicker
npm install
cp resource/.env ./
```

### open local server

```shell
npm run dev
```

### build

```shell
npm run build
```

### .env

[.env](https://github.com/easylogic/colorpicker/blob/main/resources/.env) 파일은 로컬서버 옵션의 일부분을 고쳐 사용할 수 있습니다.  
포트번호나 서버상태표시같은 것들을 `.env`파일을 고쳐 조정할 수 있습니다.


## License : MIT
