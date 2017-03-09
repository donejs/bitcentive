@module {{}} can-view-nodelist
@parent can-infrastructure
@group can-view-nodelist/methods methods
@group can-view-nodelist/types types
@package ./package.json

@description Adds nesting of text nodes

`can.view.nodeLists` are used to make sure "directly nested" live-binding
sections update content correctly.

Consider the following template:

```html
<div>
{{#if items.length}}
    Items:
        {{#items}}
            <label></label>
        {{/items}}
{{/if}}
</div>
```

The `{{#if}}` and `{{#items}}` seconds are "directly nested" because
they share the same `<div>` parent element.

If `{{#items}}` changes the DOM by adding more `<labels>`,
`{{#if}}` needs to know about the `<labels>` to remove them
if `{{#if}}` is re-rendered.  `{{#if}}` would be re-rendered, for example, if
all items were removed.
