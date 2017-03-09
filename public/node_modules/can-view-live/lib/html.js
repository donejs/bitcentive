var live = require('./core');
var nodeLists = require('can-view-nodelist');
var makeFrag = require('can-util/dom/frag/frag');
var makeArray = require('can-util/js/make-array/make-array');
var childNodes = require('can-util/dom/child-nodes/child-nodes');

/**
 * @function can-view-live.html html
 * @parent can-view-live
 * @release 2.0.4
 *
 * Live binds a compute's value to a collection of elements.
 *
 * @signature `live.html(el, compute, [parentNode])`
 *
 * `live.html` is used to setup incremental live-binding on a block of html.
 *
 * ```js
 * // a compute that change's it's list
 * var greeting = compute(function(){
 *   return "Welcome <i>"+me.attr("name")+"</i>"
 * });
 *
 * var placeholder = document.createTextNode(" ");
 * $("#greeting").append(placeholder);
 *
 * live.html(placeholder, greeting);
 * ```
 *
 * @param {HTMLElement} el An html element to replace with the live-section.
 *
 * @param {can.compute} compute A [can.compute] whose value is HTML.
 *
 * @param {HTMLElement} [parentNode] An overwritable parentNode if `el`'s parent is
 * a documentFragment.
 *
 *
 */
live.html = function (el, compute, parentNode, nodeList) {
	var data;
	parentNode = live.getParentNode(el, parentNode);
	data = live.listen(parentNode, compute, function (ev, newVal, oldVal) {
		// TODO: remove teardownCheck in 2.1
		var attached = nodeLists.first(nodes).parentNode;
		// update the nodes in the DOM with the new rendered value
		if (attached) {
			makeAndPut(newVal);
		}
		var pn = nodeLists.first(nodes).parentNode;
		data.teardownCheck(pn);
		live.callChildMutationCallback(pn);
	});

	var nodes = nodeList || [el],
		makeAndPut = function (val) {
			var isFunction = typeof val === "function",
				aNode = live.isNode(val),
				frag = makeFrag(isFunction ? "" : val),
				oldNodes = makeArray(nodes);

			// Add a placeholder textNode if necessary.
			live.addTextNodeIfNoChildren(frag);

			// We need to mark each node as belonging to the node list.
			oldNodes = nodeLists.update(nodes, childNodes(frag));
			if(isFunction) {
				val(frag.firstChild);
			}
			nodeLists.replace(oldNodes, frag);
		};

	data.nodeList = nodes;

	// register the span so nodeLists knows the parentNodeList
	if(!nodeList) {
		nodeLists.register(nodes, data.teardownCheck);
	} else {
		nodeList.unregistered = data.teardownCheck;
	}
	makeAndPut(compute());
};
