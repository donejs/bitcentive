require("./main.css!$css");

var btn = document.querySelector(".btn");
var s = getComputedStyle(btn);

if(typeof window !== "undefined" && window.QUnit) {
	QUnit.equal(s.backgroundColor, 'rgb(0, 128, 0)');

	QUnit.start();
	removeMyself();
} else {
	console.log(s.backgroundColor);
}
