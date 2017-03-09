var QUnit = require("steal-qunit");

QUnit.module("steal-css plugin");

var makeIframe = function(src){
	var iframe = document.createElement('iframe');
	window.removeMyself = function(){
		delete window.removeMyself;
		document.body.removeChild(iframe);
	};
	document.body.appendChild(iframe);
	iframe.src = src;
};

asyncTest("wait for css until it is loaded", function(){
	makeIframe("css-before-js/prod.html");
});

asyncTest("url paths in css works", function(){
	makeIframe("css_paths/dev.html");
});

asyncTest("url paths in production works", function(){
	makeIframe("css_paths/prod.html");
});

asyncTest("css instantiated hack", function(){
	makeIframe("css-instantiated/prod.html");
});

asyncTest("steal-css is mapped as $css", function(){
	makeIframe("dollar-css/dev.html");
});

require("./unit");
