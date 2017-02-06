@parent bitcentive
@module {can.Component} bitcentive/components/model-edit-property <model-edit-property>

This component takes a model and a property name.
The property value is initially displayed as hypertext.
If clicked, the property value is placed in a text field for editing.
The new value is saved on enter.
The user can discard uncommitted changes with the escape key.

@signature `<model-edit-property {model}="contributor" property="name" />`

@body

## Use

```
<can-import from="bitcentive/components/model-edit-property/" />
<model-edit-property {model}="contributor" property="name" />
```
