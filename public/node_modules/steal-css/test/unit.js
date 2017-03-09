var helpers = require("./helpers");
var QUnit = require("steal-qunit");

QUnit.module("SSR", {
	setup: function(){

	}
});

// Skipping this for now as I can't find a good way to mock the global document
QUnit.skip("Throws if there is not a document", function(assert){
	var done = assert.async();

	var loader = helpers.clone()
		.rootPackage({
			name: "app",
			version: "1.0.0",
			main: "main.js"
		})
		.allowFetch("app@1.0.0#app.css!steal-css")
		.loader;

	loader.env = "production";

	loader["import"]("app/app.css!steal-css")
	.then(function(){
		console.log('here');
		QUnit.ok(false, "This should have failed");
	}, function(err){
		console.log('erro', err, err.stack);
	})
	.then(done, done);
});
