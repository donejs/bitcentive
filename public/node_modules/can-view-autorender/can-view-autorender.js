var canViewModel = require('can-view-model');
var camelize = require('can-util/js/string/string').camelize;
var each = require('can-util/js/each/each');
var importer = require('can-util/js/import/import');
var events = require('can-event');
var namespace = require('can-util/namespace');

var ignoreAttributesRegExp = /^(dataViewId|class|id|type|src)$/i;

var typeMatch = /\s*text\/(stache)\s*/;
function isIn(element, type) {
	while(element.parentNode) {
		element = element.parentNode;
		if(element.nodeName.toLowerCase() === type.toLowerCase()) {
			return true;
		}
	}
}
function setAttr(el, attr, scope){
	var camelized = camelize(attr);
	if (!ignoreAttributesRegExp.test(camelized) ) {
		var value = el.getAttribute(attr);
		if(scope.attr) {
			scope.attr(camelized, value);
		} else if(scope.set) {
			scope.set(camelized, value);
		} else {
			scope[camelized] = value;
		}
	}
}
function insertAfter(ref, element) {
	if(ref.nextSibling){
		ref.parentNode.insertBefore(element, ref.nextSibling);
	} else {
		ref.parentNode.appendChild(element);
	}
}

function render(renderer, scope, el) {
	var frag = renderer(scope);
	if( isIn(el,"head") ) {
		document.body.appendChild(frag);
	} else if(el.nodeName.toLowerCase() === "script") {
		insertAfter(el, frag);
	} else {
		insertAfter(el, frag);
		el.parentNode.removeChild(el);
	}
}
function setupScope(el) {
	var scope = canViewModel(el);

	each(el.attributes || [], function(attr) {
		setAttr(el, attr.name, scope);
	});

	events.on.call(el, "attributes", function (ev) {
		setAttr(el, ev.attributeName, scope);
	});

	return scope;
}

var promise = new Promise(function(resolve, reject) {
	function autoload(){
		var promises = [];

		each( document.querySelectorAll("[can-autorender]"), function( el, i){
			el.style.display = "none";

			var text = el.innerHTML || el.text,
				typeAttr = el.getAttribute("type"),
				typeInfo = typeAttr.match( typeMatch ),
				type = typeInfo && typeInfo[1],
				typeModule = "can-" + type;

			promises.push(importer(typeModule).then(function(engine){
				if(engine.async) {
					return engine.async(text).then(function(renderer){
						render(renderer, setupScope(el), el);
					});
				} else {
					var renderer = engine(text);
					render(renderer, setupScope(el), el);
				}
			}));

		});

		Promise.all(promises).then(resolve, reject);
	}

	if (document.readyState === 'complete') {
		autoload();
	} else {
		events.on.call(window, 'load', autoload);
	}
});

module.exports = namespace.autorender = function autorender(success, error){
	return promise.then(success, error);
};
