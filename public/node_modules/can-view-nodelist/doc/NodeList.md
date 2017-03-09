@typedef {Array} can-view-nodelist/types/NodeList NodeList
@parent can-view-nodelist/types

A collection of nodes being managed by a part of a live-bound template and
references to other collections.

@type {Array}

  A `NodeList` is an array of nodes that a part of a live-bound template manages.  For
  example `{{name}}` might manage a single text node while something
  like `{{#each todos}}{{name}}{{/each}}` might manage multiple nodes and other child.

  NodeLists are primarily used to teardown live binding.  When a "parent" section of a template
  is updated, every sub-section needs to be torn down.  NodeLists provide this structure.

  __NOTE: The structure of a NodeList is purposefully not documented as it's subject to change.__
