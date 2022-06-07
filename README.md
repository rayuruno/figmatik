# figmatik

low level toolkit to **hack** figma rest api.

see examples directory for some ideas.

[https://rayuruno.github.io/figmatik/](docs)

## simple example

collects all component nodes which has name starting with "Icons/"

```js
import figmatik from "figmatik";

const figma = figmatik(/* config: {token,cache,plugins} */);

const file = await figma.files("ZsaaakKEgys8zPMBaUbFz3");

const iconNodes = figma.findAll(
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
const images = await figma.export(nodes, exportSettings);
images[0].buffer instanceof Buffer; // true
images[0].node === nodes[0]; // true
```

### selector

enables dom selector api (css selectors) to query nodes

```js
figma.querySelectorAll(file.document, ".component[name^=icons]");
figma.querySelector(file.document, ".component[name^=icons]");

// or
file.document.querySelectorAll(".component[name^=icons]");
file.document.querySelector(".component[name^=icons]");

// or
file.document.$$(".component[name^=icons]");
file.document.$(".component[name^=icons]");

// above are equivalent of
figma.node.findAll(
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

textNode.children === {
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
node.styleMap.backgroundColor === "rgba(0,0,0,1)";
```
