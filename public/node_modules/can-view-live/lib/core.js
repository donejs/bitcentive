var parser = require('can-view-parser');
var domEvents = require('can-util/dom/events/events');
var nodeLists = require('can-view-nodelist');
var makeFrag = require('can-util/dom/frag/frag');
var childNodes = require('can-util/dom/child-nodes/child-nodes');

require("can-util/dom/events/removed/removed");

var childMutationCallbacks = {};


/**
 * @module {{}} can-view-live can-view-live
 * @parent can-infrastructure
 * @package ../package.json
 *
 * Setup live-binding between the DOM and a compute manually.
 *
 * @option {Object} An object with the live-binding methods:
 * [can-view-live.html], [can-view-live.list], [can-view-live.text], and
 * [can-view-live.attr].
 *
 * @release 2.0.4
 *
 * @body
 *
 * ## Use
 *
 * [can-view-live] is an object with utlitiy methods for setting up
 * live-binding in relation to different parts of the DOM and DOM elements.  For
 * example, to make an `<h2>`'s text stay live with
 * a compute:
 *
 *     var text = canCompute("Hello World");
 *     var textNode = $("h2").text(" ")[0].childNodes[0];
 *     live.text(textNode, text);
 *
 *
 */
var live = {
	setup: function (el, bind, unbind) {
		// Removing an element can call teardown which
		// unregister the nodeList which calls teardown
		var tornDown = false,
			teardown = function () {
				if (!tornDown) {
					tornDown = true;
					unbind(data);
					domEvents.removeEventListener.call(el, 'removed', teardown);
				}
				return true;
			}, data = {
				teardownCheck: function (parent) {
					return parent ? false : teardown();
				}
			};
		domEvents.addEventListener.call(el, 'removed', teardown);
		bind(data);
		return data;
	},
	// #### listen
	// Calls setup, but presets bind and unbind to
	// operate on a compute
	listen: function (el, compute, change) {
		return live.setup(el, function () {
			compute.computeInstance.addEventListener('change', change);
		}, function (data) {
			compute.computeInstance.removeEventListener('change', change);
			if (data.nodeList) {
				nodeLists.unregister(data.nodeList);
			}
		});
	},
	// #### getAttributeParts
	// Breaks up a string like foo='bar' into ["foo","'bar'""]
	getAttributeParts: function (newVal) {
		var attrs = {},
			attr;
		parser.parseAttrs(newVal,{
			attrStart: function(name){
				attrs[name] = "";
				attr = name;
			},
			attrValue: function(value){
				attrs[attr] += value;
			},
			attrEnd: function(){}
		});
		return attrs;
	},
	isNode: function(obj){
		return obj && obj.nodeType;
	},
	addTextNodeIfNoChildren: function(frag){
		if(!frag.firstChild) {
			frag.appendChild(frag.ownerDocument.createTextNode(""));
		}
	},
	registerChildMutationCallback: function(tag, callback){
		if(callback) {
			childMutationCallbacks[tag] = callback;
		} else {
			return childMutationCallbacks[tag];
		}
	},
	callChildMutationCallback: function(el) {
		var callback = el && childMutationCallbacks[el.nodeName.toLowerCase()];
		if(callback) {
			callback(el);
		}
	},


	/**
	 * @function can.view.live.replace
	 * @parent can.view.live
	 * @release 2.0.4
	 *
	 * Replaces one element with some content while keeping [can.view.live.nodeLists nodeLists] data
	 * correct.
	 *
	 * @param {Array.<HTMLElement>} nodes An array of elements.  There should typically be one element.
	 * @param {String|HTMLElement|DocumentFragment} val The content that should replace
	 * `nodes`.  If a string is passed, it will be [can.view.hookup hookedup].
	 *
	 * @param {function} [teardown] A callback if these elements are torn down.
	 */
	replace: function (nodes, val, teardown) {
		var oldNodes = nodes.slice(0),
			frag = makeFrag(val);
		nodeLists.register(nodes, teardown);
		// We need to mark each node as belonging to the node list.
		nodeLists.update(nodes, childNodes(frag));
		nodeLists.replace(oldNodes, frag);
		return nodes;
	},
	getParentNode: function (el, defaultParentNode) {
		return defaultParentNode && el.parentNode.nodeType === 11 ? defaultParentNode : el.parentNode;
	},
	makeString: function(txt){
		return txt == null ? "" : ""+txt;
	}
};

module.exports = live;
