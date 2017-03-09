var makeArray = require('can-util/js/make-array/make-array');
var each = require('can-util/js/each/each');
var namespace = require('can-namespace');
var domMutate = require('can-util/dom/mutate/mutate');

var CIDMap = require("can-util/js/cid-map/cid-map");
// # can/view/node_lists/node_list.js
//
// ## Helpers

// A mapping of element ids to nodeList id allowing us to quickly find an element
// that needs to be replaced when updated.
var nodeMap = new CIDMap(),
	splice = [].splice,
	push = [].push,

	// ## nodeLists.itemsInChildListTree
	// Given a nodeList return the number of child items in the provided
	// list and any child lists.
	itemsInChildListTree = function(list){
		var count = 0;
		for(var i = 0, len = list.length ; i < len; i++){
			var item = list[i];
			// If the item is an HTMLElement then increment the count by 1.
			if(item.nodeType) {
				count++;
			} else {
				// If the item is not an HTMLElement it is a list, so
				// increment the count by the number of items in the child
				// list.
				count += itemsInChildListTree(item);
			}
		}
		return count;
	},
	// replacements is an array of nodeLists
	// makes a map of the first node in the replacement to the nodeList
	replacementMap = function(replacements, idMap){
		var map = new CIDMap();
		for(var i = 0, len = replacements.length; i < len; i++){
			var node = nodeLists.first(replacements[i]);
			map.set(node, replacements[i]);
		}
		return map;
	},
	addUnfoundAsDeepChildren = function(list, rMap){
		rMap.forEach(function(replacement){
			list.newDeepChildren.push(replacement);
		});
	};

// ## Registering & Updating
//
// To keep all live-bound sections knowing which elements they are managing,
// all live-bound elments are registered and updated when they change.
//
// For example, the above template, when rendered with data like:
//
//     data = new can.Map({
//         items: ["first","second"]
//     })
//
// This will first render the following content:
//
//     <div>
//         <span data-view-id='5'/>
//     </div>
//
// When the `5` callback is called, this will register the `<span>` like:
//
//     var ifsNodes = [<span 5>]
//     nodeLists.register(ifsNodes);
//
// And then render `{{if}}`'s contents and update `ifsNodes` with it:
//
//     nodeLists.update( ifsNodes, [<"\nItems:\n">, <span data-view-id="6">] );
//
// Next, hookup `6` is called which will regsiter the `<span>` like:
//
//     var eachsNodes = [<span 6>];
//     nodeLists.register(eachsNodes);
//
// And then it will render `{{#each}}`'s content and update `eachsNodes` with it:
//
//     nodeLists.update(eachsNodes, [<label>,<label>]);
//
// As `nodeLists` knows that `eachsNodes` is inside `ifsNodes`, it also updates
// `ifsNodes`'s nodes to look like:
//
//     [<"\nItems:\n">,<label>,<label>]
//
// Now, if all items were removed, `{{#if}}` would be able to remove
// all the `<label>` elements.
//
// When you regsiter a nodeList, you can also provide a callback to know when
// that nodeList has been replaced by a parent nodeList.  This is
// useful for tearing down live-binding.
var nodeLists = {

   /**
	* @function can-view-nodelist.update update
	* @parent can-view-nodelist/methods
	*
	* @signature `nodeLists.update(nodeList, newNodes)`
	*
	* Updates a nodeList with new items, i.e. when values for the template have changed.
	*
	*   @param {can-view-nodelist/types/NodeList} nodeList The list to update with the new nodes.
	*   @param {can-view-nodelist/types/NodeList} newNodes The new nodes to update with.
	*
	*   @return {Array<Node>} The nodes that were removed from `nodeList`.
	*/
	update: function (nodeList, newNodes) {
		// Unregister all childNodeLists.
		var oldNodes = nodeLists.unregisterChildren(nodeList);

		newNodes = makeArray(newNodes);

		var oldListLength = nodeList.length;

		// Replace oldNodeLists's contents.
		splice.apply(nodeList, [
			0,
			oldListLength
		].concat(newNodes));

		// Replacements are nodes that have replaced the original element this is on.
		// We can't simply insert elements because stache does children before parents.
		if(nodeList.replacements){
			nodeLists.nestReplacements(nodeList);
			nodeList.deepChildren = nodeList.newDeepChildren;
			nodeList.newDeepChildren = [];
		} else {
			nodeLists.nestList(nodeList);
		}

		return oldNodes;
	},
   /**
	* @function can-view-nodelist.nestReplacements nestReplacements
	* @parent can-view-nodelist/methods
	* @signature `nodeLists.nestReplacements(list)`
	*
	* Goes through each node in the list. `[el1, el2, el3, ...]`
	* Finds the nodeList for that node in replacements.  el1's nodeList might look like `[el1, [el2]]`.
	* Replaces that element and any other elements in the node list with the
	* nodelist itself. resulting in `[ [el1, [el2]], el3, ...]`
	* If a replacement is not found, it was improperly added, so we add it as a deepChild.
	*
	* @param {can-view-nodelist/types/NodeList} list  The nodeList of nodes to go over
	*
	*/
	nestReplacements: function(list){
		var index = 0,
			// temporary id map that is limited to this call
			idMap = {},
			// replacements are in reverse order in the DOM
			rMap = replacementMap(list.replacements, idMap),
			rCount = list.replacements.length;

		while(index < list.length && rCount) {
			var node = list[index],
				replacement = rMap.get(node);
			if( replacement ) {
				rMap["delete"](node);
				list.splice( index, itemsInChildListTree(replacement), replacement );
				rCount--;
			}
			index++;
		}
		// Only do this if
		if(rCount) {
			addUnfoundAsDeepChildren(list, rMap );
		}

		list.replacements = [];
	},
	/**
	 * @function can-view-nodelist.nestList nestList
	 * @parent can-view-nodelist/methods
	 * @signature `nodeLists.nestList(list)`
	 *
	 * If a given list does not exist in the nodeMap then create an lookup
	 * id for it in the nodeMap and assign the list to it.
	 * If the the provided does happen to exist in the nodeMap update the
	 * elements in the list.
	 *
	 * @param {can-view-nodelist/types/NodeList} list The nodeList being nested.
	 *
	 */
	nestList: function(list){
		var index = 0;
		while(index < list.length) {
			var node = list[index],
				childNodeList = nodeMap.get(node);


			if(childNodeList) {
				// if this node is in another nodelist
				if(childNodeList !== list) {
					// update this nodeList to point to the childNodeList
					list.splice( index, itemsInChildListTree(childNodeList), childNodeList );
				}
			} else {
				// Indicate the new nodes belong to this list.
				nodeMap.set(node, list);
			}
			index++;
		}
	},

	/**
	 * @function can-view-nodelist.last last
	 * @parent can-view-nodelist/methods
	 * @signature `nodeLists.last(nodeList)`
	 *
	 * Return the last HTMLElement in a nodeList; if the last
	 * element is a nodeList, returns the last HTMLElement of
	 * the child list, etc.
	 *
	 * @param {can-view-nodelist/types/NodeList} nodeList A nodeList.
	 * @return {HTMLElement} The last element of the last list nested in this list.
	 *
	 */
	last: function(nodeList){
		var last = nodeList[nodeList.length - 1];
		// If the last node in the list is not an HTMLElement
		// it is a nodeList so call `last` again.
		if(last.nodeType) {
			return last;
		} else {
			return nodeLists.last(last);
		}
	},

	/**
	 * @function can-view-nodelist.first first
	 * @parent can-view-nodelist/methods
	 * @signature `nodeLists.first(nodeList)`
	 *
	 * Return the first HTMLElement in a nodeList; if the first
	 * element is a nodeList, returns the first HTMLElement of
	 * the child list, etc.
	 *
	 * @param {can-view-nodelist/types/NodeList} nodeList A nodeList.
	 * @return {HTMLElement} The first element of the first list nested in this list.
	 *
	 *
	 */
	first: function(nodeList) {
		var first = nodeList[0];
		// If the first node in the list is not an HTMLElement
		// it is a nodeList so call `first` again.
		if(first.nodeType) {
			return first;
		} else {
			return nodeLists.first(first);
		}
	},
	flatten: function(nodeList){
		var items = [];
		for(var i = 0 ; i < nodeList.length; i++) {
			var item = nodeList[i];
			if(item.nodeType) {
				items.push(item);
			} else {
				items.push.apply(items, nodeLists.flatten(item));
			}
		}
		return items;
	},
	/**
	 * @function can-view-nodelist.register register
	 * @parent can-view-nodelist/methods
	 *
	 * @signature `nodeLists.register(nodeList, unregistered, parent, directlyNested)`
	 *
	 * Registers a nodeList and returns the nodeList passed to register.
	 *
	 *   @param {can-view-nodelist/types/NodeList} nodeList A nodeList.
	 *   @param {function()} unregistered A callback to call when the nodeList is unregistered.
	 *   @param {can-view-nodelist/types/NodeList} parent The parent nodeList of this nodeList.
	 *   @param {Boolean} directlyNested `true` if nodes in the nodeList are direct children of the parent.
	 *   @return {can-view-nodelist/types/NodeList} The passed in nodeList.
	 *
	 */
	register: function (nodeList, unregistered, parent, directlyNested) {
		// If a unregistered callback has been provided assign it to the nodeList
		// as a property to be called when the nodeList is unregistred.
		nodeList.unregistered = unregistered;
		nodeList.parentList = parent;
		nodeList.nesting = parent && typeof parent.nesting !== 'undefined' ? parent.nesting + 1 : 0;

		if(parent) {
			nodeList.deepChildren = [];
			nodeList.newDeepChildren = [];
			nodeList.replacements = [];
			if(parent !== true) {
				if(directlyNested) {
					parent.replacements.push(nodeList);
				}
				else {
					parent.newDeepChildren.push(nodeList);
				}
			}
		}
		else {
			nodeLists.nestList(nodeList);
		}


		return nodeList;
	},

	/**
	 * @function can-view-nodelist.unregisterChildren unregisterChildren
	 * @parent can-view-nodelist/methods
	 * @signature `nodeLists.unregisterChildren(nodeList)`
	 *
	 * Unregister all childen within the provided list and return the
	 * unregistred nodes.
	 *
	 * @param {can-view-nodelist/types/NodeList} nodeList The nodeList of child nodes to unregister.
	 * @return {Array} The list of all nodes that were unregistered.
	 */
	unregisterChildren: function(nodeList){
		var nodes = [];
		// For each node in the nodeList we want to compute it's id
		// and delete it from the nodeList's internal map.
		each(nodeList, function (node) {
			// If the node does not have a nodeType it is an array of
			// nodes.
			if(node.nodeType) {
				if(!nodeList.replacements) {
					nodeMap["delete"](node);
				}

				nodes.push(node);
			} else {
				// Recursively unregister each of the child lists in
				// the nodeList.
				push.apply(nodes, nodeLists.unregister(node, true));
			}
		});

		each(nodeList.deepChildren, function(nodeList){
			nodeLists.unregister(nodeList, true);
		});

		return nodes;
	},

	/**
		@function can-view-nodelist.unregister unregister
		@parent can-view-nodelist/methods
		@signature `nodeLists.unregister(nodeList, isChild)`
		@param {ArrayLike} nodeList a nodeList to unregister from its parent
		@param {isChild}  true if the nodeList is a direct child, false if a deep child
		@return {Array}   a list of all nodes that were unregistered

		Unregister's a nodeList and returns the unregistered nodes.
		Call if the nodeList is no longer being updated. This will
		also unregister all child nodeLists.
	*/
	unregister: function (nodeList, isChild) {
		var nodes = nodeLists.unregisterChildren(nodeList, true);

		// If an 'unregisted' function was provided during registration, remove
		// it from the list, and call the function provided.
		if (nodeList.unregistered) {
			var unregisteredCallback = nodeList.unregistered;
			nodeList.replacements = nodeList.unregistered = null;
			if(!isChild) {
				var deepChildren = nodeList.parentList && nodeList.parentList.deepChildren;
				if(deepChildren) {
					var index = deepChildren.indexOf(nodeList);
					if(index !== -1) {
						deepChildren.splice(index,1);
					}
				}
			}
			unregisteredCallback();
		}
		return nodes;
	},
	/**
	 * @function can-view-nodelist.after after
	 * @parent can-view-nodelist/methods
	 * @hide
	 * @signature `nodeLists.after(oldElements, newFrag)`
	 *
	 *   Inserts `newFrag` after `oldElements`.
	 *
	 *   @param {ArrayLike<Node>} oldElements The elements to use as reference.
	 *   @param {DocumentFragment} newFrag The fragment to insert.
	 *
	 */
	after: function (oldElements, newFrag) {
		var last = oldElements[oldElements.length - 1];
		// Insert it in the `document` or `documentFragment`
		if (last.nextSibling) {
			domMutate.insertBefore.call(last.parentNode, newFrag, last.nextSibling);
		} else {
			domMutate.appendChild.call(last.parentNode, newFrag );
		}
	},
	/**
	 * @function can-view-nodelist.replace replace
	 * @hide
	 * @parent can-view-nodelist/methods
	 * @signature `nodeLists.replace(oldElements, newFrag)`
	 *
	 * Replaces `oldElements` with `newFrag`.
	 *
	 * @param {Array<Node>} oldElements the list elements to remove
	 * @param {DocumentFragment} newFrag the fragment to replace the old elements
	 *
	 */
	replace: function (oldElements, newFrag) {
		// The following helps make sure that a selected <option> remains
		// the same by removing `selected` from the currently selected option
		// and adding selected to an option that has the same value.
		var selectedValue,
			parentNode = oldElements[0].parentNode;

		if(parentNode.nodeName.toUpperCase() === "SELECT" && parentNode.selectedIndex >= 0) {
			selectedValue = parentNode.value;
		}
		if(oldElements.length === 1) {
			domMutate.replaceChild.call(parentNode, newFrag, oldElements[0]);
		} else {
			nodeLists.after(oldElements, newFrag);
			nodeLists.remove(oldElements);
		}

		if(selectedValue !== undefined) {
			parentNode.value = selectedValue;
		}
	},
	/**
	 * @function can-view-nodelist.remove remove
	 * @parent can-view-nodelist/methods
	 * @hide
	 * @signature `nodeLists.remove(elementsToBeRemoved)`
	 *
	 * Remove all Nodes in `oldElements` from the DOM.
	 *
	 * @param {ArrayLike<Node>} oldElements the list of Elements to remove (must have a common parent)
	 *
	 */
	remove: function(elementsToBeRemoved){
		var parent = elementsToBeRemoved[0] && elementsToBeRemoved[0].parentNode;
		each(elementsToBeRemoved, function(child){
			domMutate.removeChild.call(parent, child);
		});
	},
	nodeMap: nodeMap
};
module.exports = namespace.nodeLists = nodeLists;
