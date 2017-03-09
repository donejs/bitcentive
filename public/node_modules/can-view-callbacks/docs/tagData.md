@typedef {Object} can-view-callbacks.tagData tagData
@parent can-view-callbacks/types

The data passed to [can-view-callbacks.tag].

@type {Object}

  @option {can-stache.renderer} [subtemplate] If the special tag has content,
  the content can be rendered with subtemplate.  For example:

  ```js
  callbacks.tag("foo-bar", function(el, tagData){
    var frag = tagData.subtemplate(tagData.scope, tagData.options);
    $(el).html(frag);
  });
  ```

  @option {can-view-scope} scope The scope of the element.  

  @option {can-view-scope.Options} options The mustache helpers and other non-data values passed to the template.
