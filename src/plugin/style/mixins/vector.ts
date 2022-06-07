import { parsePaints } from "../properties/paint.js";

export function stroke(node: NodeApi<VectorNode>) {
  return parsePaints(node.strokes);
}

export function fill(node: NodeApi<VectorNode>) {
  return parsePaints(node.fills);
}
