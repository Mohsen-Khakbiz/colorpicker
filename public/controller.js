let picker;

function changeType(mode) {
  console.log(mode);
  if (picker.opt.type === mode) return;
  switch (mode) {
    case 'default':
    case 'circle':
    case 'ring':
    case 'mini':
    case 'none':
      picker.setType(mode);
      break;
    default:
      picker.setType('default');
      break;
  }
  picker.opt.type = mode;
}

export function initEvent(getPicker) {
  console.log(getPicker);
  if (!getPicker) return;
  picker = getPicker;

  const $controller = document.getElementById('controller');
  if (!$controller) return;

  console.log("fdjskalfdsjklf");

  const $buttons = $controller.querySelectorAll('button');
  for (let i=0; i<$buttons.length; i++) {
    $buttons[i].addEventListener('click', e => {
      const $self = e.target;
      switch ($self.dataset.type) {
        case 'init':
          picker.initialize();
          break;
        case 'destroy':
          picker.destroy();
          break;
        case 'change-option':
          picker.setOption({
            color: 'lime',
          });
          break;
      }
    });
  }

  const $selects = $controller.querySelectorAll('select');
  for (let i=0; i<$selects.length; i++) {
    $selects[i].addEventListener('change', e => {
      switch (e.target.dataset.type) {
        case 'change-type':
          changeType(e.target.value);
          break;
      }
    });
  }
}
