var live = require('./core');
var nodeLists = require('can-view-nodelist');

/**
 * @function can-view-live.text text
 * @parent can-view-live
 * @release 2.0.4
 *
 * @signature `live.text(el, compute, [parentNode], [nodeList])`
 *
 * Replaces one element with some content while keeping [can-view-live.nodeLists nodeLists] data correct.
 */
live.text = function (el, compute, parentNode, nodeList) {
	var parent = live.getParentNode(el, parentNode);
	// setup listening right away so we don't have to re-calculate value
	var data = live.listen(parent, compute, function (ev, newVal, oldVal) {
		// Sometimes this is 'unknown' in IE and will throw an exception if it is
		/* jshint ignore:start */
		if (typeof node.nodeValue !== 'unknown') {
			node.nodeValue = live.makeString(newVal);
		}
		/* jshint ignore:end */
		// TODO: remove in 2.1
		data.teardownCheck(node.parentNode);
	});
	// The text node that will be updated

	var node = el.ownerDocument.createTextNode(live.makeString(compute()));
	if(nodeList) {
		nodeList.unregistered = data.teardownCheck;
		data.nodeList = nodeList;

		nodeLists.update(nodeList, [node]);
		nodeLists.replace([el], node);
	} else {
		// Replace the placeholder with the live node and do the nodeLists thing.
		// Add that node to nodeList so we can remove it when the parent element is removed from the page
		data.nodeList = live.replace([el], node, data.teardownCheck);
	}
};
