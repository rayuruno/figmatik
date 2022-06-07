import * as units from "../units.js";
import { isNumber } from "../../../util.js";

export function position(node: NodeApi<FrameNode | VectorNode | TextNode>) {
  if (node?.layoutAlign) return;
  if (node?.isFixed) return "fixed";
  if (node?.parent?.type === "CANVAS") return "relative";
  if ((node?.parent as any)?.layoutMode) return;
  return "absolute";
}

export function flex(
  node: NodeApi<FrameNode | VectorNode | TextNode>
): string | undefined {
  if (node?.layoutAlign === "INHERIT") {
    return flex(node.parent as NodeApi<FrameNode | VectorNode | TextNode>);
  }
  if (node?.layoutAlign === "STRETCH" || (node as VectorNode)?.layoutGrow) {
    return "auto";
  }
}

export function flexGrow(node: NodeApi<FrameNode | VectorNode | TextNode>) {
  return (node as VectorNode)?.layoutGrow;
}

export function width(
  node: NodeApi<FrameNode | VectorNode | TextNode>,
  unit = units.DEFAULT_UNIT
) {
  return (units as any)[unit](node.absoluteBoundingBox?.width || undefined);
}

export function height(
  node: NodeApi<FrameNode | VectorNode | TextNode>,
  unit = units.DEFAULT_UNIT
) {
  return (units as any)[unit](node.absoluteBoundingBox?.height || undefined);
}

export function left(
  node: NodeApi<FrameNode | VectorNode | TextNode>,
  unit = units.DEFAULT_UNIT
) {
  return (units as any)[unit](
    node.relativeTransform
      ? node.relativeTransform[0][2]
      : node.absoluteBoundingBox?.x
  );
}

export function top(
  node: NodeApi<FrameNode | VectorNode | TextNode>,
  unit = units.DEFAULT_UNIT
) {
  return (units as any)[unit](
    node.relativeTransform
      ? node.relativeTransform[1][2]
      : node.absoluteBoundingBox?.y
  );
}

export function right(
  node: NodeApi<FrameNode | VectorNode | TextNode>,
  unit = units.DEFAULT_UNIT
) {
  if (!node.parent) return;
  const pw = width(node.parent as any, "unitless");
  const nl = left(node, "unitless");
  const nw = width(node, "unitless");
  if (!isNumber(pw) || !isNumber(nl) || !isNumber(nw)) return;
  return (units as any)[unit](pw - nl - nw);
}

export function bottom(
  node: NodeApi<FrameNode | VectorNode | TextNode>,
  unit = units.DEFAULT_UNIT
) {
  if (!node.parent) return;
  const ph = height(node.parent as any, "unitless");
  const nt = top(node, "unitless");
  const nh = height(node, "unitless");
  if (!isNumber(ph) || !isNumber(nt) || !isNumber(nh)) return;
  return (units as any)[unit](ph - nt - nh);
}
