import * as units from "../units.js";
import { parsePaints } from "../properties/paint.js";

export function border(node: NodeApi<FrameNode>, unit = units.DEFAULT_UNIT) {
  if (!borderColor(node)) return;
  return [borderWidth(node, unit), borderStyle(node), borderColor(node)].join(
    " "
  );
}

export function borderWidth(
  node: NodeApi<FrameNode>,
  unit = units.DEFAULT_UNIT
) {
  if (!borderColor(node)) return;
  return (units as any)[unit](node.strokeWeight);
}

export function borderStyle(node: NodeApi<FrameNode>) {
  if (!borderColor(node)) return;
  if ((node as any).strokeDashes?.length) return "dashed";
  return "solid";
}

export function borderColor(node: NodeApi<FrameNode>) {
  return parsePaints(node.strokes);
}
