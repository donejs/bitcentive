var attr = require('can-util/dom/attr/attr');
var live = require('./core');
/**
 * @function can-view-live.attr attr
 * @parent can-view-live
 *
 * @signature `live.attr(el, attributeName, compute)`
 *
 * Keep an attribute live to a [can-compute].
 *
 * ```js
 * var div = document.createElement('div');
 * var compute = canCompute("foo bar");
 * live.attr(div,"class", compute);
 * ```
 *
 * @param {HTMLElement} el The element whos attribute will be kept live.
 * @param {String} attributeName The attribute name.
 * @param {can-compute} compute The compute.
 *
 */
live.attr = function(el, attributeName, compute){
	live.listen(el, compute, function (ev, newVal) {
		attr.set(el, attributeName, newVal);
	});
	attr.set(el, attributeName, compute());
};
