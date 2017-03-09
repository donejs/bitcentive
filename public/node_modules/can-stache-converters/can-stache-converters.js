var stache = require("can-stache");
var stringToAny = require("can-util/js/string-to-any/string-to-any");
require("can-stache-bindings");

stache.registerConverter("boolean-to-inList", {
	get: function(item, list){
		if(!list) {
			return false;
		} else {
			return list.indexOf(item) !== -1;
		}
	},

	set: function(newVal, item, list){
		if(!list) {
			return;
		}
		if(!newVal) {
			var idx = list.indexOf(item);
			if(idx !== -1) {
				list.splice(idx, 1);
			}
		} else {
			list.push(item);
		}
	}
});

stache.registerConverter("string-to-any", {
	get: function(compute){
		return "" + compute();
	},
	set: function(newVal, compute){
		var converted = stringToAny(newVal);
		compute(converted);
	}
});

stache.registerConverter("not", {
	get: function(compute){
		return !compute();
	},
	set: function(newVal, compute){
		compute(!newVal);
	}
});

stache.registerConverter("index-to-selected", {
	get: function(item, list){
		var val = item.isComputed ? item() : item;
		var idx = list.indexOf(val);
		return idx;
	},
	set: function(idx, item, list){
		var newVal = list[idx];
		if(newVal !== -1 && item.isComputed) {
			item(newVal);
		}
	}
});

stache.registerConverter("either-or", {
	get: function(chosen, a, b){
		return b !== chosen();
	},
	set: function(newVal, chosen, a, b){
		chosen(newVal ? a : b);
	}
});

stache.registerConverter("equal", {
	get: function(compute, comparer){
		var val = (compute && compute.isComputed) ? compute() : compute;
		return val === comparer;
	},
	set: function(b, compute, comparer){
		if(b) {
			compute(comparer);
		}
	}
});
