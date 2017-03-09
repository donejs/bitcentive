"format cjs";

require("main.css");

var btn = document.getElementById('test-element');
var links = document.getElementsByTagName('link');

if (typeof window !== "undefined" && window.QUnit) {

	QUnit.notEqual(links.length, 2, "not append the same stylesheet again");
	QUnit.equal(getComputedStyle(btn).backgroundColor, 'rgb(255, 0, 0)', 'css applied');

	QUnit.start();
	removeMyself();
}else{
	console.log(getComputedStyle(btn));
}
