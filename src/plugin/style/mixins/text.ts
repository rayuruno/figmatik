import * as units from "../units.js";
import { parsePaints } from "../properties/paint.js";

export function fontStyle(node: NodeApi<TextNode>) {
  if (node.style?.italic) return "italic";
}

export function fontWeight(node: NodeApi<TextNode>) {
  return node.style?.fontWeight;
}

export function fontSize(node: NodeApi<TextNode>, unit = units.DEFAULT_UNIT) {
  return (units as any)[unit](node.style?.fontSize);
}

export function fontFamily(node: NodeApi<TextNode>) {
  return node.style?.fontFamily;
}

export function lineHeight(node: NodeApi<TextNode>, unit = units.DEFAULT_UNIT) {
  return (units as any)[unit](node.style?.lineHeightPx);
}

export function textDecoration(node: NodeApi<TextNode>) {
  const TEXT_DECORATION = {
    STRIKETHROUGH: "line-through",
    UNDERLINE: "underline",
  };
  return node.style?.textDecoration
    ? TEXT_DECORATION[node.style?.textDecoration]
    : undefined;
}

export function textAlign(node: NodeApi<TextNode>) {
  const TEXT_ALIGN_HORIZONTAL = {
    LEFT: "left",
    CENTER: "center",
    RIGHT: "right",
    JUSTIFIED: "justified",
  };
  return TEXT_ALIGN_HORIZONTAL[node.style?.textAlignHorizontal];
}

export function verticalAlign(node: NodeApi<TextNode>) {
  const TEXT_ALIGN_VERTICAL = {
    TOP: "top",
    CENTER: "middle",
    BOTTOM: "bottom",
  };
  return TEXT_ALIGN_VERTICAL[node.style?.textAlignVertical];
}

export function letterSpacing(
  node: NodeApi<TextNode>,
  unit = units.DEFAULT_UNIT
) {
  return (units as any)[unit](node.style?.letterSpacing);
}

export function textTransform(node: NodeApi<TextNode>) {
  const TEXT_CASE = {
    UPPER: "uppercase",
    LOWER: "lowercase",
    TITLE: "cappitalize",
    SMALL_CAPS: "lowercase",
    SMALL_CAPS_FORCED: "lowercase",
  };
  return node.style?.textCase ? TEXT_CASE[node.style?.textCase] : undefined;
}

export function textIndent(node: NodeApi<TextNode>, unit = units.DEFAULT_UNIT) {
  return (units as any)[unit](node.style?.paragraphIndent);
}

export function whiteSpace(node: NodeApi<TextNode>) {
  if (node.style?.textAutoResize && node.style?.textAutoResize === "WIDTH")
    return "nowrap";
}

export function wordBreak(node: NodeApi<TextNode>) {
  if (node.style?.textAutoResize === "HEIGHT") return "break-word";
}

export function color(node: NodeApi<TextNode>) {
  return parsePaints(node?.fills);
}
