"format cjs";

require("main.css");

var btn = document.getElementById('test-element');
var links = document.getElementsByTagName('link');

if (typeof window !== "undefined" && window.QUnit) {

	QUnit.equal(links.length, 1, "css file is loaded and appended on the document");
	QUnit.equal(getComputedStyle(btn).backgroundColor, 'rgb(255, 0, 0)', 'css applied');

	QUnit.equal(steal.System.cssOptions.timeout, '15', 'css timeout has been defined in config');

	QUnit.start();
	removeMyself();
}else{
	console.log(getComputedStyle(btn));
}
