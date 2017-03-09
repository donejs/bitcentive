var QUnit = require('steal-qunit');

var makeIframe = function(src){
	var iframe = document.createElement('iframe');
	window.removeMyself = function(){
		delete window.removeMyself;
		delete window.isReady;
		delete window.hasError;
		document.body.removeChild(iframe);
		start();
	};
	window.hasError = function(error) {
		ok(false, error.message || error);
		window.removeMyself();
	};
	document.body.appendChild(iframe);
	iframe.src = src;
};

var get = function(map, prop) {
	return map.attr ? map.attr(prop) : map.get(prop);
};

var makeBasicTestIframe = function(src){
	var iframe = document.createElement('iframe');
	window.removeMyself = function(){
		delete window.removeMyself;
		delete window.isReady;
		delete window.hasError;
		document.body.removeChild(iframe);
		start();
	};
	window.hasError = function(error) {
		ok(false, error.message || error);
		window.removeMyself();
	};
	window.isReady = function(el, scope) {
		equal(el.length, 1, "only one my-component");
		equal(el[0].innerHTML, "Hello World","template rendered");

		equal(get(scope, "message"), "Hello World", "Scope correctly setup");
		window.removeMyself();
	};
	document.body.appendChild(iframe);
	iframe.src = src;
};

QUnit.module("can-view-autorender");

if (__dirname !== '/') {
	QUnit.asyncTest("the basics are able to work for steal", function(){
		makeBasicTestIframe(__dirname + "/test/basics.html?" + Math.random());
	});

	QUnit.asyncTest("autoload loads a jquery viewmodel fn", function(){
		makeIframe(__dirname + "/test/steal-viewmodel.html?" + Math.random());
	});

	QUnit.asyncTest("works with a can-define/map/map", function(){
		makeBasicTestIframe(__dirname + "/test/define.html?" + Math.random());
	});
}
