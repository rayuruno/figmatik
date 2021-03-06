import * as units from "../units.js";
import { parsePaints } from "../properties/paint.js";

export function flexDirection(node: NodeApi<FrameNode>) {
  const LAYOUT_MODE: any = {
    HORIZONTAL: "row",
    VERTICAL: "column",
  };
  return node.layoutMode ? LAYOUT_MODE[node.layoutMode] : undefined;
}

export function justifyContent(node: NodeApi<FrameNode>) {
  const ALIGN_ITEMS: any = {
    MIN: "flex-start",
    CENTER: "center",
    MAX: "flex-end",
    SPACE_BETWEEN: "space-between",
  };
  let k =
    node.layoutMode === "HORIZONTAL"
      ? node.primaryAxisAlignItems
      : node.counterAxisAlignItems;
  return k ? ALIGN_ITEMS[k] : "flex-start";
}

export function alignItems(node: NodeApi<FrameNode>) {
  const ALIGN_ITEMS: any = {
    MIN: "flex-start",
    CENTER: "center",
    MAX: "flex-end",
  };
  let k =
    node.layoutMode === "VERTICAL"
      ? node.counterAxisAlignItems
      : node.primaryAxisAlignItems;
  return k ? ALIGN_ITEMS[k] : "flex-start";
}

export function padding(node: NodeApi<FrameNode>, unit = units.DEFAULT_UNIT) {
  if (!node.paddingTop) return;

  let values = [
    paddingTop(node, unit),
    paddingRight(node, unit),
    paddingBottom(node, unit),
    paddingLeft(node, unit),
  ];

  if (values[0] === values[2] && values[1] === values[3]) {
    values = [values[0], values[1]];
  }
  if (values[0] === values[1]) {
    return values[0];
  }
  return values.join(" ");
}

export function paddingTop(
  node: NodeApi<FrameNode>,
  unit = units.DEFAULT_UNIT
) {
  return (units as any)[unit](node.paddingTop);
}

export function paddingRight(
  node: NodeApi<FrameNode>,
  unit = units.DEFAULT_UNIT
) {
  return (units as any)[unit](node.paddingRight);
}

export function paddingBottom(
  node: NodeApi<FrameNode>,
  unit = units.DEFAULT_UNIT
) {
  return (units as any)[unit](node.paddingBottom);
}

export function paddingLeft(
  node: NodeApi<FrameNode>,
  unit = units.DEFAULT_UNIT
) {
  return (units as any)[unit](node.paddingLeft);
}

export function gap(node: NodeApi<FrameNode>, unit = units.DEFAULT_UNIT) {
  return (units as any)[unit](node.itemSpacing);
}

export function overflow(node: NodeApi<FrameNode>) {
  if (node.clipsContent) return "hidden";
}

export function contain(node: NodeApi<FrameNode>) {
  if (node.clipsContent) return "content";
}

export function verticalAlign(node: NodeApi<FrameNode>) {
  switch (node.constraints?.vertical) {
    case "BOTTOM":
      return "bottom";
    case "CENTER":
      return "middle";
  }
}

export function background(node: NodeApi<FrameNode>) {
  if (node.fills?.length === 1) return;
  return parsePaints(node.fills);
}

export function backgroundColor(node: NodeApi<FrameNode>) {
  if (node.fills?.length !== 1) return;
  return parsePaints(node.fills);
}
