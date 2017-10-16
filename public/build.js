var path = require("path");
var stealTools = require("steal-tools");

stealTools.optimize({
  config: path.join(__dirname, "package.json!npm")
}, {
	bundleAssets: false,
	//minify: true
});
