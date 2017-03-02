#Bitcentive alerts

The alerts in this app render a friendly popover message in the upper righthand corner of the screen. Alerts are triggered by a simple event dispatcher we have named "hub" (see [public/lib/event-hub](../../lib/event-hub.js)). Any module in the application can trigger an alert by publishing an "alert" object:

```js
import hub from 'bitcentive/lib/event-hub';

hub.dispatch({
	type: 'alert',
	kind: 'danger|success|info|warning',
	title: 'Optional title',
	message: 'Please run npm install',
	displayInterval: -1 // ms - used to autohide alert
});
```

The `kind` property will affect the presentation of the alert and should be one of the [Bootstrap Alert](http://getbootstrap.com/components/#alerts) states. You can also set the `displayInterval` property to the number of ms after which the alert should auto-hide. By default the alerts will never auto-hide.