var assign = require('can-util/js/assign/assign');
var canData = require('can-util/dom/data/data');
var importer = require('can-util/js/import/import');

var nodeLists = require('can-view-nodelist');
var tag = require('can-view-callbacks').tag;
var events = require('can-event');
var canLog = require("can-util/js/log/log");

tag("can-import", function(el, tagData){
	var moduleName = el.getAttribute("from");
	// If the module is part of the helpers pass that into can.import
	// as the parentName
	var templateModule = tagData.options.get("helpers.module");
	var parentName = templateModule ? templateModule.id : undefined;

	if(!moduleName) {
		return Promise.reject("No module name provided");
	}

	var importPromise = importer(moduleName, parentName);
	importPromise.catch(function(err) {
		canLog.error(err);
	});

	// Set the viewModel to the promise
	canData.set.call(el, "viewModel", importPromise);
	canData.set.call(el, "scope", importPromise);

	// Set the scope
	var scope = tagData.scope.add(importPromise);

	// If there is a can-tag present we will hand-off rendering to that tag.
	var handOffTag = el.getAttribute("can-tag");
	if(handOffTag) {
		var callback = tag(handOffTag);
		canData.set.call(el,"preventDataBindings", true);
		callback(el, assign(tagData, {
			scope: scope
		}));
		canData.set.call(el,"preventDataBindings", false);

		canData.set.call(el, "viewModel", importPromise);
		canData.set.call(el, "scope", importPromise);
	}
	// Render the subtemplate and register nodeLists
	else {
		var frag = tagData.subtemplate ?
			tagData.subtemplate(scope, tagData.options) :
			document.createDocumentFragment();

		var nodeList = nodeLists.register([], undefined, true);
		events.one.call(el, "removed", function(){
			nodeLists.unregister(nodeList);
		});

		el.appendChild(frag);
		nodeLists.update(nodeList, el.childNodes);
	}
});
