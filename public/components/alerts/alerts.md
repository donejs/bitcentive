#Bitcentive alerts

The alerts in this app render a friendly popover message in the upper righthand corner of the screen. Alerts are triggered by a simple pub/sub mechanism called "hub" (see [public/lib/hub](../../lib/hub.js)). Any module in the application can trigger an alert by publishing an "alert" and a simple Alert object (see [public/models/alert](../../models/alert.js)):

```js
import hub from 'bitcentive/lib/hub';

hub.publish('alert', {
	type: 'info',
	title: 'Something happened!',
	message: 'Please run npm install'
});
```

The `type` property will affect the presentation of the alert and should be one of the [Bootstrap Alert](http://getbootstrap.com/components/#alerts) states. You can also set the `displayInterval` property to the number of ms after which the alert should auto-hide. By default the alerts will never auto-hide.