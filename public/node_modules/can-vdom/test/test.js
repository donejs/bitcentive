var assert = require("assert");
var isNode = typeof process !== "undefined" && {}.toString.call(process) === "[object process]";
var makeDocument = require("../make-document/make-document");

var childNodes = require("can-util/dom/child-nodes/child-nodes");

if(!isNode) {
	require("steal-mocha");
}


describe("makeDocument", function(){
	it("is able to parse html", function(){
		var document = makeDocument();
		document.body.innerHTML = "<div></div><span></span>";
		assert.equal(childNodes(document.body).length, 2, "two children");
	});
});

if(isNode) {
	var nodeRequire = require;

	describe("can-vdom", function(){
		nodeRequire("../can-vdom");

		it("creates a global window", function(){
			[
				"window",
				"navigator",
				"location",
				"history"
			].forEach(assertExists);

			function assertExists(prop){
				assert.ok(global[prop], prop + " now exists");
			}
		});

		it("contains normal globals like setTimeout", function(){
			assert.equal(typeof window.setTimeout, "function", "setTimeout included");
			assert.equal(typeof window.Math, "object", "Math included");
		});
	});
}
