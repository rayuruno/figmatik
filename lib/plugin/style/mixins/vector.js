import { parsePaints } from "../properties/paint.js";
export function stroke(node) {
    return parsePaints(node.strokes);
}
export function fill(node) {
    return parsePaints(node.fills);
}
