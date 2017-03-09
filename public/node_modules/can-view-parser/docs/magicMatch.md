@property {RegExp} can-view-parser.ParseHandler.magicMatch magicMatch
@parent can-view-parser.ParseHandler

@option {RegExp}

A regular expression that matches from the start of the magic tag to the end of the
magic tag.  It should also have the first capture group match the content within the
magic tag.  

```js
parser(" ... content ....", {
	...
	magicStart: "{",
	magicMatch:  /\{([^\}]*)\}/g
});
```
