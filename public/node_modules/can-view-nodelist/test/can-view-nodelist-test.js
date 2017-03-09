var nodeLists = require('can-view-nodelist');

var fragment = require('can-util/dom/fragment/fragment');
var makeArray = require('can-util/js/make-array/make-array');
var frag = require('can-util/dom/frag/frag');

var QUnit = require('steal-qunit');

QUnit.module('can-view-nodelist');

test('unregisters child nodeLists', function () {
	expect(3);
	// two spans that might have been created by #each
	var spansFrag = fragment("<span>1</span><span>2</span>");
	var spansList = makeArray(spansFrag.childNodes);

	nodeLists.register(spansList, function(){
		ok(true,"unregistered spansList");
	});


	// A label that might have been created by #foo
	var labelFrag = fragment("<label>l</label>");
	var labelList = makeArray(labelFrag.childNodes);

	nodeLists.register( labelList, function(){
		ok(true,"unregistered labelList");
	});

	// the html inside #if}
	var ifPreHookupFrag = frag(["~","","-",""]),
		ifChildNodes = ifPreHookupFrag.childNodes,
		ifEls = makeArray(ifChildNodes);

    
	nodeLists.replace([ifChildNodes[1]], spansFrag);

	// 4 because 2 elements are inserted, and ifChildNodes is live
	nodeLists.replace([ifChildNodes[4]], labelFrag);

	var ifList = makeArray(ifPreHookupFrag.childNodes);

	nodeLists.register(ifList, function(){
		ok(true,"unregistered ifList");
	});

	deepEqual(ifList,[
		ifEls[0],
		spansList,
		ifEls[2],
		labelList
	]);


	nodeLists.update(ifList, [document.createTextNode("empty")]);

});
