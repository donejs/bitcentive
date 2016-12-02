import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';

const AlertItem = DefineMap.extend({
  // bootstrap states - info, warning, success, danger
  type: 'string',
  title: 'string',
  message: 'string',
  visible: 'boolean',
  
  // time in ms to auto-hide alert - 0 means never auto-hide
  displayInterval: {
    value: 0
  },
  
  // map alert types to bootstrap css classes
  alertClass: {
    get() {
      let className;
      switch (this.type) {
        case 'error':
        case 'danger':
          className = 'danger';
          break;

        case 'info':
        case 'warning':
        case 'success':
          className = this.type;
          break;

        default:
          className = 'info';
      }
      return 'alert-' + className
    }
  }
});

AlertItem.List = DefineList.extend({
  '#': AlertItem
});

export default AlertItem;