const render = {};

const renderChildren = (node) => node.children?.map(render.NODE).join("\n");

render.GROUP = (node) =>
  `<span style="${render.CSS(node.styleMap)}">${renderChildren(node)}</span>`;

render.HTML = (nodes) => nodes.map(render.NODE).flat().join("\n");

render.TEXT = (node) =>
  `<div style="${render.CSS(
    omit(node.styleMap, ...(!node.parent.styleMap.position ? ["position"] : []))
  )}">${renderChildren(node)}</div>`;

render.FRAME = (node) =>
  `<div style="${render.CSS(
    omit(
      node.styleMap,
      ...(node.parent.type === "CANVAS"
        ? ["top", "left", "right", "bottom"]
        : [])
    )
  )}">${renderChildren(node)}</div>`;

render.NODE = (node) => render[node.type]?.(node) || renderChildren(node);

render.LINE = (node) =>
  `<div style="${render.CSS(node.styleMap)}">${renderChildren(node)}</div>`;

render.LINE_BREAK = (_node) => `<br/>`;

render.LINK = (node) =>
  `<a href="${node.style.hyperlink.url}">${node.characters}</a>`;

render.UNORDERED_LIST = (node) => `<ul>${renderChildren(node)}</ul>`;

render.ORDERED_LIST = (node) => `<ol>${renderChildren(node)}</ol>`;

render.LIST_ITEM = (node) => `<li>${renderChildren(node)}</li>`;

render.RECTANGLE = (node) =>
  `<svg style="${render.CSS(node.styleMap)}"><rect style="${render.CSS(
    node.styleMap
  )}"></rect></svg>`;

render.TXT = (node) => node.characters;

render.ORDERED_LIST_ITEM = render.LIST_ITEM;

render.UNORDERED_LIST_ITEM = render.LIST_ITEM;

render.CSS = (style = {}) =>
  Object.entries(style)
    .map(([k, v]) => `${kebab(k)}: ${v};`)
    .join("");

function kebab(str = "") {
  return str
    .trim()
    .replace(/(([A-Z0-9])([A-Z0-9][a-z]))|(([a-z])([A-Z]))|\W|\s/g, "$2$5-$3$6")
    .toLowerCase()
    .replaceAll(/_/g, "-")
    .replaceAll(/-+/g, "-")
    .replaceAll(/^-|-$/g, "");
}

function omit(obj, ...keys) {
  keys.forEach((k) => delete obj[k]);
  return obj;
}

export default render;
