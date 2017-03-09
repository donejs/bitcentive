"use strict";
var domData = require('can-util/dom/data/data');
var SimpleMap = require('can-simple-map');
var types = require("can-types");
var ns = require("can-namespace");
var getDocument = require("can-util/dom/document/document");

module.exports = ns.viewModel = function (el, attr, val) {
	el = typeof el === 'string' ? getDocument().querySelector(el) : el;

	var scope = domData.get.call(el, "viewModel");
	if(!scope) {
		scope = types.DefaultMap ? new types.DefaultMap() : new SimpleMap();
		domData.set.call(el, "viewModel", scope);
	}
	switch (arguments.length) {
		case 0:
		case 1:
			return scope;
		case 2:
			return "attr" in scope ? scope.attr(attr) : scope[attr];
		default:
			if("attr" in scope) {
				scope.attr(attr, val);
			} else {
				scope[attr] = val;
			}
			return el;
	}
};
