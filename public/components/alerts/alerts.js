import Kefir from 'kefir';
import Component from 'can-component';
import DefineMap from 'can-define/map/';
import 'can-define-stream';
import view from './alerts.stache';
import './alerts.less';
import hub from '../../lib/event-hub';
import AlertItem from '../../models/alert';

export const reducers = {
  add(alerts, alert) {
    return [alert, ...alerts.slice()];
  },
  remove(alerts, alert) {
    return alerts.filter(item => item.id !== alert.id);
  }
};

export const ViewModel = DefineMap.extend({
  addAlertStream: {
    value() {
      return this.stream('add-alert')
        .map(ev => ev.args[0])
        .merge(Kefir.stream(emitter => {
          const handler = (ev, val) => emitter.emit(val);
          hub.on('alert', handler);
          return () => {
            hub.off('alert', handler)
          };
        }))
        .map(alert => {
          if ( !(alert instanceof AlertItem) ) {
            alert = new AlertItem(alert);
          }
          return { 
            action: 'ADD_ALERT', 
            alert
          };
        });
    }
  },
  autoHideStream: {
    value() {
      return this.addAlertStream.flatMap(ev => {
        if (ev.alert.displayInterval > 0) {
          return Kefir.later(ev.alert.displayInterval, {
            action: 'REMOVE_ALERT',
            alert: ev.alert
          });
        } 
        return Kefir.constant({ action: 'no-op' });
      });
    }
  },
  removeAlertStream: {
    value() {
      return this.stream('remove-alert').map(ev => {
        return {
          action: 'REMOVE_ALERT',
          alert: ev.args[0]
        };
      });
    }
  },
  alerts: {
    stream() {
      // TODO: use can-event
      return Kefir.merge([this.addAlertStream, this.autoHideStream, this.removeAlertStream]).scan((alerts, ev) => {
        let alert = ev.alert;
        switch (ev.action) {
          case 'ADD_ALERT':
            return reducers.add.call(this, alerts, alert);

          case 'REMOVE_ALERT':
            return reducers.remove.call(this, alerts, alert);

          default:
            return alerts;
        }
      }, []);
    }
  },
  addAlert (alert) {
    this.dispatch('add-alert', [alert]);
  },
  removeAlert (alert) {
    this.dispatch('remove-alert', [alert]);
  }
});

export default Component.extend({
  tag: 'bit-alerts',
  ViewModel,
  view
});
