var live = require('./core');
var makeRunInOrder = require('./util/runInOrder');
var runInOrder = makeRunInOrder();

var nodeLists = require('can-view-nodelist');
var makeCompute = require('can-compute');
var canBatch = require('can-event/batch/batch');

var frag = require('can-util/dom/frag/frag');
var domMutate = require('can-util/dom/mutate/mutate');
var childNodes = require('can-util/dom/child-nodes/child-nodes');

var makeArray = require('can-util/js/make-array/make-array');
var each = require('can-util/js/each/each');
var isFunction = require('can-util/js/is-function/is-function');
var diff = require('can-util/js/diff/diff');
var splice = [].splice;


// a helper function that renders something and adds its nodeLists to newNodeLists
// in the right way for stache.
var renderAndAddToNodeLists = function(newNodeLists, parentNodeList, render, context, args){
	var itemNodeList = [];

	if(parentNodeList) {
		nodeLists.register(itemNodeList,null, parentNodeList, true);
		itemNodeList.parentList = parentNodeList;
		itemNodeList.expression = "#each SUBEXPRESSION";
	}

	var itemHTML = render.apply(context, args.concat([itemNodeList])),
		itemFrag = frag(itemHTML);

	var children = makeArray(childNodes(itemFrag));
	if(parentNodeList) {
		nodeLists.update(itemNodeList, children);
		newNodeLists.push(itemNodeList);
	} else {
		newNodeLists.push(nodeLists.register(children));
	}
	return itemFrag;
},
removeFromNodeList = function(masterNodeList, index, length){
	var removedMappings = masterNodeList.splice(index + 1, length),
		itemsToRemove = [];
	each(removedMappings, function (nodeList) {

		// Unregister to free up event bindings.
		var nodesToRemove = nodeLists.unregister(nodeList);

		// add items that we will remove all at once
		[].push.apply(itemsToRemove, nodesToRemove);
	});
	return itemsToRemove;
},
addFalseyIfEmpty = function(list, falseyRender, masterNodeList, nodeList){
	if(falseyRender && list.length === 0){
		// there are no items ... we should render the falsey template
		var falseyNodeLists = [];
		var falseyFrag = renderAndAddToNodeLists(falseyNodeLists, nodeList, falseyRender, list, [list]);

		nodeLists.after([masterNodeList[0]], falseyFrag);
		masterNodeList.push(falseyNodeLists[0]);
	}
};

/**
 * @function can-view-live.list list
 * @parent can-view-live
 * @release 2.0.4
 *
 * @signature `live.list(el, list, render, context, [parentNode])`
 *
 * Live binds a compute's list incrementally.
 *
 * ```js
 * // a compute that change's it's list
 * var todos = compute(function(){
 *   return new Todo.List({page: can.route.attr("page")})
 * })
 *
 * var placeholder = document.createTextNode(" ");
 * $("ul#todos").append(placeholder);
 *
 * can.view.live.list(
 *   placeholder,
 *   todos,
 *   function(todo, index){
 *     return "<li>"+todo.attr("name")+"</li>"
 *   });
 * ```
 *
 * @param {HTMLElement} el An html element to replace with the live-section.
 *
 * @param {can-compute|can-list|can-define/list/list} list An observable list type.
 *
 * @param {function(this:*,*,index):String} render(index, index) A function that when called with
 * the incremental item to render and the index of the item in the list.
 *
 * @param {Object} context The `this` the `render` function will be called with.
 *
 * @param {HTMLElement} [parentNode] An overwritable parentNode if `el`'s parent is
 * a documentFragment.
 *
 *
 */
live.list = function (el, compute, render, context, parentNode, nodeList, falseyRender) {
	// A nodeList of all elements this live-list manages.
	// This is here so that if this live list is within another section
	// that section is able to remove the items in this list.
	var masterNodeList = nodeList || [el],
		// A mapping of items to their indicies'
		indexMap = [],
		// True once all previous events have been fired
		afterPreviousEvents = false,
		// Indicates that we should not be responding to changes in the list.
		// It's possible that the compute change causes this list behavior to be torn down.
		// However that same "change" dispatch will eventually fire the updateList handler because
		// the list of "change" handlers is copied when dispatching starts.
		// A 'perfect' fix would be to use linked lists for event handlers.
		isTornDown = false,
		// Called when items are added to the list.
		add = runInOrder(function add (ev, items, index) {

			if (!afterPreviousEvents) {
				return;
			}
			// Collect new html and mappings
			var frag = text.ownerDocument.createDocumentFragment(),
				newNodeLists = [],
				newIndicies = [];
			// For each new item,
			each(items, function (item, key) {

				var itemIndex = makeCompute(key + index),
					itemCompute = makeCompute(function(newVal){
						if(arguments.length) {
							if("set" in list) {
								list.set(itemIndex(), newVal);
							} else {
								list.attr(itemIndex(), newVal);
							}
						} else {
							return item;
						}
					}),
					itemFrag = renderAndAddToNodeLists(newNodeLists, nodeList, render, context, [itemCompute, itemIndex]);

				// Hookup the fragment (which sets up child live-bindings) and
				// add it to the collection of all added elements.
				frag.appendChild(itemFrag);
				// track indicies;
				newIndicies.push(itemIndex);
			});
			// The position of elements is always after the initial text placeholder node
			var masterListIndex = index+1;

			// remove falsey if there's something there
			if(!indexMap.length) {
				// remove all leftover things
				var falseyItemsToRemove = removeFromNodeList(masterNodeList, 0, masterNodeList.length - 1);
				nodeLists.remove(falseyItemsToRemove);
			}

			// Check if we are adding items at the end
			if (!masterNodeList[masterListIndex]) {
				nodeLists.after(masterListIndex === 1 ? [text] : [nodeLists.last(masterNodeList[masterListIndex - 1])], frag);
			} else {
				// Add elements before the next index's first element.
				var el = nodeLists.first(masterNodeList[masterListIndex]);
				domMutate.insertBefore.call(el.parentNode, frag, el);
			}
			splice.apply(masterNodeList, [
				masterListIndex,
				0
			].concat(newNodeLists));

			// update indices after insert point
			splice.apply(indexMap, [
				index,
				0
			].concat(newIndicies));

			for (var i = index + newIndicies.length, len = indexMap.length; i < len; i++) {
				indexMap[i](i);
			}
			if(ev.callChildMutationCallback !== false) {
				live.callChildMutationCallback(text.parentNode);
			}

		}),
		// Called when an item is set with .attr
		set = function(ev, newVal, index) {
			remove({}, { length: 1 }, index, true);
			add({}, [newVal], index);
		},
		// Called when items are removed or when the bindings are torn down.
		remove = runInOrder(function remove (ev, items, index, duringTeardown, fullTeardown) {

			if (!afterPreviousEvents) {
				return;
			}
			// If this is because an element was removed, we should
			// check to make sure the live elements are still in the page.
			// If we did this during a teardown, it would cause an infinite loop.
			if (!duringTeardown && data.teardownCheck(text.parentNode)) {
				return;
			}
			if(index < 0) {
				index = indexMap.length + index;
			}
			var itemsToRemove = removeFromNodeList(masterNodeList, index, items.length);

			// update indices after remove point
			indexMap.splice(index, items.length);
			for (var i = index, len = indexMap.length; i < len; i++) {
				indexMap[i](i);
			}

			// don't remove elements during teardown.  Something else will probably be doing that.
			if(!fullTeardown) {
				// adds the falsey section if the list is empty
				addFalseyIfEmpty(list, falseyRender, masterNodeList, nodeList);
				nodeLists.remove(itemsToRemove);
				if(ev.callChildMutationCallback !== false) {
					live.callChildMutationCallback(text.parentNode);
				}
			} else {
				nodeLists.unregister(masterNodeList);
			}
		}),
		move = function (ev, item, newIndex, currentIndex) {
			if (!afterPreviousEvents) {
				return;
			}
			// The position of elements is always after the initial text
			// placeholder node
			newIndex = newIndex + 1;
			currentIndex = currentIndex + 1;

			var referenceNodeList = masterNodeList[newIndex];
			var movedElements = frag( nodeLists.flatten(masterNodeList[currentIndex]) );
			var referenceElement;

			// If we're moving forward in the list, we want to be placed before
			// the item AFTER the target index since removing the item from
			// the currentIndex drops the referenceItem's index. If there is no
			// nextSibling, insertBefore acts like appendChild.
			if (currentIndex < newIndex) {
				referenceElement = nodeLists.last(referenceNodeList).nextSibling;
			} else {
				referenceElement = nodeLists.first(referenceNodeList);
			}

			var parentNode = masterNodeList[0].parentNode;

			// Move the DOM nodes into the proper location
			parentNode.insertBefore(movedElements, referenceElement);

			// Now, do the same for the masterNodeList. We need to keep it
			// in sync with the DOM.

			// Save a reference to the "node" that we're manually moving
			var temp = masterNodeList[currentIndex];

			// Remove the movedItem from the masterNodeList
			[].splice.apply(masterNodeList, [currentIndex, 1]);

			// Move the movedItem to the correct index in the masterNodeList
			[].splice.apply(masterNodeList, [newIndex, 0, temp]);

			// Convert back to a zero-based array index
			newIndex = newIndex - 1;
			currentIndex = currentIndex - 1;

			// Grab the index compute from the `indexMap`
			var indexCompute = indexMap[currentIndex];

			// Remove the index compute from the `indexMap`
			[].splice.apply(indexMap, [currentIndex, 1]);

			// Move the index compute to the correct index in the `indexMap`
			[].splice.apply(indexMap, [newIndex, 0, indexCompute]);

			var i = Math.min(currentIndex, newIndex);
			var len = indexMap.length;

			for (i, len; i < len; i++) {
				indexMap[i](i);
			}
			if(ev.callChildMutationCallback !== false) {
				live.callChildMutationCallback(text.parentNode);
			}
		},
		// A text node placeholder
		text = el.ownerDocument.createTextNode(''),
		// The current list.
		list,
		// Called when the list is replaced with a new list or the binding is torn-down.
		teardownList = function (fullTeardown) {
			// there might be no list right away, and the list might be a plain
			// array
			if (list && list.removeEventListener) {
				list.removeEventListener('add', add);
				list.removeEventListener('set', set);
				list.removeEventListener('remove', remove);
				list.removeEventListener('move', move);
			}
			// use remove to clean stuff up for us
			remove({callChildMutationCallback: !!fullTeardown}, {
				length: masterNodeList.length - 1
			}, 0, true, fullTeardown);
		},
		// Called when the list is replaced or setup.
		updateList = function (ev, newList, oldList) {

			if(isTornDown) {
				return;
			}

			afterPreviousEvents = true;
			if(newList && oldList) {
				list = newList || [];
				var patches = diff(oldList, newList);

				if ( oldList.removeEventListener ) {
					oldList.removeEventListener('add', add);
					oldList.removeEventListener('set', set);
					oldList.removeEventListener('remove', remove);
					oldList.removeEventListener('move', move);
				}
				for(var i = 0, patchLen = patches.length; i < patchLen; i++) {
					var patch = patches[i];
					if(patch.deleteCount) {
						remove({callChildMutationCallback: false}, {
							length: patch.deleteCount
						}, patch.index, true);
					}
					if(patch.insert.length) {
						add({callChildMutationCallback: false}, patch.insert, patch.index);
					}
				}
			} else {
				if(oldList) {
					teardownList();
				}
				list = newList || [];
				add({callChildMutationCallback: false}, list, 0);
				addFalseyIfEmpty(list, falseyRender, masterNodeList, nodeList);
			}
			live.callChildMutationCallback(text.parentNode);

			afterPreviousEvents = false;
			// list might be a plain array
			if (list.addEventListener) {
				list.addEventListener('add', add);
				list.addEventListener('set', set);
				list.addEventListener('remove', remove);
				list.addEventListener('move', move);
			}

			canBatch.afterPreviousEvents(function(){
				afterPreviousEvents = true;
			});
		};

	parentNode = live.getParentNode(el, parentNode);
	// Setup binding and teardown to add and remove events
	var data = live.setup(parentNode, function () {
		// TODO: for stache, binding on the compute is not necessary.
		if (isFunction(compute)) {
			compute.addEventListener('change', updateList);
		}
	}, function () {
		if (isFunction(compute)) {
			compute.removeEventListener('change', updateList);
		}
		teardownList(true);
	});

	if(!nodeList) {
		live.replace(masterNodeList, text, data.teardownCheck);
	} else {
		nodeLists.replace(masterNodeList, text);
		nodeLists.update(masterNodeList, [text]);
		nodeList.unregistered = function(){
			data.teardownCheck();
			isTornDown = true;
		};
	}
	// run the list setup
	updateList({}, isFunction(compute) ? compute() : compute);
};
