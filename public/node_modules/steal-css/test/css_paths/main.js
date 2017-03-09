import "./folder/main.css";
import helpers from 'helpers';
import steal from "@steal";

var testImage = function(selector, cb){
	var image = new Image();
	image.onload = function(){
		cb();
	};
	image.onerror = function(){
		cb(selector);
		QUnit.ok(false, "image not loaded");
		QUnit.start();
		removeMyself();
	};
	image.src = $(selector).css("background-image").replace(/url\("?/,"").replace(/"?\)/,"");
};


if(steal.isEnv('production')) {
	if (typeof window !== "undefined" && window.QUnit) {

		var btn = $('.btn.btn-danger');
		QUnit.equal(btn.css('display'), 'inline-block', '@import "locate://"; styles applied');
		QUnit.equal(btn.css('backgroundColor'), 'rgb(255, 0, 0)', '@import url("locate://"); styles applied');

		testImage("#test-element", function(err){
			if(err){
				QUnit.ok(false, err);
				QUnit.start();
				removeMyself();
			} else {
				QUnit.ok(true, "background-image: url(../); styles applied");
				testImage("#test-relative", function(err){
					if(err){
						QUnit.ok(false, err);
					} else {
						QUnit.ok(true, "background-image: url(locate://); styles applied");
					}
					QUnit.start();
					removeMyself();
				});
			}
		});
	} else {
		console.log("background-image", $("#test-element").css("background-image"));
		console.log("tilde", $("#test-relative").css("background-image"));
	}

	// develop
} else {
	// Wait for the @import's to resolve in the <style>
	// tag added by the main.css! import
	helpers.waitForCssRules($('style')[0], function () {

		if (typeof window !== "undefined" && window.QUnit) {

			var btn = $('.btn.btn-danger');
			QUnit.equal(btn.css('display'), 'inline-block', '@import "locate://"; styles applied');
			QUnit.equal(btn.css('backgroundColor'), 'rgb(255, 0, 0)', '@import url("locate://"); styles applied');

			testImage("#test-element", function(err){
				if(err){
					QUnit.ok(false, err);
					QUnit.start();
					removeMyself();
				} else {
					QUnit.ok(true, "background-image: url(../); styles applied");
					testImage("#test-relative", function(err){
						if(err){
							QUnit.ok(false, err);
						} else {
							QUnit.ok(true, "background-image: url(locate://); styles applied");
						}
						QUnit.start();
						removeMyself();
					});
				}
			});
		} else {
			console.log("background-image", $("#test-element").css("background-image"));
			console.log("tilde", $("#test-relative").css("background-image"));
		}
	});
}
