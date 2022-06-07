# figmatik

low level toolkit to work with figma rest api.

## simple example

collects all component nodes which has name starting with "Icons/"

```js
import figmatik from "figmatik";

const fig = figmatik(/* config: {token,cache,plugins} */);

const file = await fig.files("ZsaaakKEgys8zPMBaUbFz3");

const iconNodes = fig.findAll(
  file.document,
  (node) => node.type === "COMPONENT" && node.name.startsWith("Icons/")
);
```

## plugins

figmatik comes with few built in plugins

### export

enables figma exports as in the app itself

```js
const nodes = getSomeNodes();
const exportSettings = [
  { format: "png", scale: 1, suffix: "@1x" },
  { format: "png", scale: 2, suffix: "@2x" },
];
const images = await fig.plugin.export(nodes, exportSettings);
images[0].buffer instanceof Buffer; // true
images[0].node === nodes[0]; // true
```

### selector

enables dom selector api (css selectors) to query nodes

```js
fig.plugin.querySelectorAll(file.document, ".component[name^=icons]");

// above is equivalent of

fig.node.findAll(
  file.document,
  (node) => node.type === "COMPONENT" && node.name.startsWith("Icons/")
);
```

### text

transforms text node into ast

```js
const textNode = {
  characters: "Hello World.\nItem1\nEnd",

  characterStyleOverrides: [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
  ],

  styleOverrideTable: {
    1: {
      hyperlink: { type: "URL", url: "http://example.com" },
      /* rest of the props */
    },
  },

  lineTypes: ["NONE", "UNORDERED", "NONE"],
  /* rest of the props */
};

const text = fig.plugin.text(textNode);

text === {
  /* copy of textNode */

  children: [
    {
      type: "TEXT",
      textContent: "Hello World.",
    },
    {
      type: "UNORDERED_LIST",
      children: [
        {
          type: "LIST_ITEM",
          children: [
            {
              type: "LINK",
              textContent: "Item1",
              attrs: { url: "http://example.com" },
            },
          ],
        },
      ],
    },
    {
      type: "TEXT",
      textContent: "End",
    },
  ];
}
```

### style

transform figma node properties into ast compatible with css and react native

```js
const style = fig.plugin.style(node);
style.backgroundColor === "rgba(0,0,0,1)";
```
