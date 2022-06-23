import * as units from "../units.js";
import { parsePaints } from "../properties/paint.js";
export function border(node, unit = units.DEFAULT_UNIT) {
    if (!borderColor(node))
        return;
    return [borderWidth(node, unit), borderStyle(node), borderColor(node)].join(" ");
}
export function borderWidth(node, unit = units.DEFAULT_UNIT) {
    if (!borderColor(node))
        return;
    return units[unit](node.strokeWeight);
}
export function borderStyle(node) {
    if (!borderColor(node))
        return;
    if (node.strokeDashes?.length)
        return "dashed";
    return "solid";
}
export function borderColor(node) {
    return parsePaints(node.strokes);
}
