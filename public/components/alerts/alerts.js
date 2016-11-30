import Component from 'can-component';
import DefineMap from 'can-define/map/';
import template from './alerts.stache';
import './alerts.less';
import hub from '../../lib/hub';
import AlertItem from '../../models/alert';

/**
 * TODO: use streams for modifying alerts
 *      - https://github.com/donejs/bitcentive/issues/149
 */

export const ViewModel = DefineMap.extend({
  subscription: '*',
  alerts: {
    Value: AlertItem.List
  },
  addAlert (alert) {
    this.alerts.push(alert);
  },
  removeAlert (alert) {
    const idx = this.alerts.indexOf(alert);
    if (idx !== -1) {
      this.alerts.splice(idx, 1);
    }
  },
  // called by ($inserted) event
  showAlert (alert) {
    // timeout allows for paint cycle to pass
    setTimeout(() => {
      alert.visible = true;
    }, 30);
    
    if (alert.displayInterval > 0) {
      setTimeout(() => this.hideAlert(alert), 30 + alert.displayInterval);
    }
  },
  hideAlert (alert) {
    alert.visible = false;
    // TODO: this should happen on CSS animation end
    setTimeout(() => this.removeAlert(alert), 500);
  }
});

export default Component.extend({
  tag: 'bit-alerts',
  ViewModel,
  template,
  events: {
    'inserted'() {
      this.viewModel.subscription = hub.subscribe('alert', this.viewModel.addAlert.bind(this.viewModel));
    },
    'removed'() {
      this.viewModel.subscription.remove();
    }
  }
});
