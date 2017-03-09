var types = require("can-types");
var SimpleMap = require("can-simple-map");

// this is a very simple can-map like object
var ReferenceMap = SimpleMap.extend({});

var oldIsMapLike = types.isMapLike;
types.isMapLike = function(obj) {
	if(obj instanceof ReferenceMap) {
		return true;
	}
	return oldIsMapLike.call(this, obj);
};

module.exports = ReferenceMap;
